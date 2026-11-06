import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

// Enhanced booking schema for v1.1.0
const createBookingSchema = z.object({
  listing_id: z.string().uuid(),
  guest_name: z.string().min(1),
  guest_phone: z.string().min(10),
  guest_license_plate: z.string().min(1),
  start_date: z.string().date(),
  end_date: z.string().date(),
  start_time: z.string().optional(), // HH:MM format
  end_time: z.string().optional(),
  access_code: z.string().optional(),
  guest_id: z.string().optional(), // Saved guest ID
});

router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createBookingSchema.parse(req.body);

    // Fetch listing with host info
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        estate:estates (name, city),
        host:users (id, full_name)
      `)
      .eq('id', data.listing_id)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if listing requires ID verified renter
    if (listing.requires_id_verified_renter) {
      const { data: renter } = await supabase
        .from('users')
        .select('id_verification_status')
        .eq('id', req.user.id)
        .single();

      if (renter?.id_verification_status !== 'verified') {
        return res.status(400).json({ 
          error: 'This listing requires ID verification. Please complete verification before booking.' 
        });
      }
    }

    // Calculate pricing with event multiplier
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    let pricePerDay = Number(listing.price_per_day);
    let isEventPricing = false;

    // Check for event-specific pricing
    if (listing.event_dates) {
      for (let i = 0; i < days; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (listing.event_dates[dateStr]) {
          pricePerDay = Math.round(pricePerDay * listing.event_dates[dateStr]);
          isEventPricing = true;
          break; // Use highest multiplier found
        }
      }
    } else if (listing.event_multiplier > 1) {
      pricePerDay = Math.round(pricePerDay * listing.event_multiplier);
      isEventPricing = true;
    }

    // Hourly pricing if start/end times provided
    let totalAmount: number;
    if (data.start_time && data.end_time && listing.price_per_hour) {
      const startMinutes = timeToMinutes(data.start_time);
      const endMinutes = timeToMinutes(data.end_time);
      const hours = Math.ceil((endMinutes - startMinutes) / 60);
      totalAmount = hours * Number(listing.price_per_hour);
      if (isEventPricing && listing.event_multiplier > 1) {
        totalAmount = Math.round(totalAmount * listing.event_multiplier);
      }
    } else {
      totalAmount = pricePerDay * days;
    }

    const platformFee = Math.round(totalAmount * 0.15);
    const hostPayout = totalAmount - platformFee;
    const depositAmount = Number(listing.deposit_amount) || 0;

    // Check deposit requirement
    if (depositAmount > 0) {
      // Verify renter can pay deposit (handled at payment step)
    }

    // If guest_id provided, use saved guest data
    let guestName = data.guest_name;
    let guestPhone = data.guest_phone;
    let guestLicensePlate = data.guest_license_plate;

    if (data.guest_id) {
      const { data: savedGuest } = await supabase
        .from('saved_guests')
        .select('guest_name, phone_number, license_plate, access_code')
        .eq('id', data.guest_id)
        .eq('renter_id', req.user.id)
        .single();

      if (savedGuest) {
        guestName = savedGuest.guest_name;
        guestPhone = savedGuest.phone_number;
        guestLicensePlate = savedGuest.license_plate;
        if (savedGuest.access_code && !data.access_code) {
          data.access_code = savedGuest.access_code;
        }
      }
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        listing_id: data.listing_id,
        renter_id: req.user.id,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_license_plate: guestLicensePlate,
        estate_name: listing.estate?.name || listing.venue_name || '',
        cluster_or_street: listing.cluster_or_street || listing.address_line_1 || '',
        bay_number: listing.bay_number || '1',
        start_date: data.start_date,
        end_date: data.end_date,
        start_time: data.start_time,
        end_time: data.end_time,
        total_amount: totalAmount,
        platform_fee: platformFee,
        host_payout: hostPayout,
        deposit_amount: depositAmount,
        deposit_status: depositAmount > 0 ? 'held' : 'none',
        status: listing.booking_type === 'instant' ? 'confirmed' : 'pending',
        access_code: data.access_code || listing.access_code || '',
        directions: listing.directions,
        house_rules: listing.house_rules,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ ...booking, is_event_pricing: isEventPricing });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(400).json({ error: error.message || 'Failed to create booking' });
  }
});

// Helper: Convert HH:MM to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// GET /api/bookings/renter/my-bookings
router.get('/renter/my-bookings', authenticate, async (req: any, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listing:listings (
          id, listing_type, price_per_day, price_per_hour, event_multiplier, event_dates,
          estate:estates (name, city), photos, amenities
        )
      `)
      .eq('renter_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(bookings);
  } catch (error: any) {
    console.error('Fetch renter bookings error:', error);
    res.status(400).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/host/my-bookings
router.get('/host/my-bookings', authenticate, async (req: any, res) => {
  try {
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('host_id', req.user.id);

    if (listingsError) throw listingsError;

    const listingIds = listings.map(l => l.id);

    if (listingIds.length === 0) {
      return res.json([]);
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        renter:users (full_name, email, phone, id_verification_status),
        listing:listings (id, listing_type, cluster_or_street, bay_number, address_line_1, city)
      `)
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(bookings);
  } catch (error: any) {
    console.error('Fetch host bookings error:', error);
    res.status(400).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/host/earnings
router.get('/host/earnings', authenticate, async (req: any, res) => {
  try {
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('host_id', req.user.id);

    if (listingsError) throw listingsError;

    const listingIds = listings.map(l => l.id);

    if (listingIds.length === 0) {
      return res.json({ total: 0, pending: 0, released: 0, held_deposits: 0 });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('host_payout, status, deposit_amount, deposit_status')
      .in('listing_id', listingIds);

    if (error) throw error;

    const total = bookings.reduce((sum, b) => sum + Number(b.host_payout), 0);
    const pending = bookings
      .filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'active')
      .reduce((sum, b) => sum + Number(b.host_payout), 0);
    const released = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.host_payout), 0);
    const heldDeposits = bookings
      .filter(b => b.deposit_status === 'held')
      .reduce((sum, b) => sum + Number(b.deposit_amount), 0);

    res.json({ total, pending, released, held_deposits: heldDeposits });
  } catch (error: any) {
    console.error('Fetch host earnings error:', error);
    res.status(400).json({ error: 'Failed to fetch host earnings' });
  }
});

// GET /api/bookings/host/earnings/history
router.get('/host/earnings/history', authenticate, async (req: any, res) => {
  try {
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('host_id', req.user.id);

    if (listingsError) throw listingsError;

    const listingIds = listings.map(l => l.id);

    if (listingIds.length === 0) {
      return res.json({ monthly: [], weekly: [], byListing: [] });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('host_payout, status, created_at, listing_id, deposit_amount, deposit_status')
      .in('listing_id', listingIds);

    if (error) throw error;

    // Monthly breakdown
    const monthlyMap = new Map<string, { month: string; bookings: number; total: number; pending: number; released: number }>();
    bookings.forEach(b => {
      const date = new Date(b.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const entry = monthlyMap.get(key) || { month: key, bookings: 0, total: 0, pending: 0, released: 0 };
      entry.bookings++;
      entry.total += Number(b.host_payout);
      if (b.status === 'pending' || b.status === 'confirmed' || b.status === 'active') entry.pending += Number(b.host_payout);
      if (b.status === 'completed') entry.released += Number(b.host_payout);
      monthlyMap.set(key, entry);
    });

    // Weekly breakdown (last 12 weeks)
    const weeklyMap = new Map<string, { week: string; bookings: number; total: number }>();
    bookings.forEach(b => {
      const date = new Date(b.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const key = weekStart.toISOString().split('T')[0];
      const entry = weeklyMap.get(key) || { week: key, bookings: 0, total: 0 };
      entry.bookings++;
      entry.total += Number(b.host_payout);
      weeklyMap.set(key, entry);
    });

    // By listing
    const byListingMap = new Map<string, { listing_id: string; listing_name: string; bookings: number; total: number; pending: number; released: number }>();
    for (const b of bookings) {
      const entry = byListingMap.get(b.listing_id) || { 
        listing_id: b.listing_id, 
        listing_name: '', 
        bookings: 0, 
        total: 0, 
        pending: 0, 
        released: 0 
      };
      entry.bookings++;
      entry.total += Number(b.host_payout);
      if (b.status === 'pending' || b.status === 'confirmed' || b.status === 'active') entry.pending += Number(b.host_payout);
      if (b.status === 'completed') entry.released += Number(b.host_payout);
      byListingMap.set(b.listing_id, entry);
    }

    // Fetch listing names
    const listingIdsArray = Array.from(byListingMap.keys());
    if (listingIdsArray.length > 0) {
      const { data: listingsData } = await supabase
        .from('listings')
        .select('id, estate_name, cluster_or_street, bay_number, address_line_1, city')
        .in('id', listingIdsArray);
      
      listingsData?.forEach(l => {
        const entry = byListingMap.get(l.id);
        if (entry) {
          entry.listing_name = l.estate_name 
            ? `${l.estate_name} - ${l.cluster_or_street} ${l.bay_number}`
            : `${l.address_line_1}, ${l.city}`;
        }
      });
    }

    res.json({
      monthly: Array.from(monthlyMap.values()).sort((a, b) => b.month.localeCompare(a.month)),
      weekly: Array.from(weeklyMap.values()).sort((a, b) => b.week.localeCompare(a.week)).slice(0, 12),
      byListing: Array.from(byListingMap.values()).sort((a, b) => b.total - a.total)
    });
  } catch (error: any) {
    console.error('Fetch host earnings history error:', error);
    res.status(400).json({ error: 'Failed to fetch earnings history' });
  }
});

// PATCH /api/bookings/:id/status
const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'active', 'completed', 'disputed', 'cancelled']),
  access_code: z.string().optional()
});

router.patch('/:id/status', authenticate, async (req: any, res) => {
  try {
    const { status, access_code } = updateStatusSchema.parse(req.body);

    // Verify host owns the listing
    const { data: booking } = await supabase
      .from('bookings')
      .select('listing_id, status')
      .eq('id', req.params.id)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', booking.listing_id)
      .single();

    if (!listing || listing.host_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['active', 'cancelled'],
      active: ['completed', 'disputed'],
      completed: [],
      disputed: ['completed', 'cancelled'],
      cancelled: []
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${booking.status} to ${status}` });
    }

    const updateData: any = { status };
    if (access_code !== undefined) updateData.access_code = access_code;
    if (status === 'completed') updateData.checkout_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(updated);
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(400).json({ error: error.message || 'Failed to update booking' });
  }
});

// POST /api/bookings/:id/cancel
router.post('/:id/cancel', authenticate, async (req: any, res) => {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('listing_id, renter_id, status, deposit_amount, deposit_status')
      .eq('id', req.params.id)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization (renter or host)
    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', booking.listing_id)
      .single();

    const isRenter = booking.renter_id === req.user.id;
    const isHost = listing?.host_id === req.user.id;

    if (!isRenter && !isHost) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    // Cancel booking
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Refund deposit if held
    if (booking.deposit_status === 'held') {
      await supabase
        .from('bookings')
        .update({ deposit_status: 'refunded' })
        .eq('id', req.params.id);
      
      // TODO: Trigger actual refund via Paystack
    }

    res.json(updated);
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(400).json({ error: error.message || 'Failed to cancel booking' });
  }
});

// POST /api/bookings/:id/checkin - Renter uploads check-in photo
router.post('/:id/checkin', authenticate, async (req: any, res) => {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('renter_id, status')
      .eq('id', req.params.id)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.renter_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the renter can check in' });
    }

    if (booking.status !== 'confirmed' && booking.status !== 'active') {
      return res.status(400).json({ error: 'Booking must be confirmed or active to check in' });
    }

    // Photo URL would come from multipart upload
    // For now, accept URL in body
    const { photo_url } = req.body;
    
    if (!photo_url) {
      return res.status(400).json({ error: 'Photo URL required' });
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        checkin_photo_url: photo_url,
        checkin_at: new Date().toISOString(),
        status: 'active'
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // TODO: Notify host of check-in

    res.json(updated);
  } catch (error: any) {
    console.error('Check-in error:', error);
    res.status(400).json({ error: error.message || 'Failed to check in' });
  }
});

// POST /api/bookings/:id/checkout - Renter uploads check-out photo
router.post('/:id/checkout', authenticate, async (req: any, res) => {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('renter_id, status, deposit_amount, deposit_status')
      .eq('id', req.params.id)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.renter_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the renter can check out' });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({ error: 'Booking must be active to check out' });
    }

    const { photo_url } = req.body;
    
    if (!photo_url) {
      return res.status(400).json({ error: 'Photo URL required' });
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        checkout_photo_url: photo_url,
        checkout_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Auto-refund deposit after 24h if no dispute
    if (booking.deposit_status === 'held') {
      // Schedule refund job (would use cron/queue in production)
      setTimeout(async () => {
        const { data: checkBooking } = await supabase
          .from('bookings')
          .select('deposit_status')
          .eq('id', req.params.id)
          .single();
        
        if (checkBooking?.deposit_status === 'held') {
          await supabase
            .from('bookings')
            .update({ deposit_status: 'refunded' })
            .eq('id', req.params.id);
          // TODO: Trigger Paystack refund
        }
      }, 24 * 60 * 60 * 1000); // 24 hours
    }

    res.json(updated);
  } catch (error: any) {
    console.error('Check-out error:', error);
    res.status(400).json({ error: error.message || 'Failed to check out' });
  }
});

// POST /api/bookings/:id/deposit/refund - Host refunds deposit
router.post('/:id/deposit/refund', authenticate, async (req: any, res) => {
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('listing_id, deposit_status')
      .eq('id', req.params.id)
      .single();

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', booking.listing_id)
      .single();

    if (!listing || listing.host_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.deposit_status !== 'held') {
      return res.status(400).json({ error: 'No deposit to refund' });
    }

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ deposit_status: 'refunded' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // TODO: Trigger Paystack refund

    res.json(updated);
  } catch (error: any) {
    console.error('Refund deposit error:', error);
    res.status(400).json({ error: error.message || 'Failed to refund deposit' });
  }
});

export default router;