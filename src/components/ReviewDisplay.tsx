import React from 'react';
import { Star, MessageSquare, CheckCircle, Calendar, Shield, User } from 'lucide-react';
import { Review, ReviewAggregate } from '../types';
import VerificationBadge from './VerificationBadge';

interface ReviewDisplayProps {
  reviews?: Review[];
  aggregate?: ReviewAggregate | null;
  variant?: 'badge' | 'listing' | 'dashboard' | 'checkout';
  maxReviews?: number;
  onViewAll?: () => void;
}

const categoryLabels: Record<string, string> = {
  communication: 'Communication',
  cleanliness: 'Cleanliness',
  safety: 'Safety',
  accuracy: 'Accuracy',
};

export default function ReviewDisplay({ 
  reviews = [], 
  aggregate, 
  variant = 'listing', 
  maxReviews = 3,
  onViewAll 
}: ReviewDisplayProps) {
  const displayReviews = reviews.slice(0, maxReviews);

  if (variant === 'badge') {
    const avg = aggregate?.average_rating || 0;
    const count = aggregate?.total_reviews || 0;
    if (count === 0) return null;
    return (
      <span className="flex items-center gap-1 text-sm text-gray-600">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="font-medium">{avg.toFixed(1)}</span>
        <span className="text-gray-400">({count} review{count !== 1 ? 's' : ''})</span>
      </span>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Reviews ({aggregate?.total_reviews || 0})
        </h4>
        
        {aggregate && (
          <div className="flex items-center gap-4 mb-4 p-3 bg-white rounded-lg">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{aggregate.average_rating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{aggregate.total_reviews} reviews</p>
            </div>
            <div className="flex-1 border-l border-gray-200 pl-4">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const value = aggregate.categories[key] || 0;
                return (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium">{value.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {displayReviews.map(review => (
            <div key={review.id} className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.reviewer?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{review.rating}</span>
                  {review.reviewer?.id_verification_status === 'verified' && (
                    <VerificationBadge status="verified" size="sm" showText={false} />
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 mb-2">"{review.comment}"</p>
              )}
              {review.categories && (
                <div className="flex gap-3 text-xs text-gray-500">
                  {Object.entries(review.categories).map(([key, value]) => (
                    <span key={key} className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {categoryLabels[key]}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {reviews.length > maxReviews && onViewAll && (
          <button onClick={onViewAll} className="w-full mt-4 py-2 text-blue-600 text-sm font-medium hover:text-blue-700">
            View all {reviews.length} reviews →
          </button>
        )}
      </div>
    );
  }

  // Dashboard variant - full list
  return (
    <div className="space-y-4">
      {aggregate && (
        <div className="bg-gray-50 rounded-xl p-5 mb-4">
          <div className="flex items-start gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">{aggregate.average_rating.toFixed(1)}</p>
              <p className="text-sm text-gray-500 mt-1">{aggregate.total_reviews} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const value = aggregate.categories[key] || 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-28">{label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-10">{value.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No reviews yet</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.reviewer?.full_name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(review.created_at).toLocaleDateString()}
                      {review.reviewer?.id_verification_status === 'verified' && (
                        <VerificationBadge status="verified" size="sm" showText={false} />
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{review.rating}</span>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-600 mb-3">"{review.comment}"</p>
              )}
              {review.categories && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(review.categories).map(([key, value]) => (
                    <span key={key} className="px-2 py-1 bg-gray-50 rounded-lg text-gray-600 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {categoryLabels[key]}: {value}
                    </span>
                  ))}
                </div>
              )}
              {review.booking && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {review.booking.listing ? `${review.booking.listing.estate_name} • ${review.booking.listing.bay_number}` : ''}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}