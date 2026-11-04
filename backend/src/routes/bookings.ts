import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

const createBookingSchema = z.object({
  listing_id: z.string().uuid(),
  guest_name: z.string().min(1),
  guest_phone: z.string().min(10),
  guest_license_plate: z.string().min(1),
  start_date: z.string(),
  end_date: z.string(),
});

router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createBookingSchema.parse(req.body);

    // Fetch listing with estate info
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        estate:estates (name, city)
      `)
      .eq('id', data.listing_id)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const days = Math.ceil((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const total_amount = parseFloat(listing.price_per_day) * days;
    const platform_fee = total_amount * 0.15;
    const host_payout = total_amount - platform_fee;

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        listing_id: data.listing_id,
        renter_id: req.user.id,
        guest_name: data.guest_name,
        guest_phone: data.guest_phone,
        guest_license_plate: data.guest_license_plate,
        estate_name: listing.estate?.name || '',
        cluster_or_street: listing.cluster_or_street,
        bay_number: listing.bay_number,
        start_date: data.start_date,
        end_date: data.end_date,
        total_amount,
        platform_fee,
        host_payout,
        status: listing.booking_type === 'instant' ? 'confirmed' : 'pending',
        directions: listing.directions,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({ error: 'Failed to create booking' });
  }
});

router.get('/renter/my-bookings', authenticate, async (req: any, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('renter_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    console.error('Fetch renter bookings error:', error);
    res.status(400).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/host/my-bookings', authenticate, async (req: any, res) => {
  try {
    // First get the host's listing IDs
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('host_id', req.user.id);

    if (listingsError) throw listingsError;

    const listingIds = listings.map(l => l.id);

    if (listingIds.length === 0) {
      return res.json([]);
    }

    // Then get bookings for those listings
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        renter:users (full_name, email)
      `)
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(bookings);
  } catch (error) {
    console.error('Fetch host bookings error:', error);
    res.status(400).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/host/earnings', authenticate, async (req: any, res) => {
  try {
    // First get the host's listing IDs
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .eq('host_id', req.user.id);

    if (listingsError) throw listingsError;

    const listingIds = listings.map(l => l.id);

    if (listingIds.length === 0) {
      return res.json({ total: 0, pending: 0, released: 0 });
    }

    // Then get bookings for those listings
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('host_payout, status')
      .in('listing_id', listingIds);

    if (error) throw error;

    const total = bookings.reduce((sum, b) => sum + Number(b.host_payout), 0);
    const pending = bookings
      .filter(b => b.status === 'pending' || b.status === 'confirmed')
      .reduce((sum, b) => sum + Number(b.host_payout), 0);
    const released = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.host_payout), 0);

    res.json({ total, pending, released });
  } catch (error) {
    console.error('Fetch host earnings error:', error);
    res.status(400).json({ error: 'Failed to fetch host earnings' });
  }
});

export default router;