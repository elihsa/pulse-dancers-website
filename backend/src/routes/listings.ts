import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

// Enhanced listing schema for v1.1.0
const createListingSchema = z.object({
  listing_type: z.enum(['estate_bay', 'residential_driveway', 'garage', 'commercial_lot']).default('estate_bay'),
  estate_id: z.string().uuid().optional(), // Required for estate_bay
  cluster_or_street: z.string().min(1).optional(),
  bay_number: z.string().min(1).optional(),
  address_line_1: z.string().optional(), // For non-estate
  address_line_2: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price_per_day: z.number().positive(),
  price_per_hour: z.number().positive().optional(),
  event_multiplier: z.number().min(1).max(10).default(1.0),
  event_dates: z.record(z.number()).optional(), // {"2026-11-15": 3.0}
  venue_name: z.string().optional(),
  booking_type: z.enum(['instant', 'request']).default('instant'),
  walk_time_minutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
  directions: z.string().optional(),
  house_rules: z.string().optional(),
  amenities: z.object({
    cctv: z.boolean().optional(),
    covered: z.boolean().optional(),
    ev_charger: z.boolean().optional(),
    lighting: z.boolean().optional(),
    '24_7_access': z.boolean().optional(),
  }).optional(),
  capacity: z.number().int().positive().default(1),
  requires_id_verified_renter: z.boolean().default(false),
  deposit_amount: z.number().min(0).max(5000).default(0),
  map_marker_lat: z.number().optional(),
  map_marker_lng: z.number().optional(),
  photos: z.array(z.string().url()).optional(),
}).refine(data => {
  // Estate bay requires estate_id
  if (data.listing_type === 'estate_bay' && !data.estate_id) {
    return false;
  }
  // Non-estate requires address
  if (data.listing_type !== 'estate_bay' && !data.address_line_1) {
    return false;
  }
  return true;
}, {
  message: 'Estate bay requires estate_id; non-estate requires address_line_1',
  path: ['listing_type']
});

const updateListingSchema = createListingSchema.partial();

const listingFiltersSchema = z.object({
  estate: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  listing_type: z.enum(['estate_bay', 'residential_driveway', 'garage', 'commercial_lot']).optional(),
  booking_type: z.enum(['instant', 'request']).optional(),
  min_price: z.number().positive().optional(),
  max_price: z.number().positive().optional(),
  min_price_per_hour: z.number().positive().optional(),
  max_price_per_hour: z.number().positive().optional(),
  amenities: z.array(z.enum(['cctv', 'covered', 'ev_charger', 'lighting', '24_7_access'])).optional(),
  requires_verified_renter: z.boolean().optional(),
  host_verified: z.boolean().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius_km: z.number().positive().optional(),
  venue_name: z.string().optional(),
  date: z.string().date().optional(), // For event pricing calculation
});

// GET /api/listings - Public listing search with filters
router.get('/', async (req, res) => {
  try {
    const filters = listingFiltersSchema.parse(req.query);
    const checkDate = filters.date ? new Date(filters.date) : null;

    let query = supabase
      .from('listings')
      .select(`
        *,
        estate:estates (name, city),
        host:users (id, full_name, id_verification_status, rating, review_count)
      `)
      .eq('is_active', true);

    // Apply filters
    if (filters.estate) {
      query = query.ilike('estate.name', `%${filters.estate}%`);
    }
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.province) {
      query = query.eq('province', filters.province);
    }
    if (filters.listing_type) {
      query = query.eq('listing_type', filters.listing_type);
    }
    if (filters.booking_type) {
      query = query.eq('booking_type', filters.booking_type);
    }
    if (filters.min_price) {
      query = query.gte('price_per_day', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price_per_day', filters.max_price);
    }
    if (filters.requires_verified_renter !== undefined) {
      query = query.eq('requires_id_verified_renter', filters.requires_verified_renter);
    }
    if (filters.venue_name) {
      query = query.ilike('venue_name', `%${filters.venue_name}%`);
    }

    // Host verification filter
    if (filters.host_verified) {
      query = query.eq('host.id_verification_status', 'verified');
    }

    // Amenities filter (JSONB contains)
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(amenity => {
        query = query.contains('amenities', { [amenity]: true });
      });
    }

    // Location-based search (PostGIS would be better, using simple bounding box)
    if (filters.lat && filters.lng && filters.radius_km) {
      const lat = filters.lat;
      const lng = filters.lng;
      const radiusDeg = filters.radius_km / 111; // Approximate degrees per km
      query = query
        .gte('latitude', lat - radiusDeg)
        .lte('latitude', lat + radiusDeg)
        .gte('longitude', lng - radiusDeg)
        .lte('longitude', lng + radiusDeg);
    }

    const { data: listings, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate effective price for date if provided
    const listingsWithPrice = listings?.map(listing => {
      let effectivePrice = listing.price_per_day;
      let effectiveHourlyPrice = listing.price_per_hour;

      if (checkDate && listing.event_dates) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (listing.event_dates[dateStr]) {
          effectivePrice = Math.round(listing.price_per_day * listing.event_dates[dateStr]);
          if (listing.price_per_hour) {
            effectiveHourlyPrice = Math.round(listing.price_per_hour * listing.event_dates[dateStr]);
          }
        } else if (listing.event_multiplier > 1) {
          effectivePrice = Math.round(listing.price_per_day * listing.event_multiplier);
          if (listing.price_per_hour) {
            effectiveHourlyPrice = Math.round(listing.price_per_hour * listing.event_multiplier);
          }
        }
      }

      return {
        ...listing,
        effective_price_per_day: effectivePrice,
        effective_price_per_hour: effectiveHourlyPrice,
        is_event_pricing: effectivePrice !== listing.price_per_day
      };
    }) || [];

    res.json(listingsWithPrice);
  } catch (error: any) {
    console.error('Listings fetch error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch listings' });
  }
});

// GET /api/listings/types - Get listing type definitions
router.get('/types', (req, res) => {
  res.json([
    {
      value: 'estate_bay',
      label: 'Estate/Complex Bay',
      description: 'Parking bay in a secure estate with access codes',
      icon: '🏘️',
      requires_id_verification: false,
      typical_amenities: ['Access code', 'Estate security', 'Guard at gate']
    },
    {
      value: 'residential_driveway',
      label: 'Residential Driveway',
      description: 'Private driveway at a home near venues/transit',
      icon: '🏠',
      requires_id_verification: true,
      typical_amenities: ['Key lockbox', 'Host handoff', 'CCTV', 'Lighting']
    },
    {
      value: 'garage',
      label: 'Garage',
      description: 'Secure garage parking',
      icon: '🚗',
      requires_id_verification: true,
      typical_amenities: ['Remote access', 'Covered', 'CCTV', 'EV charger ready']
    },
    {
      value: 'commercial_lot',
      label: 'Commercial Lot',
      description: 'Business parking lot for overflow/events',
      icon: '🏢',
      requires_id_verification: false,
      typical_amenities: ['Attendant', 'Boom gate', 'Lighting', '24/7 access']
    }
  ]);
});

// GET /api/listings/amenities - Get available amenities
router.get('/amenities', (req, res) => {
  res.json([
    { key: 'cctv', label: 'CCTV Security', icon: '📹' },
    { key: 'covered', label: 'Covered Parking', icon: '☔' },
    { key: 'ev_charger', label: 'EV Charger', icon: '⚡' },
    { key: 'lighting', label: 'Good Lighting', icon: '💡' },
    { key: '24_7_access', label: '24/7 Access', icon: '🕐' }
  ]);
});

// GET /api/listings/host/my-listings
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

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const { date } = req.query;
    const checkDate = date ? new Date(date as string) : null;

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        estate:estates (name, city, province),
        host:users (id, full_name, phone, id_verification_status, rating, review_count, email_verified)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Calculate effective price for date
    let effectivePrice = listing.price_per_day;
    let effectiveHourlyPrice = listing.price_per_hour;

    if (checkDate && listing.event_dates) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (listing.event_dates[dateStr]) {
        effectivePrice = Math.round(listing.price_per_day * listing.event_dates[dateStr]);
        if (listing.price_per_hour) {
          effectiveHourlyPrice = Math.round(listing.price_per_hour * listing.event_dates[dateStr]);
        }
      } else if (listing.event_multiplier > 1) {
        effectivePrice = Math.round(listing.price_per_day * listing.event_multiplier);
        if (listing.price_per_hour) {
          effectiveHourlyPrice = Math.round(listing.price_per_hour * listing.event_multiplier);
        }
      }

    res.json({
      ...listing,
      effective_price_per_day: effectivePrice,
      effective_price_per_hour: effectiveHourlyPrice,
      is_event_pricing: effectivePrice !== listing.price_per_day
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(400).json({ error: 'Failed to fetch listing' });
  }
});

// POST /api/listings - Create listing
router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = createListingSchema.parse(req.body);

    // Verify host ID verification for residential/garage
    if (['residential_driveway', 'garage'].includes(data.listing_type)) {
      const { data: host } = await supabase
        .from('users')
        .select('id_verification_status')
        .eq('id', req.user.id)
        .single();

      if (host?.id_verification_status !== 'verified') {
        return res.status(400).json({ 
          error: 'ID verification required for residential/garage listings. Please complete verification first.' 
        });
      }
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        host_id: req.user.id,
        listing_type: data.listing_type,
        estate_id: data.estate_id,
        cluster_or_street: data.cluster_or_street,
        bay_number: data.bay_number,
        address_line_1: data.address_line_1,
        address_line_2: data.address_line_2,
        suburb: data.suburb,
        city: data.city,
        province: data.province,
        latitude: data.latitude,
        longitude: data.longitude,
        price_per_day: data.price_per_day,
        price_per_hour: data.price_per_hour,
        event_multiplier: data.event_multiplier,
        event_dates: data.event_dates,
        venue_name: data.venue_name,
        booking_type: data.booking_type,
        walk_time_minutes: data.walk_time_minutes,
        notes: data.notes,
        directions: data.directions,
        house_rules: data.house_rules,
        amenities: data.amenities,
        capacity: data.capacity,
        requires_id_verified_renter: data.requires_id_verified_renter,
        deposit_amount: data.deposit_amount,
        map_marker_lat: data.map_marker_lat,
        map_marker_lng: data.map_marker_lng,
        photos: data.photos,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(listing);
  } catch (error: any) {
    console.error('Create listing error:', error);
    res.status(400).json({ error: error.message || 'Failed to create listing' });
  }
});

// PUT /api/listings/:id
router.put('/:id', authenticate, async (req: any, res) => {
  try {
    const data = updateListingSchema.parse(req.body);

    // Verify ownership
    const { data: existing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', req.params.id)
      .single();

    if (!existing || existing.host_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    // Verify host ID verification if changing to residential/garage
    if (data.listing_type && ['residential_driveway', 'garage'].includes(data.listing_type)) {
      const { data: host } = await supabase
        .from('users')
        .select('id_verification_status')
        .eq('id', req.user.id)
        .single();

      if (host?.id_verification_status !== 'verified') {
        return res.status(400).json({ 
          error: 'ID verification required for residential/garage listings.' 
        });
      }
    }

    const { data: listing, error } = await supabase
      .from('listings')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(listing);
  } catch (error: any) {
    console.error('Update listing error:', error);
    res.status(400).json({ error: error.message || 'Failed to update listing' });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    // Verify ownership
    const { data: existing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', req.params.id)
      .single();

    if (!existing || existing.host_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('Delete listing error:', error);
    res.status(400).json({ error: error.message || 'Failed to delete listing' });
  }
});

export default router;