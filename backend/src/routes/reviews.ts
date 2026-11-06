import express from 'express';
import { authenticate } from '../middleware/auth';
import { supabase } from '../config/database';
import { z } from 'zod';

const router = express.Router();

// Submit a review (after booking completed)
const reviewSchema = z.object({
  booking_id: z.string().uuid(),
  reviewee_id: z.string().uuid(),
  reviewer_role: z.enum(['host', 'renter']),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  categories: z.object({
    communication: z.number().int().min(1).max(5),
    cleanliness: z.number().int().min(1).max(5),
    safety: z.number().int().min(1).max(5),
    accuracy: z.number().int().min(1).max(5)
  }).optional(),
  is_public: z.boolean().default(true)
});

router.post('/', authenticate, async (req: any, res) => {
  try {
    const data = reviewSchema.parse(req.body);
    const reviewerId = req.user.id;

    // Verify booking exists and is completed
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, status, listing_id, renter_id')
      .eq('id', data.booking_id)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    // Verify reviewer is part of this booking
    const isHost = booking.listing_id; // We'd need to check if user is host of this listing
    const isRenter = booking.renter_id === reviewerId;

    // Get listing to check host
    const { data: listing } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', booking.listing_id)
      .single();

    const isBookingHost = listing?.host_id === reviewerId;

    if (!isRenter && !isBookingHost) {
      return res.status(403).json({ error: 'Not authorized to review this booking' });
    }

    // Determine reviewee based on reviewer role
    let expectedRevieweeId: string;
    if (data.reviewer_role === 'host') {
      expectedRevieweeId = booking.renter_id;
    } else {
      expectedRevieweeId = listing?.host_id;
    }

    if (data.reviewee_id !== expectedRevieweeId) {
      return res.status(400).json({ error: 'Invalid reviewee for this booking' });
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', data.booking_id)
      .single();

    if (existingReview) {
      return res.status(400).json({ error: 'Review already submitted for this booking' });
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        booking_id: data.booking_id,
        reviewer_id: reviewerId,
        reviewee_id: data.reviewee_id,
        reviewer_role: data.reviewer_role,
        rating: data.rating,
        comment: data.comment,
        categories: data.categories,
        is_public: data.is_public
      })
      .select()
      .single();

    if (error) throw error;

    // Update reviewee's aggregate rating (on their profile/listings)
    await updateUserRating(data.reviewee_id);

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error: any) {
    console.error('Submit review error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit review' });
  }
});

// Get reviews for a host
router.get('/host/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        categories,
        created_at,
        reviewer:reviewer_id (id, full_name),
        booking:booking_id (id, start_date, end_date, listing:listing_id (id, cluster_or_street, bay_number, estate_name))
      `)
      .eq('reviewee_id', hostId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    // Calculate aggregate stats
    const { data: stats } = await supabase
      .from('reviews')
      .select('rating, categories')
      .eq('reviewee_id', hostId)
      .eq('is_public', true);

    const aggregate = stats?.length > 0 ? {
      average_rating: stats.reduce((sum, r) => sum + r.rating, 0) / stats.length,
      total_reviews: stats.length,
      categories: stats.reduce((acc, r) => {
        if (r.categories) {
          Object.keys(r.categories).forEach(key => {
            acc[key] = (acc[key] || 0) + r.categories[key];
          });
        }
        return acc;
      }, {} as Record<string, number>)
    } : null;

    if (aggregate && aggregate.categories) {
      Object.keys(aggregate.categories).forEach(key => {
        aggregate.categories[key] = Math.round((aggregate.categories[key] / aggregate.total_reviews) * 10) / 10;
      });
    }

    res.json({ reviews, aggregate });
  } catch (error: any) {
    console.error('Get host reviews error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch reviews' });
  }
});

// Get reviews for a renter
router.get('/renter/:renterId', async (req, res) => {
  try {
    const { renterId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        categories,
        created_at,
        reviewer:reviewer_id (id, full_name),
        booking:booking_id (id, start_date, end_date, listing:listing_id (id, cluster_or_street, bay_number, estate_name))
      `)
      .eq('reviewee_id', renterId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    res.json(reviews);
  } catch (error: any) {
    console.error('Get renter reviews error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch reviews' });
  }
});

// Get reviews for a listing
router.get('/listing/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        categories,
        created_at,
        reviewer:reviewer_id (id, full_name, id_verification_status),
        booking:booking_id (id, start_date, end_date)
      `)
      .eq('is_public', true)
      .in('booking_id', supabase
        .from('bookings')
        .select('id')
        .eq('listing_id', listingId)
      )
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) throw error;

    res.json(reviews);
  } catch (error: any) {
    console.error('Get listing reviews error:', error);
    res.status(400).json({ error: error.message || 'Failed to fetch reviews' });
  }
});

// Helper function to update user's aggregate rating
async function updateUserRating(userId: string) {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', userId)
    .eq('is_public', true);

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from('users')
      .update({ rating: Math.round(avgRating * 10) / 10, review_count: reviews.length })
      .eq('id', userId);
  }
}

export default router;