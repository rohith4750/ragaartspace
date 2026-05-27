'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const router = useRouter();
  const { cartItems, isOpen, toggleCart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.artwork.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    toggleCart(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 z-50 bg-black cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-brand-card shadow-2xl border-l border-[#EAE3DB] flex flex-col h-full"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#EAE3DB] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-brand-dark" />
                <h2 className="font-serif text-xl text-brand-dark">Your Meditation Cart</h2>
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-1 hover:bg-brand-light rounded-full text-brand-dark/60 hover:text-brand-dark transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="bg-brand-light p-4 rounded-full">
                    <ShoppingBag className="w-10 h-10 text-brand-dark/40" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-brand-dark mb-1">Your cart is empty</h3>
                    <p className="text-sm text-brand-dark/60 max-w-[240px] mx-auto leading-relaxed">
                      Explore our spiritual collection and find the perfect artwork for your sanctuary.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCart(false)}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 rounded-full transition-all duration-300 shadow-xs"
                  >
                    Browse Artworks
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.artwork.id}
                    className="flex space-x-4 pb-6 border-b border-[#F8F4EF] last:border-b-0"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0 border border-[#EAE3DB]">
                      <img
                        src={item.artwork.imageUrl}
                        alt={item.artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-md text-brand-dark leading-snug line-clamp-1">
                          {item.artwork.title}
                        </h4>
                        <p className="text-[10px] uppercase text-brand-dark/50 tracking-wider">
                          {item.artwork.category} ({item.artwork.dimensions})
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#EAE3DB] rounded-full bg-brand-light overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                            className="p-1 hover:bg-[#EAE3DB] text-brand-dark transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-brand-dark">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                            disabled={item.quantity >= item.artwork.stock}
                            className="p-1 hover:bg-[#EAE3DB] text-brand-dark transition-colors disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.artwork.id)}
                          className="text-brand-dark/40 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right font-serif text-sm font-medium text-brand-dark whitespace-nowrap">
                      ₹{(item.artwork.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#EAE3DB] bg-brand-light/50 space-y-4">
                <div className="flex justify-between items-center text-brand-dark">
                  <span className="text-sm font-semibold tracking-wider uppercase">Subtotal</span>
                  <span className="font-serif text-xl font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-brand-dark/50 leading-normal">
                  Shipping, taxes, and transaction charges calculated at checkout. Safe and secure payment processing.
                </p>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
