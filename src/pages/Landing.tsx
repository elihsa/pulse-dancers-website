import React from 'react';
import { useApp } from '../context/AppContext';
import { Car, Shield, MapPin, Clock, Star, ArrowRight, CheckCircle, Users, CreditCard, MessageCircle } from 'lucide-react';

export default function Landing() {
  const { setView, isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ParkBuddy<span className="text-blue-600">SA</span></span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => setView('search')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Find Parking
              </button>
            ) : (
              <>
                <button onClick={() => setView('login')} className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition">
                  Log In
                </button>
                <button onClick={() => setView('login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Rent Parking Bays in Your Estate. <span className="text-yellow-300">Simple. Secure.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              South Africa's first peer-to-peer estate parking platform. Let your visitors park safely while you earn from your spare bay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setView('login')} className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition flex items-center justify-center gap-2">
                Find Parking <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => setView('login')} className="px-8 py-4 bg-blue-800/50 text-white border border-blue-400 rounded-xl font-bold text-lg hover:bg-blue-800/70 transition">
                List Your Bay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">2,500+</p>
              <p className="text-gray-500 mt-1">Active Bays</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">150+</p>
              <p className="text-gray-500 mt-1">Estates</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-gray-500 mt-1">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">R50</p>
              <p className="text-gray-500 mt-1">Avg. per Day</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Whether you're hosting visitors or earning from your spare bay, ParkBuddy makes it effortless.</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Renters */}
            <div className="bg-white rounded-2xl p-8 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Visitors (Renters)</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <MapPin className="w-5 h-5" />, text: 'Search your estate by name or city' },
                  { icon: <Clock className="w-5 h-5" />, text: 'Pick dates & select a parking bay' },
                  { icon: <CreditCard className="w-5 h-5" />, text: 'Pay securely via Paystack (escrow)' },
                  { icon: <MessageCircle className="w-5 h-5" />, text: 'Share parking details via WhatsApp' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      {step.icon}
                    </div>
                    <span className="text-gray-700">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* For Hosts */}
            <div className="bg-white rounded-2xl p-8 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">For Bay Owners (Hosts)</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, text: 'Verify your ID & residence (safe & secure)' },
                  { icon: <MapPin className="w-5 h-5" />, text: 'List your bay with price & availability' },
                  { icon: <CheckCircle className="w-5 h-5" />, text: 'Accept or auto-confirm bookings' },
                  { icon: <CreditCard className="w-5 h-5" />, text: 'Get paid after each booking (15% fee)' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                      {step.icon}
                    </div>
                    <span className="text-gray-700">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why ParkBuddy SA?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-8 h-8" />, title: 'Verified & Secure', desc: 'All hosts are ID-verified and residence-verified. Your visitors park in safe, gated estates.' },
              { icon: <CreditCard className="w-8 h-8" />, title: 'Escrow Payments', desc: 'Paystack holds funds in escrow. Hosts only get paid after the booking is completed.' },
              { icon: <Star className="w-8 h-8" />, title: 'Instant Book', desc: 'No waiting for approval. Book instantly and get parking details immediately.' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of South Africans who are already using ParkBuddy to park smarter.</p>
          <button onClick={() => setView('login')} className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-400" />
              <span className="text-white font-bold">ParkBuddy SA</span>
            </div>
            <p className="text-sm">© 2026 ParkBuddy SA. All rights reserved. Made with ❤️ in South Africa.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
