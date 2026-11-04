import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarker } from '../types';

interface MapPickerProps {
  center: { lat: number; lng: number };
  zoom: number;
  marker: MapMarker | null;
  onMarkerChange: (marker: MapMarker | null) => void;
}

export default function MapPicker({ center, zoom, marker, onMarkerChange }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState<string>(marker ? `${marker.lat.toFixed(6)}, ${marker.lng.toFixed(6)}` : 'Click on the map to mark your bay');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with Esri World Imagery (satellite view - same as Google Maps)
    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: true,
    });

    // Esri World Imagery - free satellite tiles (same look as Google Maps satellite)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    // Add a labels overlay for street names
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.7,
    }).addTo(map);

    // Custom X marker icon
    const xIcon = L.divIcon({
      className: 'custom-x-marker',
      html: `<div style="
        width: 32px;
        height: 32px;
        background: #dc2626;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      ">✕</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // If marker exists, place it
    if (marker) {
      markerRef.current = L.marker([marker.lat, marker.lng], { icon: xIcon }).addTo(map);
    }

    // Click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      markerRef.current = L.marker([lat, lng], { icon: xIcon }).addTo(map);
      onMarkerChange({ lat, lng });
      setCoords(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when estate changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom]);

  const clearMarker = () => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    onMarkerChange(null);
    setCoords('Click on the map to mark your bay');
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200" style={{ height: '400px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        
        {/* Instructions overlay */}
        {!marker && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-[1000] text-sm font-medium text-gray-700 pointer-events-none">
            📍 Click on the map to mark your parking bay
          </div>
        )}
      </div>

      {/* Coordinates display */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Bay Location:</span>
          <span className="text-sm font-mono font-medium text-gray-900">{coords}</span>
        </div>
        {marker && (
          <button onClick={clearMarker} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        💡 Zoom in and click exactly where your parking bay is. Renters will see this marker on their view.
      </p>
    </div>
  );
}
