import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';

const router = express.Router();

router.post('/initialize', authenticate, async (req: any, res) => {
  try {
    const { booking_id, email } = req.body;

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('renter_id', req.user.id)
      .single();

    if (error || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const reference = `PB-${Date.now()}-${booking_id}`;

    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id,
        paystack_reference: reference,
        amount: booking.total_amount,
        status: 'pending',
      });

    if (paymentError) throw paymentError;

    res.json({ reference, amount: booking.total_amount });
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(400).json({ error: 'Failed to initialize payment' });
  }
});

export default router;