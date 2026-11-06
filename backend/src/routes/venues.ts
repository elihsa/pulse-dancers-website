import express from 'express';
import { supabase } from '../config/database';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// List all venues
router.get('/', async (req, res) => {
  try {
    const { city, venue_type, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('venues')
      .select('*')
      .order('name');

    if (city) query = query.eq('city', city);
    if (venue_type) query = query.eq('venue_type', venue_type);

    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data: venues, error } = await query;

    if (error) throw error;

    res.json(venues);
  } catch (error: any) {
    console.error('Get venues error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch venues' });
  }
});

// Get venue details with upcoming events
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: venue, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Get upcoming events
    const { data: events, error: eventsError } = await supabase
      .from('venue_events')
      .select('*')
      .eq('venue_id', id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(20);

    if (eventsError) throw eventsError;

    res.json({ ...venue, upcoming_events: events });
  } catch (error: any) {
    console.error('Get venue error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch venue' });
  }
});

// Get upcoming events for a venue
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 90 } = req.query;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(days));

    const { data: events, error } = await supabase
      .from('venue_events')
      .select('*')
      .eq('venue_id', id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .lte('event_date', futureDate.toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) throw error;

    res.json(events);
  } catch (error: any) {
    console.error('Get venue events error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch events' });
  }
});

// Get all upcoming events (with multipliers)
router.get('/events/upcoming', async (req, res) => {
  try {
    const { days = 90, city, limit = 50 } = req.query;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(days));

    let query = supabase
      .from('venue_events')
      .select(`
        *,
        venue:venue_id (id, name, city, province, latitude, longitude)
      `)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .lte('event_date', futureDate.toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(Number(limit));

    if (city) {
      query = query.eq('venue.city', city);
    }

    const { data: events, error } = await query;

    if (error) throw error;

    res.json(events);
  } catch (error: any) {
    console.error('Get upcoming events error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch events' });
  }
});

// Get events near a location (for dynamic pricing)
router.get('/events/nearby', async (req, res) => {
  try {
    const { lat, lng, radius_km = 10, days = 30 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters required' });
    }

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(days));

    // For simplicity, get all events in the same city
    // In production, use PostGIS for proper radius search
    const { data: events, error } = await supabase
      .from('venue_events')
      .select(`
        *,
        venue:venue_id (id, name, city, province, latitude, longitude)
      `)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .lte('event_date', futureDate.toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) throw error;

    // Filter by distance (simple approximation)
    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const radius = Number(radius_km);

    const nearbyEvents = events?.filter(event => {
      const venueLat = event.venue?.latitude;
      const venueLng = event.venue?.longitude;
      if (!venueLat || !venueLng) return false;
      
      const distance = calculateDistance(userLat, userLng, venueLat, venueLng);
      return distance <= radius;
    }) || [];

    res.json(nearbyEvents);
  } catch (error: any) {
    console.error('Get nearby events error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch nearby events' });
  }
});

// Admin: Create venue
router.post('/', authenticate, async (req: any, res) => {
  try {
    const venueSchema = z.object({
      name: z.string().min(2),
      address: z.string().optional(),
      city: z.string().min(2),
      province: z.string().min(2),
      latitude: z.number(),
      longitude: z.number(),
      venue_type: z.enum(['stadium', 'arena', 'theatre', 'festival_ground', 'racecourse', 'convention_center']),
      capacity: z.number().int().positive().optional()
    });

    const data = venueSchema.parse(req.body);

    const { data: venue, error } = await supabase
      .from('venues')
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(venue);
  } catch (error: any) {
    console.error('Create venue error:', error);
    res.status(400).json({ error: error.message || 'Failed to create venue' });
  }
});

// Admin: Create event
router.post('/events', authenticate, async (req: any, res) => {
  try {
    const eventSchema = z.object({
      venue_id: z.string().uuid(),
      event_name: z.string().min(2),
      event_date: z.string().date(),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      expected_attendance: z.number().int().positive().optional(),
      multiplier_suggestion: z.number().min(1).max(10).default(2.0),
      source: z.enum(['manual', 'ticketmaster', 'web_scrape', 'api']).default('manual')
    });

    const data = eventSchema.parse(req.body);

    const { data: event, error } = await supabase
      .from('venue_events')
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(event);
  } catch (error: any) {
    console.error('Create event error:', error);
    res.status(400).json({ error: error.message || 'Failed to create event' });
  }
});

// Helper: Calculate distance between two lat/lng points (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;