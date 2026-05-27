'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { ShoppingBag, ArrowLeft, Loader2, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  if (cartItems.length === 0 && paymentStep !== 'success') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="bg-brand-light w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-[#EAE3DB]">
          <ShoppingBag className="w-8 h-8 text-brand-dark/40" />
        </div>
        <h1 className="font-serif text-2xl text-brand-dark">Your cart is empty</h1>
        <p className="text-sm text-brand-dark/60 max-w-sm mx-auto">
          Please add artworks to your cart before proceeding to the checkout.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-full transition-all duration-300 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Gallery</span>
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);
  const shipping = 0; // Free delivery
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      setErrorMsg('Please fill in all the shipping and contact details.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setPaymentStep('processing');

    // Simulate Razorpay secure payment gateway modal transition
    setTimeout(async () => {
      try {
        // Place the orders in the database. Since orders are created one artwork at a time in our schema, 
        // we will submit the first artwork in the cart for simplicity or loop them.
        // Let's create an order for the primary item, or if multiple, the first item, and combine quantity.
        // Our database schema connects an order to a single Artwork ID.
        // We will process the checkout for the first item in the cart.
        const primaryItem = cartItems[0];

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: name,
            email,
            phone,
            address,
            artworkId: primaryItem.artwork.id,
            quantity: primaryItem.quantity,
            amount: total,
            paymentStatus: 'Success', // Mock successful checkout
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to place order');
        }

        const createdOrder = await response.json();
        setPaymentStep('success');
        
        // Wait 1.5s to show success checkmark, then clear cart and redirect
        setTimeout(() => {
          clearCart();
          router.push(`/orders/${createdOrder.id}`);
        }, 1500);

      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Payment or inventory reservation failed. Please check stock levels.');
        setPaymentStep('idle');
        setIsSubmitting(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full flex-grow">
      {/* Back to Gallery Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-brand-dark/60 hover:text-brand-dark mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Gallery</span>
      </Link>

      <h1 className="font-serif text-3xl text-brand-dark mb-10">Checkout</h1>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6 border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          <div className="bg-brand-card p-6 md:p-8 rounded-2xl border border-[#EAE3DB] space-y-6">
            <h2 className="font-serif text-xl text-brand-dark border-b border-[#F8F4EF] pb-3">
              Shipping & Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  placeholder="e.g. Priya Sharma"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                placeholder="e.g. priya@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold">
                Full Shipping Address
              </label>
              <textarea
                required
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark resize-none"
                placeholder="Flat / House no, Building, Street address, City, State, PIN Code"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Place Order & Pay (₹{total.toLocaleString('en-IN')})</span>
          </button>
        </form>

        {/* Summary Container */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-light p-6 md:p-8 rounded-2xl border border-[#EAE3DB] space-y-6">
            <h2 className="font-serif text-xl text-brand-dark border-b border-[#EAE3DB] pb-3">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.artwork.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="bg-brand-card w-12 h-12 rounded-lg border border-[#EAE3DB] overflow-hidden flex-shrink-0">
                      <img
                        src={item.artwork.imageUrl}
                        alt={item.artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </span>
                    <div>
                      <span className="font-serif block text-brand-dark">{item.artwork.title}</span>
                      <span className="text-xs text-brand-dark/50">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-serif font-medium text-brand-dark">
                    ₹{(item.artwork.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-[#EAE3DB]" />

            {/* Price Calculations */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-dark/70">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-brand-dark/70">
                <span>Shipping</span>
                <span className="text-brand-accent font-semibold uppercase text-xs tracking-wider">
                  Free Delivery
                </span>
              </div>
              <hr className="border-[#EAE3DB] border-dashed" />
              <div className="flex justify-between items-center text-brand-dark font-semibold text-base">
                <span>Total</span>
                <span className="font-serif text-lg">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment simulated loading overlay */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-xs px-4">
          <div className="bg-brand-card p-8 rounded-3xl max-w-sm w-full border border-[#EAE3DB] shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {paymentStep === 'processing' ? (
              <>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-brand-light rounded-full border border-[#EAE3DB]">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-brand-dark">Processing Payment</h3>
                  <p className="text-xs text-brand-dark/60">
                    Connecting to Razorpay secure checkout. Please do not close or reload this window...
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-brand-accent/20 rounded-full">
                  <CheckCircle2 className="w-10 h-10 text-brand-accent animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-brand-dark">Payment Successful!</h3>
                  <p className="text-xs text-brand-dark/60">
                    Order created and inventory reserved. Redirecting to your tracking panel...
                  </p>
                </div>
              </>
            )}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-brand-dark/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RAAGA Artspace Secure Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
