'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, LayoutDashboard, LogOut, Compass, Play, Menu, X, ArrowLeft } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { cartItems, toggleCart } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();

  const isControlCenter = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  if (isControlCenter) {
    return null;
  }
  
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

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center text-brand-dark hover:text-brand-accent transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

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
          {session && (
            <Link href="/orders/track" className="hover:text-brand-accent transition-colors">
              TRACK ORDER
            </Link>
          )}
          {(session?.user as any)?.role === 'ADMIN' && (
            <>
              <Link href="/dashboard" className="hover:text-brand-accent transition-colors flex items-center gap-1.5 font-bold text-brand-accent">
                <LayoutDashboard className="w-4 h-4" />
                RAAGA CONTROL
              </Link>
              <Link href="/admin" className="hover:text-brand-accent transition-colors flex items-center gap-1.5 ml-4">
                <LayoutDashboard className="w-4 h-4" />
                ADMIN
              </Link>
            </>
          )}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-dark/60 font-semibold">Hi, {session.user?.name || 'User'}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs uppercase bg-brand-dark/5 hover:bg-brand-dark/10 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-brand-accent transition-colors text-xs font-bold uppercase tracking-widest">
              Login / Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm md:hidden z-50">
            <div className="bg-white w-64 h-full shadow-xl p-6 flex flex-col space-y-4">
              <button
                className="self-end text-brand-dark"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <Link href="/" className="flex items-center space-x-2 hover:text-brand-accent" onClick={() => setIsMenuOpen(false)}>
                <Compass className="w-5 h-5" />
                <span>Gallery</span>
              </Link>
              <Link href="/blog" className="flex items-center space-x-2 hover:text-brand-accent" onClick={() => setIsMenuOpen(false)}>
                <Play className="w-5 h-5" />
                <span>Blog</span>
              </Link>
              {session && (
                <Link href="/orders/track" className="flex items-center space-x-2 hover:text-brand-accent" onClick={() => setIsMenuOpen(false)}>
                  <ArrowLeft className="w-5 h-5" />
                  <span>Track Order</span>
                </Link>
              )}
              {(session?.user as any)?.role === 'ADMIN' && (
                <Link href="/dashboard" className="flex items-center space-x-2 hover:text-brand-accent" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard className="w-5 h-5" />
                  <span>RAAGA Control</span>
                </Link>
              )}
              {session ? (
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setIsMenuOpen(false); }}
                  className="flex items-center space-x-2 text-brand-dark hover:text-brand-accent"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link href="/login" className="flex items-center space-x-2 hover:text-brand-accent" onClick={() => setIsMenuOpen(false)}>
                  <LogOut className="w-5 h-5" />
                  <span>Login / Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        )}
        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Mobile Dashboard Link */}
          {(session?.user as any)?.role === 'ADMIN' && (
            <Link href="/dashboard" className="md:hidden text-brand-dark hover:text-brand-accent transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}

          {!session && (
            <Link href="/login" className="md:hidden text-xs font-semibold uppercase tracking-wider text-brand-accent hover:underline">
              LOGIN
            </Link>
          )}

          {session && (
            <>
              <Link href="/orders/track" className="md:hidden text-xs font-semibold uppercase tracking-wider text-brand-accent hover:underline">
                TRACK
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="md:hidden text-brand-dark/70 hover:text-brand-accent p-1 cursor-pointer transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </>
          )}

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
