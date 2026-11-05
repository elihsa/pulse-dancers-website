import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Clock, Star, Zap, Shield, Car } from 'lucide-react';
import { mockEstates } from '../../data/mockData';
import MapView from '../../components/MapView';

export default function Results() {
  const { searchResults, searchFilters, selectListing, setView, updateSearchFilters, performSearch } = useApp();

  const handleSelectListing = (listing: any) => {
    selectListing(listing);
    setView('checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setView('search')} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">Available Bays</h1>
            <p className="text-xs text-gray-500">{searchResults.length} results {searchFilters.estate && `• ${searchFilters.estate}`}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {searchResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center card-shadow">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Bays Found</h2>
            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
            <button onClick={() => setView('search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Modify Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl p-5 card-shadow hover:ring-2 hover:ring-blue-200 transition cursor-pointer" onClick={() => handleSelectListing(listing)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{listing.estate_name}</h3>
                      {listing.booking_type === 'instant' && (
                        <span className="badge-instant px-2 py-0.5 rounded-md text-xs font-bold text-white flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Instant
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {listing.cluster_or_street} • {listing.bay_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">R{listing.price_per_day}</p>
                    <p className="text-xs text-gray-400">per day</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {listing.walk_time_minutes} min walk to gate
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    {listing.rating} ({listing.review_count} reviews)
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    Verified Host
                                  </span>
                                </div>

                {listing.notes && (
                  <p className="mt-2 text-sm text-gray-400 italic">"{listing.notes}"</p>
                )}

                {/* Mini satellite map with bay marker */}
                {listing.map_marker && (() => {
                  const estate = mockEstates.find(e => e.id === listing.estate_id);
                  return estate ? (
                    <div className="mt-3">
                      <MapView
                        center={{ lat: listing.map_marker!.lat, lng: listing.map_marker!.lng }}
                        zoom={19}
                        marker={listing.map_marker}
                        height="150px"
                      />
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Satellite view — exact bay location marked
                      </p>
                    </div>
                  ) : null;
                })()}

                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-sm text-gray-500">Host: {listing.host_name}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    {listing.booking_type === 'instant' ? 'Book Now' : 'Request to Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
