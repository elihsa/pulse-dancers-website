import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import { Booking } from '../types';

interface ReviewFormProps {
  booking: Booking;
  reviewerRole: 'host' | 'renter';
  revieweeId: string;
  onSubmit: (data: {
    rating: number;
    comment?: string;
    categories?: { communication: number; cleanliness: number; safety: number; accuracy: number };
    isPublic: boolean;
  }) => void;
  onCancel: () => void;
  submitting?: boolean;
}

const categories = [
  { key: 'communication', label: 'Communication', desc: 'Responsiveness and clarity' },
  { key: 'cleanliness', label: 'Cleanliness', desc: 'Condition of the parking space' },
  { key: 'safety', label: 'Safety', desc: 'Security and peace of mind' },
  { key: 'accuracy', label: 'Accuracy', desc: 'Listing matched description' },
];

export default function ReviewForm({ booking, reviewerRole, revieweeId, onSubmit, onCancel, submitting }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({
    communication: 5,
    cleanliness: 5,
    safety: 5,
    accuracy: 5,
  });
  const [isPublic, setIsPublic] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment: comment || undefined,
      categories: showCategories ? categoryRatings : undefined,
      isPublic,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Write a Review</h3>
              <p className="text-sm text-gray-500">
                {reviewerRole === 'renter' ? 'Reviewing host' : 'Reviewing guest'}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
            <div className="flex justify-center gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-12 h-12 rounded-xl transition flex flex-col items-center justify-center ${
                    star <= rating 
                      ? 'bg-yellow-100 border-2 border-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  <span className="text-xs text-gray-500 mt-1">{star}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCategories}
                onChange={e => setShowCategories(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Add detailed ratings</span>
            </label>
            <p className="text-xs text-gray-500 ml-6 mt-1">Rate specific aspects (optional)</p>
          </div>

          {showCategories && (
            <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
              {categories.map(cat => (
                <div key={cat.key}>
                  <div className="flex justify-between mb-1">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cat.label}</p>
                      <p className="text-xs text-gray-500">{cat.desc}</p>
                    </div>
                    <span className="font-bold text-gray-900">{categoryRatings[cat.key]}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={`${cat.key}-${star}`}
                        type="button"
                        onClick={() => setCategoryRatings(prev => ({ ...prev, [cat.key]: star }))}
                        className={`flex-1 h-10 rounded-lg transition ${
                          star <= categoryRatings[cat.key]
                            ? 'bg-blue-100 border border-blue-300 text-blue-600'
                            : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-500'
                        }`}
                      >
                        <Star className={`w-5 h-5 mx-auto ${star <= categoryRatings[cat.key] ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review (optional)</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Share your experience... (max 500 characters)"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Make this review public (shown on your profile and the listing)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onCancel} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
