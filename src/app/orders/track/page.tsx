'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderTrackPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setErrorMsg('Please enter a valid order ID');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    router.push(`/orders/${orderId.trim()}`);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-20 flex-grow w-full flex flex-col justify-center">
      <div className="bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-xs text-center space-y-6">
        <div className="bg-brand-light w-14 h-14 rounded-full flex items-center justify-center mx-auto border border-[#EAE3DB]">
          <Search className="w-6 h-6 text-brand-dark/50" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl text-brand-dark">Track Your Order</h1>
          <p className="text-xs text-brand-dark/60 max-w-sm mx-auto leading-relaxed">
            Enter your unique order receipt key below to check the real-time shipping progress.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Order ID (e.g. 550e8400-e29b-41d4-a716-446655440000)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark placeholder:text-brand-dark/30 text-center"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Locate Shipment</span>
            )}
          </button>
        </form>

        <div className="border-t border-[#F8F4EF] pt-4">
          <Link
            href="/"
            className="text-xs text-brand-accent font-semibold tracking-wider uppercase hover:underline"
          >
            Browse Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
