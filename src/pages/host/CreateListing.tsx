import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MapPin, Hash, Zap, FileText, CheckCircle, Map, Clock, Home, Building, Landmark, Warehouse, Calendar, DollarSign, X, Plus, BadgeCheck, AlertCircle } from 'lucide-react';
import { mockEstates } from '../../data/mockData';
import MapPicker from '../../components/MapPicker';
import { MapMarker } from '../../types';
import VerificationBadge from '../../components/VerificationBadge';

export default function CreateListing() {
  const { setView, addListing, verificationStatus, fetchVerificationStatus } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    listing_type: 'estate_bay' as 'estate_bay' | 'residential_driveway' | 'garage' | 'commercial_lot' | 'event_parking',
    estate_id: '',
    cluster_or_street: '',
    bay_number: '',
    price_per_day: '',
    price_per_hour: '',
    booking_type: 'instant' as 'instant' | 'request',
    is_active: true,
    walk_time_minutes: 3,
    notes: '',
    directions: '',
    is_event_parking: false,
    event_multiplier: 1.5,
    event_dates: [] as string[],
    amenities: [] as string[],
    requires_id_verified_renter: false,
    deposit_amount: 0,
  });
  const [mapMarker, setMapMarker] = useState<MapMarker | null>(null);
  const [created, setCreated] = useState(false);
  const [showVerificationGate, setShowVerificationGate] = useState(false);

  // Fetch verification status on mount
  useEffect(() => {
    fetchVerificationStatus();
  }, [fetchVerificationStatus]);

  // Check if host verification is required for this listing type
  const requiresHostVerification = ['residential_driveway', 'garage', 'event_parking'].includes(formData.listing_type) && verificationStatus !== 'verified';

  const listingTypes = [
    { value: 'estate_bay', label: 'Estate Parking Bay', icon: Home, desc: 'Parking bay within a gated estate' },
    { value: 'residential_driveway', label: 'Residential Driveway', icon: Home, desc: 'Private driveway or yard space' },
    { value: 'garage', label: 'Garage / Covered Parking', icon: Building, desc: 'Indoor or covered parking space' },
    { value: 'commercial_lot', label: 'Commercial Parking Lot', icon: Warehouse, desc: 'Open lot for commercial use' },
    { value: 'event_parking', label: 'Event / Stadium Parking', icon: Landmark, desc: 'Near venues for concerts & sports events' },
  ];

  const amenities = [
    { value: 'covered', label: 'Covered Parking' },
    { value: 'security_camera', label: 'Security Camera' },
    { value: 'ev_charging', label: 'EV Charging' },
    { value: 'wheelchair_access', label: 'Wheelchair Accessible' },
    { value: 'height_clearance_2m', label: 'Height Clearance > 2m' },
    { value: 'well_lit', label: 'Well Lit at Night' },
    { value: 'gate_access_code', label: 'Gate Access Code Provided' },
    { value: 'cctv', label: 'CCTV Monitoring' },
  ];

  const selectedEstate = mockEstates.find(e => e.id === formData.estate_id);

  const handleSubmit = () => {
    // Check if host verification is required but not completed
    if (requiresHostVerification) {
      setShowVerificationGate(true);
      return;
    }

    if (!selectedEstate && formData.listing_type !== 'residential_driveway' && formData.listing_type !== 'garage' && formData.listing_type !== 'commercial_lot' && formData.listing_type !== 'event_parking') return;
    addListing({
      estate_id: formData.estate_id,
      estate_name: selectedEstate?.name || 'Custom Location',
      cluster_or_street: formData.cluster_or_street,
      bay_number: formData.bay_number,
      price_per_day: parseInt(formData.price_per_day),
      price_per_hour: formData.price_per_hour ? parseInt(formData.price_per_hour) : undefined,
      booking_type: formData.booking_type,
      is_active: formData.is_active,
      walk_time_minutes: formData.walk_time_minutes,
      notes: formData.notes,
      map_marker: mapMarker || undefined,
      directions: formData.directions || undefined,
      listing_type: formData.listing_type,
      is_event_parking: formData.is_event_parking,
      event_multiplier: formData.event_multiplier,
      event_dates: formData.event_dates,
      amenities: formData.amenities,
      requires_id_verified_renter: formData.requires_id_verified_renter,
      deposit_amount: formData.deposit_amount,
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
            <button onClick={() => { setCreated(false); setStep(1); setMapMarker(null); setFormData({ listing_type: 'estate_bay', estate_id: '', cluster_or_street: '', bay_number: '', price_per_day: '', price_per_hour: '', booking_type: 'instant', is_active: true, walk_time_minutes: 3, notes: '', directions: '', is_event_parking: false, event_multiplier: 1.5, event_dates: [], amenities: [], requires_id_verified_renter: false, deposit_amount: 0 }); }} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
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
        {/* Progress - 6 steps now */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s < 6 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          {/* STEP 1: Listing Type */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">What type of parking space?</h2>
              <p className="text-gray-500">Select the type of parking you want to list</p>
              
              <div className="grid gap-3">
                {listingTypes.map(type => {
                  const Icon = type.icon;
                  const isSelected = formData.listing_type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, listing_type: type.value }))}
                      className={`p-4 rounded-xl border-2 text-left transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.desc}</p>
                        </div>
                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Location Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
              
              {formData.listing_type === 'estate_bay' && (
                <>
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
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cluster, Street or Address *</label>
                <input
                  type="text"
                  value={formData.cluster_or_street}
                  onChange={e => setFormData(prev => ({ ...prev, cluster_or_street: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder={formData.listing_type === 'estate_bay' ? 'e.g. Cluster A, Block 3, Oak Street' : 'e.g. 123 Main Street, Sandton'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bay Number / Space ID *</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.bay_number}
                    onChange={e => setFormData(prev => ({ ...prev, bay_number: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder={formData.listing_type === 'estate_bay' ? 'e.g. Bay 14' : 'e.g. Space A1'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Walk Time to Gate/Entrance (minutes)</label>
                <input
                  type="number"
                  value={formData.walk_time_minutes}
                  onChange={e => setFormData(prev => ({ ...prev, walk_time_minutes: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="1"
                  max="30"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button onClick={() => setStep(3)} disabled={!formData.cluster_or_street || !formData.bay_number} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Map
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Mark Bay on Satellite Map */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Map className="w-6 h-6 text-blue-600" />
                  Mark Your Parking Space on the Map
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Zoom in on the satellite view and click exactly where your parking space is located.
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
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button onClick={() => setStep(4)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                  {mapMarker ? 'Continue' : 'Skip (optional)'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pricing & Booking */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Pricing & Booking
              </h2>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Price per Hour (ZAR) - Optional
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                  <input
                    type="number"
                    value={formData.price_per_hour}
                    onChange={e => setFormData(prev => ({ ...prev, price_per_hour: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="10"
                    min="5"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Enable hourly bookings (e.g., 5 hours). If set, renters can book by the hour.</p>
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

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button onClick={() => setStep(5)} disabled={!formData.price_per_day} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Event Parking & Amenities */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Event Parking & Amenities</h2>

              {/* Event Parking Toggle */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Landmark className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Event / Stadium Parking</p>
                      <p className="text-sm text-gray-500">Enable dynamic pricing for events near your parking space</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, is_event_parking: !prev.is_event_parking }))}
                    className={`relative w-12 h-6 rounded-full transition ${formData.is_event_parking ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition ${formData.is_event_parking ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {formData.is_event_parking && (
                <div className="space-y-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Event Settings
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Price Multiplier</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">×</span>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.event_multiplier}
                        onChange={e => setFormData(prev => ({ ...prev, event_multiplier: parseFloat(e.target.value) || 1 }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="1.5"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Multiplier applied to daily/hourly rate during events (e.g., 1.5x = 50% increase)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Dates (when multiplier applies)</label>
                    <div className="space-y-2">
                      {formData.event_dates.map((date, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="date"
                            value={date}
                            onChange={e => {
                              const newDates = [...formData.event_dates];
                              newDates[idx] = e.target.value;
                              setFormData(prev => ({ ...prev, event_dates: newDates }));
                            }}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button type="button" onClick={() => {
                            const newDates = formData.event_dates.filter((_, i) => i !== idx);
                            setFormData(prev => ({ ...prev, event_dates: newDates }));
                          }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, event_dates: [...prev.event_dates, ''] }))} className="px-4 py-2 border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-300 hover:text-blue-600 transition flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Event Date
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map(amenity => (
                    <label key={amenity.value} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity.value)}
                        onChange={e => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity.value] }));
                          } else {
                            setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity.value) }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Security Requirements */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Security & Requirements</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={formData.requires_id_verified_renter}
                      onChange={e => setFormData(prev => ({ ...prev, requires_id_verified_renter: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require ID-verified renters (recommended for residential/event parking)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition">
                    <input
                      type="checkbox"
                      checked={formData.deposit_amount > 0}
                      onChange={e => setFormData(prev => ({ ...prev, deposit_amount: e.target.checked ? 100 : 0 }))}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Require security deposit (R100)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Back
                </button>
                <button onClick={() => setStep(6)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Publish */}
          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900">Review & Publish</h2>
              
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Listing Type</span>
                  <span className="font-medium text-gray-900">{listingTypes.find(t => t.value === formData.listing_type)?.label}</span>
                </div>
                {formData.listing_type === 'estate_bay' && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estate</span>
                    <span className="font-medium text-gray-900">{selectedEstate?.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{formData.cluster_or_street} • {formData.bay_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Map Marker</span>
                  <span className="font-medium text-gray-900">{mapMarker ? `✅ ${mapMarker.lat.toFixed(4)}, ${mapMarker.lng.toFixed(4)}` : '⚠️ Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per Day</span>
                  <span className="font-medium text-gray-900">R{formData.price_per_day}/day</span>
                </div>
                {formData.price_per_hour && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price per Hour</span>
                    <span className="font-medium text-gray-900">R{formData.price_per_hour}/hr</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Your Earnings (daily)</span>
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
                {formData.is_event_parking && (
                  <div className="border-t pt-2">
                    <span className="text-gray-500 text-sm block mb-1">🎫 Event Parking:</span>
                    <div className="text-sm text-gray-900">
                      Multiplier: ×{formData.event_multiplier} | Dates: {formData.event_dates.filter(d => d).join(', ') || 'None set'}
                    </div>
                  </div>
                )}
                {formData.amenities.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amenities</span>
                    <span className="font-medium text-gray-900 text-right max-w-[200px]">{formData.amenities.map(a => amenities.find(am => am.value === a)?.label).join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Require ID-verified renter</span>
                  <span className="font-medium text-gray-900">{formData.requires_id_verified_renter ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="font-medium text-gray-900">{formData.deposit_amount > 0 ? `R${formData.deposit_amount}` : 'No'}</span>
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
                <button onClick={() => setStep(5)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
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
    {/* Verification Gate Modal */}
      {requiresHostVerification && showVerificationGate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Host ID Verification Required</h3>
                  <p className="text-sm text-gray-500">You must be verified to list this type</p>
                </div>
              </div>
            </div>
            <div className="mb-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                This listing type ({listingTypes.find(t => t.value === formData.listing_type)?.label}) requires host ID verification for security. Please complete verification before publishing.
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 mb-4">
              <p className="text-sm text-gray-600 mb-4">To list residential driveways, garages, or event parking, you need to verify your identity. This protects both you and renters.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowVerificationGate(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="button" onClick={() => { setShowVerificationGate(false); setView('verification'); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                  Go to Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
