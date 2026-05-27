'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, LayoutDashboard, LogOut, Compass, Play } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { cartItems, toggleCart } = useCart();
  const { data: session } = useSession();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 w-full glass shadow-xs border-b border-[#EAE3DB] px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <img
            src="/images/logo.jpg"
            alt="RAAGA Artspace"
            className="w-10 h-10 rounded-full object-cover border border-[#EAE3DB] group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-serif text-xl md:text-2xl tracking-widest text-brand-dark font-medium group-hover:text-brand-accent transition-colors duration-300">
            RAAGA <span className="text-brand-accent text-lg">Artspace</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wider text-brand-dark/80">
          <Link href="/" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            GALLERY
          </Link>
          <Link href="/blog" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
            <Play className="w-4 h-4" />
            BLOG
          </Link>
          <Link href="/orders/track" className="hover:text-brand-accent transition-colors">
            TRACK ORDER
          </Link>
          <Link href="/dashboard" className="hover:text-brand-accent transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" />
            DASHBOARD
          </Link>
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-xs uppercase bg-brand-dark/5 hover:bg-brand-dark/10 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Logout ({session.user?.name || 'Admin'})
            </button>
          )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Mobile Dashboard Link */}
          <Link href="/dashboard" className="md:hidden text-brand-dark hover:text-brand-accent transition-colors">
            <LayoutDashboard className="w-5 h-5" />
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => toggleCart(true)}
            className="relative p-2 text-brand-dark hover:text-brand-accent transition-all duration-300 focus:outline-hidden"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
