import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

// Create support chat for a booking
router.post('/chats', authenticate, async (req: any, res) => {
  try {
    const schema = z.object({
      booking_id: z.string().uuid(),
      priority: z.enum(['low', 'medium', 'high', 'emergency']).default('medium')
    });

    const data = schema.parse(req.body);
    const userId = req.user.id;

    // Verify booking exists and user is part of it
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, listing_id, renter_id')
      .eq('id', data.booking_id)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is renter or host of this listing
    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', booking.listing_id)
      .single();

    const isRenter = booking.renter_id === userId;
    const isHost = listing?.host_id === userId;

    if (!isRenter && !isHost) {
      return res.status(403).json({ error: 'Not authorized for this booking' });
    }

    // Check if chat already exists
    const { data: existingChat } = await supabase
      .from('support_chats')
      .select('id')
      .eq('booking_id', data.booking_id)
      .eq('user_id', userId)
      .single();

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create chat
    const { data: chat, error } = await supabase
      .from('support_chats')
      .insert({
        booking_id: data.booking_id,
        user_id: userId,
        status: 'open',
        priority: data.priority
      })
      .select()
      .single();

    if (error) throw error;

    // Add system message
    await supabase
      .from('support_messages')
      .insert({
        chat_id: chat.id,
        sender_id: userId,
        message: `Support chat opened by ${req.user.full_name}. Priority: ${data.priority}`,
        message_type: 'system'
      });

    // TODO: Notify other party (host/renter) and support team

    res.status(201).json(chat);
  } catch (error: any) {
    console.error('Create support chat error:', error);
    res.status(400).json({ error: error.message || 'Failed to create support chat' });
  }
});

// List user's support chats
router.get('/chats', authenticate, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('support_chats')
      .select(`
        id,
        booking_id,
        status,
        priority,
        created_at,
        resolved_at,
        booking:booking_id (
          id,
          start_date,
          end_date,
          listing:listing_id (id, estate_name, cluster_or_street, bay_number)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data: chats, error } = await query;

    if (error) throw error;

    res.json(chats);
  } catch (error: any) {
    console.error('Get support chats error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch support chats' });
  }
});

// Get chat with messages
router.get('/chats/:id', authenticate, async (req: any, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.id;

    const { data: chat, error } = await supabase
      .from('support_chats')
      .select(`
        *,
        booking:booking_id (
          id,
          start_date,
          end_date,
          listing:listing_id (id, estate_name, cluster_or_street, bay_number, host_id),
          renter:renter_id (id, full_name, email, phone)
        )
      `)
      .eq('id', chatId)
      .single();

    if (error || !chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Verify user is part of this chat
    if (chat.user_id !== userId && chat.booking?.listing?.host_id !== userId && chat.booking?.renter?.id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get messages
    const { data: messages, error: msgError } = await supabase
      .from('support_messages')
      .select(`
        id,
        message,
        message_type,
        created_at,
        sender:sender_id (id, full_name, email)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    res.json({ ...chat, messages });
  } catch (error: any) {
    console.error('Get support chat error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch chat' });
  }
});

// Send message in chat
router.post('/chats/:id/messages', authenticate, async (req: any, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user.id;

    const schema = z.object({
      message: z.string().min(1),
      message_type: z.enum(['text', 'image', 'location']).default('text')
    });

    const data = schema.parse(req.body);

    // Verify chat exists and user is participant
    const { data: chat } = await supabase
      .from('support_chats')
      .select('id, user_id, booking_id')
      .eq('id', chatId)
      .single();

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check if user is part of this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('listing_id, renter_id')
      .eq('id', chat.booking_id)
      .single();

    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', booking?.listing_id)
      .single();

    const isParticipant = chat.user_id === userId || 
      booking?.renter_id === userId || 
      listing?.host_id === userId;

    if (!isParticipant) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Add message
    const { data: message, error } = await supabase
      .from('support_messages')
      .insert({
        chat_id: chatId,
        sender_id: userId,
        message: data.message,
        message_type: data.message_type
      })
      .select()
      .single();

    if (error) throw error;

    // Update chat status if needed
    if (chat.status === 'open') {
      await supabase
        .from('support_chats')
        .update({ status: 'in_progress' })
        .eq('id', chatId);
    }

    // TODO: Send push/email notification to other participants

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Send support message error:', error);
    res.status(400).json({ error: error.message || 'Failed to send message' });
  }
});

// Update chat status (admin/support)
router.patch('/chats/:id/status', authenticate, async (req: any, res) => {
  try {
    const chatId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData: any = { status };
    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data: chat, error } = await supabase
      .from('support_chats')
      .update(updateData)
      .eq('id', chatId)
      .select()
      .single();

    if (error) throw error;

    // Add system message
    await supabase
      .from('support_messages')
      .insert({
        chat_id: chatId,
        sender_id: req.user.id,
        message: `Chat status changed to ${status}`,
        message_type: 'system'
      });

    res.json(chat);
  } catch (error: any) {
    console.error('Update chat status error:', error);
    res.status(400).json({ error: error.message || 'Failed to update chat status' });
  }
});

export default router;