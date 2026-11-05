import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Car, ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, register, setView } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', full_name: '', phone: '', role: 'renter' as 'host' | 'renter' | 'both'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isRegister) {
      const result = await register(formData);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    } else {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-4">
        <button onClick={() => setView('landing')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isRegister ? 'Join ParkBuddy SA today' : 'Log in to manage your parking'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 card-shadow space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            {/* Role Selection (Register only) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'renter', label: 'Rent Parking' },
                    { value: 'host', label: 'List My Bay' },
                    { value: 'both', label: 'Both' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: opt.value as any }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                        formData.role === opt.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g. Kagiso Molefe"
                    required
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="+27 82 555 0000"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="you@email.co.za"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isRegister && (
              <div className="text-right">
                <button type="button" onClick={() => setView('forgot-password')} className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Log In')}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-blue-600 text-sm font-medium hover:underline">
                {isRegister ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          {!isRegister && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">
                🔑 Demo Accounts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">🅿️ Renter</span>
                    <button
                      type="button"
                      onClick={() => { setFormData({ ...formData, email: 'renter@parkbuddy.co.za', password: 'renter123' }); setError(''); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Use this →
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">renter@parkbuddy.co.za / renter123</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">🏠 Host</span>
                    <button
                      type="button"
                      onClick={() => { setFormData({ ...formData, email: 'host@parkbuddy.co.za', password: 'host123' }); setError(''); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Use this →
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">host@parkbuddy.co.za / host123</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">🔄 Both</span>
                    <button
                      type="button"
                      onClick={() => { setFormData({ ...formData, email: 'both@parkbuddy.co.za', password: 'both123' }); setError(''); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Use this →
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">both@parkbuddy.co.za / both123</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
