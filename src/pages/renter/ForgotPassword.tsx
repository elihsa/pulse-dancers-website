import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, ArrowLeft, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export default function ForgotPassword() {
  const { setView } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <header className="p-4">
          <button onClick={() => setView('login')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
              <p className="text-gray-500 mt-1">If an account exists with that email, a password reset link has been sent</p>
            </div>

            <div className="bg-white rounded-2xl p-6 card-shadow">
              <div className="text-center">
                <p className="text-gray-600 mb-6">The link will expire in 1 hour. Please check your spam folder if you don't see it.</p>
                <button onClick={() => setView('login')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header className="p-4">
        <button onClick={() => setView('login')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-gray-500 mt-1">Enter your email and we'll send you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 card-shadow space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="you@email.co.za"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>

            <div className="text-center">
              <button type="button" onClick={() => setView('login')} className="text-blue-600 text-sm font-medium hover:underline">
                Remember your password? Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}