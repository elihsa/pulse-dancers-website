import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

const createListingSchema = z.object({
  estate_id: z.string().uuid(),
  cluster_or_street: z.string().min(1),
  bay_number: z.string().min(1),
  price_per_day: z.number().positive(),
  booking_type: z.enum(['instant', 'request']).default('instant'),
  walk_time_minutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
  directions: z.string().optional(),
  map_marker_lat: z.number().optional(),
  map_marker_lng: z.number().optional(),
});

router.get('/', async (req, res) => {
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select(`
        *,
        estate:estates (name, city),
        host:users (full_name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(listings);
  } catch (error) {
    console.error('Listings fetch error:', error);
    res.status(400).json({ error: 'Failed to fetch listings' });
  }
});

router.get('/host/my-listings', authenticate, async (req: any, res) => {
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select(`
        *,
        estate:estates (name, city),
        host:users (full_name)
      `)
      .eq('host_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(listings);
  } catch (error) {
    console.error('Fetch host listings error:', error);
    res.status(400).json({ error: 'Failed to fetch host listings' });
  }
});

router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createListingSchema.parse(req.body);

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        host_id: req.user.id,
        estate_id: data.estate_id,
        cluster_or_street: data.cluster_or_street,
        bay_number: data.bay_number,
        price_per_day: data.price_per_day,
        booking_type: data.booking_type,
        walk_time_minutes: data.walk_time_minutes,
        notes: data.notes,
        directions: data.directions,
        map_marker_lat: data.map_marker_lat,
        map_marker_lng: data.map_marker_lng,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(400).json({ error: 'Failed to create listing' });
  }
});

export default router;