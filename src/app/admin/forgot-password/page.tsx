"use client";
import React, { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send reset link');
      } else {
        setMessage(data.message || 'If the admin email exists, a reset link will be sent.');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center bg-background px-4 md:px-0">
      <div className="max-w-sm w-full bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-xs space-y-6">
        <h1 className="text-center text-2xl font-serif text-brand-dark mb-4">Admin Forgot Password</h1>
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 text-center font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg border border-green-100 text-center font-medium">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                placeholder="e.g. admin@example.com"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Link</span>}
          </button>
        </form>
        <div className="text-center mt-4 text-xs">
          <Link href="/admin/login" className="text-brand-accent hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPasswordPage;
