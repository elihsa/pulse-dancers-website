import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Filter, X, Star, Shield, Zap, Map as MapIcon, Minus, Plus } from 'lucide-react';
import { Estate, Listing, MapMarker } from '../types';

interface EstateBayMapProps {
  estate: Estate;
  listings: Listing[];
  userCluster?: string;
  selectedListingId?: string;
  onListingClick: (listing: Listing) => void;
  onViewListings: () => void;
  height?: string;
}

interface ClusterGroup {
  cluster: string;
  listings: Listing[];
  center: { lat: number; lng: number };
}

export default function EstateBayMap({ 
  estate, 
  listings, 
  userCluster, 
  selectedListingId, 
  onListingClick, 
  onViewListings,
  height = '500px'
}: EstateBayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const clusterLabelsRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    bookingTypes: ['instant', 'request'] as ('instant' | 'request')[],
    amenities: [] as string[],
    verifiedOnly: false,
  });

  // Group listings by cluster
  const clusters = useMemo((): ClusterGroup[] => {
    const groups: Record<string, Listing[]> = {};
    listings.forEach(listing => {
      const key = listing.cluster_or_street || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(listing);
    });
    
    return Object.entries(groups).map(([cluster, listings]) => {
      const validListings = listings.filter(l => l.map_marker);
      if (validListings.length === 0) {
        return { cluster, listings, center: { lat: estate.lat, lng: estate.lng } };
      }
      const center = {
        lat: validListings.reduce((sum, l) => sum + l.map_marker!.lat, 0) / validListings.length,
        lng: validListings.reduce((sum, l) => sum + l.map_marker!.lng, 0) / validListings.length,
      };
      return { cluster, listings, center };
    });
  }, [listings, estate]);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      if (l.price_per_day < filters.priceMin || l.price_per_day > filters.priceMax) return false;
      if (!filters.bookingTypes.includes(l.booking_type)) return false;
      if (filters.verifiedOnly && l.rating === 0) return false; // Simplified check
      return true;
    });
  }, [listings, filters]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [estate.lat, estate.lng],
      zoom: estate.zoom,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '',
      maxZoom: 19,
    }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.6,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [estate]);

  // Update markers when listings or filters change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    clusterLabelsRef.current.forEach(m => m.remove());
    clusterLabelsRef.current = [];

    // Add bay markers for filtered listings
    filteredListings.forEach(listing => {
      if (!listing.map_marker) return;
      
      const isSelected = listing.id === selectedListingId;
      
      const markerIcon = L.divIcon({
        className: 'custom-bay-marker',
        html: `
          <div style="
            width: ${isSelected ? '40' : '32'}px;
            height: ${isSelected ? '40' : '32'}px;
            background: #dc2626;
            border: ${isSelected ? '4px' : '3px'} solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${isSelected ? '16px' : '14px'};
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            z-index: ${isSelected ? '1000' : '100'};
          ">✕</div>
        `,
        iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
        iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
      });

      const marker = L.marker([listing.map_marker.lat, listing.map_marker.lng], { 
        icon: markerIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(mapInstanceRef.current!);

      marker.on('click', () => onListingClick(listing));
      
      // Popup
      marker.bindPopup(`
        <div style="min-width: 200px; padding: 4px;">
          <div style="font-weight: bold; color: #1f2937;">${listing.estate_name} • ${listing.cluster_or_street}</div>
          <div style="color: #dc2626; font-weight: bold; margin: 4px 0;">${listing.bay_number}</div>
          <div style="display: flex; gap: 8px; margin: 4px 0; font-size: 12px;">
            <span style="background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px;">R${listing.price_per_day}/day</span>
            ${listing.booking_type === 'instant' ? '<span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px;">⚡ Instant</span>' : '<span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px;">📋 Request</span>'}
          </div>
          <div style="font-size: 12px; color: #6b7280; margin: 4px 0;">🚶 ${listing.walk_time_minutes} min walk</div>
          <div style="font-size: 12px; color: #6b7280; margin: 4px 0;">⭐ ${listing.rating} (${listing.review_count} reviews)</div>
          ${listing.rating > 0 ? '<div style="font-size: 12px; color: #10b981; margin: 4px 0;">🟢 Verified Host</div>' : ''}
          <button onclick="window.dispatchEvent(new CustomEvent('bay-click', {detail: '${listing.id}'}))" style="width: 100%; margin-top: 8px; padding: 8px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: bold;">View Details</button>
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Add cluster labels
    clusters.forEach(group => {
      if (group.listings.length > 1) {
        const labelIcon = L.divIcon({
          className: 'cluster-label',
          html: `
            <div style="
              background: rgba(0,0,0,0.7);
              color: white;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              ${group.cluster} (${group.listings.length} bays)
            </div>
          `,
          iconSize: [100, 30],
          iconAnchor: [50, 15],
        });

        const label = L.marker([group.center.lat, group.center.lng], { 
          icon: labelIcon,
          interactive: false,
        }).addTo(mapInstanceRef.current!);

        clusterLabelsRef.current.push(label);
      }
    });

    // Add user cluster marker if provided
    if (userCluster) {
      const userClusterData = clusters.find(c => c.cluster === userCluster);
      if (userClusterData) {
        if (userMarkerRef.current) userMarkerRef.current.remove();
        
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background: #2563eb;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              animation: pulse 2s infinite;
            "></div>
            <style>
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
                100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
              }
            </style>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        userMarkerRef.current = L.marker([userClusterData.center.lat, userClusterData.center.lng], { 
          icon: userIcon,
        }).addTo(mapInstanceRef.current!);

        userMarkerRef.current.bindTooltip('Your cluster: ' + userCluster, { 
          permanent: false, 
          direction: 'top',
          offset: [0, -15],
        });
      }
    }
  }, [filteredListings, selectedListingId, userCluster, clusters, estate, onListingClick]);

  // Listen for popup button clicks
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const listingId = e.detail;
      const listing = listings.find(l => l.id === listingId);
      if (listing) onListingClick(listing);
    };
    window.addEventListener('bay-click', handler as EventListener);
    return () => window.removeEventListener('bay-click', handler as EventListener);
  }, [listings, onListingClick]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const listingsWithMarkers = listings.filter(l => l.map_marker).length;
  const listingsWithoutMarkers = listings.length - listingsWithMarkers;

  return (
    <div className="relative">
      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Legend / Info */}
      <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-64 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MapIcon className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">{estate.name}</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">✕</span>
              <span>Bay marker</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">📍</span>
              <span>Your cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">🟢</span>
              <span>Verified host</span>
            </div>
          </div>
          <div className="border-t pt-2 text-xs text-gray-500">
            <p>{listingsWithMarkers} bays mapped</p>
            {listingsWithoutMarkers > 0 && <p>{listingsWithoutMarkers} bays not mapped</p>}
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setFilterOpen(!filterOpen)}
          className={`bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 ${filterOpen ? 'ring-2 ring-blue-500' : ''}`}
        >
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-72 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Filters</h4>
            <button onClick={() => setFilterOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (per day)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={e => handleFilterChange('priceMin', parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Min"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={e => handleFilterChange('priceMax', parseInt(e.target.value) || 1000)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Booking Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
              <div className="flex gap-2">
                {(['instant', 'request'] as const).map(type => (
                  <label key={type} className="flex-1 flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="checkbox"
                      checked={filters.bookingTypes.includes(type)}
                      onChange={e => handleFilterChange('bookingTypes', 
                        e.target.checked 
                          ? [...filters.bookingTypes, type]
                          : filters.bookingTypes.filter(t => t !== type)
                      )}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verified Only */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={e => handleFilterChange('verifiedOnly', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Verified hosts only</span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                priceMin: 0,
                priceMax: 1000,
                bookingTypes: ['instant', 'request'],
                amenities: [],
                verifiedOnly: false,
              })}
              className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Back to List Button */}
      <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-64 z-10">
        <button
          onClick={onViewListings}
          className="w-full bg-white rounded-xl shadow-lg py-3 px-4 flex items-center justify-center gap-2 text-blue-600 font-bold hover:bg-blue-50 transition"
        >
          <MapIcon className="w-5 h-5" />
          Back to List View
        </button>
      </div>
    </div>
  );
}
