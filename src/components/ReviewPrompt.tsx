import React, { useState, useEffect } from 'react';
import { Star, X, MessageSquare, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import ReviewForm from './ReviewForm';

interface ReviewPromptProps {
  onClose: () => void;
  onSkip: () => void;
}

export default function ReviewPrompt({ onClose, onSkip }: ReviewPromptProps) {
  const { bookings, user, submitReview, fetchBookings } = useApp();
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [reviewerRole, setReviewerRole] = useState<'host' | 'renter'>('renter');
  const [revieweeId, setRevieweeId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Find completed bookings that haven't been reviewed
  useEffect(() => {
    const reviewedIds = JSON.parse(localStorage.getItem('reviewed_booking_ids') || '[]');
    const unreviewed = bookings.filter(b => 
      b.status === 'completed' && 
      !reviewedIds.includes(b.id)
    );
    
    if (unreviewed.length > 0) {
      const booking = unreviewed[0];
      setCurrentBooking(booking);
      // Determine if user is host or renter for this booking
      const isHost = booking.listing_id; // We'd need to check if user is host of listing
      // For now, check if user ID matches renter_id or if user is host
      if (booking.renter_id === user?.id) {
        setReviewerRole('renter');
        // Need to get host ID from listing
      } else {
        setReviewerRole('host');
      }
    }
  }, [bookings, user]);

  const handleSubmit = async (reviewData: any) => {
    setSubmitting(true);
    try {
      await submitReview({
        booking_id: currentBooking!.id,
        reviewee_id: revieweeId,
        reviewer_role: reviewerRole,
        rating: reviewData.rating,
        comment: reviewData.comment,
        categories: reviewData.categories,
        is_public: reviewData.isPublic,
      });
      
      // Mark as reviewed
      const reviewedIds = JSON.parse(localStorage.getItem('reviewed_booking_ids') || '[]');
      reviewedIds.push(currentBooking!.id);
      localStorage.setItem('reviewed_booking_ids', JSON.stringify(reviewedIds));
      
      setShowForm(false);
      setCurrentBooking(null);
      
      // Check for next review
      const updatedBookings = bookings.filter(b => 
        b.status === 'completed' && !reviewedIds.includes(b.id)
      );
      if (updatedBookings.length > 0) {
        // Will trigger useEffect to show next
      } else {
        onClose();
      }
    } catch (err: any) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (currentBooking) {
      const reviewedIds = JSON.parse(localStorage.getItem('reviewed_booking_ids') || '[]');
      reviewedIds.push(currentBooking.id);
      localStorage.setItem('reviewed_booking_ids', JSON.stringify(reviewedIds));
    }
    onSkip();
  };

  if (!currentBooking) {
    return null;
  }

  if (showForm) {
    return (
      <ReviewForm
        booking={currentBooking}
        reviewerRole={reviewerRole}
        revieweeId={revieweeId}
        onSubmit={handleSubmit}
        onCancel={() => setShowForm(false)}
        submitting={submitting}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">How was your parking experience?</h3>
              <p className="text-sm text-gray-500">Help others by sharing your feedback</p>
            </div>
          </div>
          <button onClick={handleSkip} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="font-medium text-gray-900 mb-1">{currentBooking.guest_name || 'Your booking'}</p>
          <p className="text-sm text-gray-500">{currentBooking.estate_name} • {currentBooking.bay_number}</p>
          <p className="text-sm text-gray-500">{currentBooking.start_date} → {currentBooking.end_date}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2 text-center">Rate your experience</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => {
                  setShowForm(true);
                  // Pre-fill rating
                }}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex flex-col items-center justify-center"
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-500 mt-1">{star} star{star > 1 ? 's' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSkip} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
            Skip for Now
          </button>
          <button onClick={() => setShowForm(true)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
            Write Review
          </button>
        </div>
      </div>
    </div>
  );
}
