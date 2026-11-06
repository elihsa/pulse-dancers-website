import { api } from './api';

export interface ReviewSubmit {
  booking_id: string;
  reviewee_id: string;
  reviewer_role: 'host' | 'renter';
  rating: number;
  comment?: string;
  categories?: {
    communication: number;
    cleanliness: number;
    safety: number;
    accuracy: number;
  };
  is_public?: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  reviewer_role: 'host' | 'renter';
  rating: number;
  comment: string | null;
  categories: {
    communication: number;
    cleanliness: number;
    safety: number;
    accuracy: number;
  } | null;
  is_public: boolean;
  created_at: string;
  reviewer?: {
    id: string;
    full_name: string;
    id_verification_status?: string;
  };
  booking?: {
    id: string;
    start_date: string;
    end_date: string;
    listing?: {
      id: string;
      cluster_or_street: string;
      bay_number: string;
      estate_name: string;
    };
  };
}

export interface ReviewAggregate {
  average_rating: number;
  total_reviews: number;
  categories: Record<string, number>;
}

export interface HostReviewsResponse {
  reviews: Review[];
  aggregate: ReviewAggregate | null;
}

export const reviewsAPI = {
  submit: async (data: ReviewSubmit) => {
    return api.post('/reviews', data);
  },

  getHostReviews: async (hostId: string, params?: { limit?: number; offset?: number }): Promise<HostReviewsResponse> => {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    return api.get(`/reviews/host/${hostId}?${query.toString()}`);
  },

  getRenterReviews: async (renterId: string, params?: { limit?: number; offset?: number }): Promise<Review[]> => {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    return api.get(`/reviews/renter/${renterId}?${query.toString()}`);
  },

  getListingReviews: async (listingId: string, params?: { limit?: number; offset?: number }): Promise<Review[]> => {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    return api.get(`/reviews/listing/${listingId}?${query.toString()}`);
  },

  respond: async (reviewId: string, response: string) => {
    return api.post(`/reviews/${reviewId}/respond`, { response });
  },
};
