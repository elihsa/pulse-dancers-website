import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Hash, Zap, FileText, CheckCircle, Map } from 'lucide-react';
import { mockEstates } from '../../data/mockData';
import MapPicker from '../../components/MapPicker';
import { MapMarker } from '../../types';

export default function CreateListing() {
  const { setView, addListing } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    estate_id: '',
    cluster_or_street: '',
    bay_number: '',
    price_per_day: '',
    booking_type: 'instant' as 'instant' | 'request',
    is_active: true,
    walk_time_minutes: 3,
    notes: '',
    directions: ''
  });
  const [mapMarker, setMapMarker] = useState<MapMarker | null>(null);
  const [created, setCreated] = useState(false);

  const selectedEstate = mockEstates.find(e => e.id === formData.estate_id);

  const handleSubmit = () => {
    if (!selectedEstate) return;
    addListing({
      estate_id: formData.estate_id,
      estate_name: selectedEstate.name,
      cluster_or_street: formData.cluster_or_street,
      bay_number: formData.bay_number,
      price_per_day: parseInt(formData.price_per_day),
      booking_type: formData.booking_type,
      is_active: formData.is_active,
      walk_time_minutes: formData.walk_time_minutes,
      notes: formData.notes,
      map_marker: mapMarker || undefined,
      directions: formData.directions || undefined
    });
    setCreated(true);
  };

  if (created) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 card-shadow text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Created!</h2>
          <p className="text-gray-500 mb-6">Your parking bay is now live and visible to renters.</p>
          <div className="flex gap-3">
            <button onClick={() => setView('host-dashboard')} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
              Go to Dashboard
            </button>
            <button onClick={() => { setCreated(false); setStep(1); setMapMarker(null); setFormData({ estate_id: '', cluster_or_street: '', bay_number: '', price_per_day: '', booking_type: 'instant', is_active: true, walk_time_minutes: 3, notes: '', directions: '' }); }} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => setView('host-dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Create Listing</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress - 4 steps now */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s < 4 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          {/* STEP 1: Location Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estate *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.estate_id}
                    onChange={e => { setFormData(prev => ({ ...prev, estate_id: e.target.value })); setMapMarker(null); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
                  >
                    <option value="">Select your estate</option>
                    {mockEstates.map(e => (
                      <option key={e.id} value={e.id}>{e.name} - {e.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cluster or Street Name *</label>
                <input
                  type="text"
                  value={formData.cluster_or_street}
                  onChange={e => setFormData(prev => ({ ...prev, cluster_or_street: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g. Cluster A, Block 3, Oak Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bay Number *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.bay_number}
                    onChange={e => setFormData(prev => ({ ...prev, bay_number: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g. Bay 14"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Walk Time to Gate (minutes)</label>
                <input
                  type="number"
                  value={formData.walk_time_minutes}
                  onChange={e => setFormData(prev => ({ ...prev, walk_time_minutes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="1"
                  max="30"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.estate_id || !formData.cluster_or_street || !formData.bay_number}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Map
              </button>
            </div>
          )}

          {/* STEP 2: Mark Bay on Satellite Map */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Map className="w-6 h-6 text-blue-600" />
                  Mark Your Bay on the Map
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Zoom in on the satellite view and click exactly where your parking bay is located.
                </p>
              </div>

              {selectedEstate && (
                <MapPicker
                  center={{ lat: selectedEstate.lat, lng: selectedEstate.lng }}
                  zoom={selectedEstate.zoom}
                  marker={mapMarker}
                  onMarkerChange={setMapMarker}
                />
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  {mapMarker ? 'Continue' : 'Skip (optional)'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Booking */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Pricing & Booking</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Day (ZAR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                  <input
                    type="number"
                    value={formData.price_per_day}
                    onChange={e => setFormData(prev => ({ ...prev, price_per_day: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="50"
                    min="10"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Platform fee: 15%. You earn R{Math.round((parseInt(formData.price_per_day) || 0) * 0.85)} per day.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, booking_type: 'instant' }))}
                    className={`p-4 rounded-xl border-2 text-left transition ${formData.booking_type === 'instant' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-gray-900">Instant Book</span>
                    </div>
                    <p className="text-xs text-gray-500">Renters book immediately without approval</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, booking_type: 'request' }))}
                    className={`p-4 rounded-xl border-2 text-left transition ${formData.booking_type === 'request' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-gray-900">Request to Book</span>
                    </div>
                    <p className="text-xs text-gray-500">You approve each booking request</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="e.g. Covered parking, near gate 2, max height 2.1m"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <span>🧭</span> Directions to Parking (optional)
                </label>
                <textarea
                  value={formData.directions || ''}
                  onChange={e => setFormData(prev => ({ ...prev, directions: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={4}
                  placeholder="e.g. Enter via Gate 2. Turn right at the clubhouse, take the second left. Bay 14 is the covered bay on your right."
                />
                <p className="text-xs text-gray-400 mt-1">Help visitors find the exact bay from the estate gate</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!formData.price_per_day}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Review & Publish</h2>
              
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estate</span>
                  <span className="font-medium text-gray-900">{selectedEstate?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{formData.cluster_or_street} • {formData.bay_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Map Marker</span>
                  <span className="font-medium text-gray-900">{mapMarker ? `✅ ${mapMarker.lat.toFixed(4)}, ${mapMarker.lng.toFixed(4)}` : '⚠️ Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-gray-900">R{formData.price_per_day}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Earnings</span>
                  <span className="font-medium text-green-600">R{Math.round(parseInt(formData.price_per_day) * 0.85)}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Type</span>
                  <span className="font-medium text-gray-900">{formData.booking_type === 'instant' ? '⚡ Instant Book' : '📋 Request to Book'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Walk Time</span>
                  <span className="font-medium text-gray-900">{formData.walk_time_minutes} min</span>
                </div>
                {formData.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Notes</span>
                    <span className="font-medium text-gray-900 text-right max-w-[200px]">{formData.notes}</span>
                  </div>
                )}
                {formData.directions && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-500 text-sm block mb-1">🧭 Directions:</span>
                    <span className="font-medium text-gray-900 text-sm">{formData.directions}</span>
                  </div>
                )}
              </div>

              {/* Mini map preview if marker set */}
              {mapMarker && selectedEstate && (
                <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '200px' }}>
                  <MapPicker
                    center={{ lat: mapMarker.lat, lng: mapMarker.lng }}
                    zoom={19}
                    marker={mapMarker}
                    onMarkerChange={() => {}}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button onClick={handleSubmit} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition">
                  Publish Listing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
