import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, MessageCircle, MapPin, Calendar, Car as CarIcon, Copy, ExternalLink, Home, Key, Navigation, XCircle, Send, ClipboardCheck } from 'lucide-react';

export default function Success() {
  const { selectedBooking, setView, cancelBooking } = useApp();
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  if (!selectedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking found</p>
          <button onClick={() => setView('search')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Go Home</button>
        </div>
      </div>
    );
  }

  const isConfirmed = selectedBooking.status === 'confirmed';
  
  // Build details text
  const bookingDetails = `🅿️ ParkBuddy SA - Parking Details

Hi ${selectedBooking.guest_name}! Here are your parking details:

📍 Estate: ${selectedBooking.estate_name}
🏘️ Location: ${selectedBooking.cluster_or_street}
🔢 Bay Number: ${selectedBooking.bay_number}
📅 Dates: ${selectedBooking.start_date} → ${selectedBooking.end_date}
🚗 Your Car: ${selectedBooking.guest_license_plate}${selectedBooking.access_code ? `\n\n🔑 Access Code: ${selectedBooking.access_code}` : ''}${selectedBooking.directions ? `\n\n🧭 How to Get There:\n${selectedBooking.directions}` : ''}

✅ Please report to the security gate and mention your bay number.

_Booked via ParkBuddy SA_`;

  // Initialize message text with booking details
  React.useEffect(() => {
    setMessageText(bookingDetails);
  }, [selectedBooking]);

  const whatsappMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${selectedBooking.guest_phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const handleCopy = () => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(messageText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy(messageText));
    } else {
      fallbackCopy(messageText);
    }
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isConfirmed ? 'Booking Confirmed!' : 'Booking Requested!'}
          </h1>
          <p className="text-gray-500">
            {isConfirmed
              ? 'Your parking bay is reserved. Share the details with your visitor below.'
              : 'Your request has been sent to the host. You\'ll be notified once they confirm.'}
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl p-6 card-shadow mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{selectedBooking.estate_name}</p>
                <p className="text-sm text-gray-500">{selectedBooking.cluster_or_street} • {selectedBooking.bay_number}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedBooking.start_date} → {selectedBooking.end_date}</p>
                <p className="text-sm text-gray-500">Visitor: {selectedBooking.guest_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedBooking.guest_license_plate}</p>
                <p className="text-sm text-gray-500">{selectedBooking.guest_phone}</p>
              </div>
            </div>

            {/* Access Code */}
            {selectedBooking.access_code && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-yellow-600" />
                  <p className="font-bold text-yellow-900">Access Code</p>
                </div>
                <p className="text-2xl font-mono font-bold text-yellow-700">{selectedBooking.access_code}</p>
                <p className="text-xs text-yellow-600 mt-1">Share this code with your visitor for gate access</p>
              </div>
            )}

            {/* Directions */}
            {selectedBooking.directions && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <p className="font-bold text-blue-900">How to Get There</p>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{selectedBooking.directions}</p>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-blue-600">R{selectedBooking.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Booking ID</span>
                <span className="text-gray-700 font-mono text-xs">{selectedBooking.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Handoff */}
        <div className="bg-white rounded-2xl p-6 card-shadow mb-6">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Send to Visitor
          </h2>
          <p className="text-sm text-gray-500 mb-4">Share parking details with your visitor via WhatsApp or copy the message</p>
          
          {/* Editable Message Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message to Send</label>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono resize-y"
              placeholder="Edit the message before sending..."
            />
            <p className="text-xs text-gray-500 mt-1">Edit the message above, then send via WhatsApp or copy to clipboard</p>
          </div>

          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Send via WhatsApp
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <button
              onClick={handleCopy}
              className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Details
                </>
              )}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setView('renter-dashboard')}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to My Dashboard
          </button>
          <button
            onClick={() => setView('search')}
            className="w-full py-3 border-2 border-blue-200 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Search for More Parking
          </button>
          {selectedBooking.status !== 'cancelled' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Cancel Booking</h3>
                <p className="text-sm text-gray-500">Are you sure?</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will cancel the booking and the guest will no longer have access to the parking bay. A refund will be processed to your original payment method.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => { cancelBooking(selectedBooking.id); setShowCancelModal(false); setView('search'); }}
                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}