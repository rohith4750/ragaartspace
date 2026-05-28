import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { LayoutDashboard, Palette, ShoppingBag, ArrowLeft, Truck, Film, Users, Bell, Search, Globe, UserCircle } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If not logged in, render child login screen cleanly without the dashboard sidebar
  if (!session) {
    return <div className="flex-grow flex flex-col bg-background">{children}</div>;
  }

  const userRole = (session.user as any)?.role;

  // Protect against non-internal accounts attempting direct navigation
  if (!['ADMIN', 'MANAGER', 'STAFF'].includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6 text-center">
        <div className="max-w-md w-full bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-[0_4px_20px_rgba(62,62,62,0.03)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-brand-dark">Access Denied</h1>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              Your account ({session.user.email}) does not have the necessary permissions to access the RAAGA Control console.
            </p>
          </div>
          <div className="border-t border-[#F8F4EF] pt-4">
            <Link href="/" className="text-xs text-brand-accent hover:text-brand-accent-hover font-semibold transition-colors">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── Fixed Sidebar (Desktop) ─── */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 z-30 bg-brand-dark text-[#F4EFEB] border-r border-[#EAE3DB]">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-[#F4EFEB]/10 flex items-center space-x-2.5 flex-shrink-0">
          <img
            src="/images/logo.jpg"
            alt="RAAGA Artspace"
            className="w-8 h-8 rounded-full object-cover border border-white/20"
          />
          <span className="font-serif text-lg tracking-widest font-semibold text-white">
            RAAGA <span className="text-brand-accent text-sm">Control</span>
          </span>
        </div>

        {/* Scrollable navigation links */}
        <nav className="flex-grow p-4 space-y-1 text-sm font-medium tracking-wide overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-accent" />
            <span>Overview</span>
          </Link>

          {['ADMIN', 'MANAGER'].includes(userRole) && (
            <Link
              href="/dashboard/artworks"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
            >
              <Palette className="w-4 h-4 text-brand-accent" />
              <span>Artworks</span>
            </Link>
          )}

          {['ADMIN', 'MANAGER'].includes(userRole) && (
            <Link
              href="/dashboard/orders"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-brand-accent" />
              <span>Orders</span>
            </Link>
          )}

          <Link
            href="/dashboard/shipments"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <Truck className="w-4 h-4 text-brand-accent" />
            <span>Shipments</span>
          </Link>

          <Link
            href="/dashboard/reels"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <Film className="w-4 h-4 text-brand-accent" />
            <span>Reels</span>
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
            >
              <Users className="w-4 h-4 text-brand-accent" />
              <span>Users &amp; Roles</span>
            </Link>
          )}

          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <UserCircle className="w-4 h-4 text-brand-accent" />
            <span>Profile</span>
          </Link>

          <hr className="border-[#F4EFEB]/10 my-4" />

          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#F4EFEB]/10 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront Gallery</span>
          </Link>
        </nav>

        {/* User info footer inside sidebar */}
        <div className="p-4 border-t border-[#F4EFEB]/10 text-xs text-[#F4EFEB]/60 bg-black/10 flex-shrink-0">
          <span className="block text-[#F4EFEB] font-semibold">{session.user?.name || 'Raaga Admin'}</span>
          <span className="block font-medium text-[10px] text-brand-accent/90 uppercase tracking-widest">{userRole}</span>
          <span className="block mt-0.5 opacity-80">{session.user?.email}</span>
        </div>
      </aside>

      {/* ─── Mobile top bar ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-brand-dark text-[#F4EFEB] flex items-center justify-between p-4 border-b border-[#F4EFEB]/10">
        <div className="flex items-center space-x-2">
          <img
            src="/images/logo.jpg"
            alt="RAAGA Artspace"
            className="w-7 h-7 rounded-full object-cover border border-white/20"
          />
          <span className="font-serif text-base tracking-widest font-semibold text-white">
            RAAGA <span className="text-brand-accent text-xs">Control</span>
          </span>
        </div>
        <span className="text-[10px] text-brand-accent/90 uppercase tracking-widest font-medium">{userRole}</span>
      </div>

      {/* ─── Mobile bottom toolbar ─── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-brand-dark border-t border-[#F4EFEB]/10 flex items-center justify-around py-2.5 px-2">
        <Link href="/dashboard" className="flex flex-col items-center text-[#F4EFEB]/70 hover:text-white transition-colors">
          <LayoutDashboard className="w-5 h-5 text-brand-accent" />
          <span className="text-[9px] mt-0.5 tracking-wider">Overview</span>
        </Link>
        {['ADMIN', 'MANAGER'].includes(userRole) && (
          <Link href="/dashboard/artworks" className="flex flex-col items-center text-[#F4EFEB]/70 hover:text-white transition-colors">
            <Palette className="w-5 h-5 text-brand-accent" />
            <span className="text-[9px] mt-0.5 tracking-wider">Artworks</span>
          </Link>
        )}
        {['ADMIN', 'MANAGER'].includes(userRole) && (
          <Link href="/dashboard/orders" className="flex flex-col items-center text-[#F4EFEB]/70 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5 text-brand-accent" />
            <span className="text-[9px] mt-0.5 tracking-wider">Orders</span>
          </Link>
        )}
        <Link href="/dashboard/shipments" className="flex flex-col items-center text-[#F4EFEB]/70 hover:text-white transition-colors">
          <Truck className="w-5 h-5 text-brand-accent" />
          <span className="text-[9px] mt-0.5 tracking-wider">Ship</span>
        </Link>
        <Link href="/" className="flex flex-col items-center text-[#F4EFEB]/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[9px] mt-0.5 tracking-wider">Store</span>
        </Link>
      </div>

      {/* ─── Desktop Top Toolbar (fixed) ─── */}
      <header className="hidden md:flex fixed top-0 left-64 right-0 z-20 h-14 bg-white/80 backdrop-blur-md border-b border-[#EAE3DB] items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-dark/40" />
            <input
              type="text"
              placeholder="Search orders, artworks..."
              className="pl-9 pr-4 py-1.5 text-xs bg-brand-light border border-[#EAE3DB] rounded-full w-64 focus:outline-none focus:border-brand-accent text-brand-dark placeholder:text-brand-dark/40"
            />
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <button className="relative text-brand-dark/50 hover:text-brand-accent transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-accent rounded-full"></span>
          </button>
          <Link href="/" className="text-brand-dark/50 hover:text-brand-accent transition-colors" title="Visit Storefront">
            <Globe className="w-4 h-4" />
          </Link>
          <div className="h-5 w-px bg-[#EAE3DB]"></div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-xs font-bold text-brand-accent">
              {(session.user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="text-xs">
              <span className="block font-semibold text-brand-dark leading-tight">{session.user?.name || 'Admin'}</span>
              <span className="block text-[10px] text-brand-dark/50 uppercase tracking-widest">{userRole}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Desktop Bottom Footer (fixed) ─── */}
      <footer className="hidden md:flex fixed bottom-0 left-64 right-0 z-20 h-10 bg-white/80 backdrop-blur-md border-t border-[#EAE3DB] items-center justify-between px-8 text-[10px] text-brand-dark/40 tracking-wide">
        <div className="flex items-center space-x-4">
          <span>&copy; {new Date().getFullYear()} RAAGA Artspace</span>
          <span className="text-brand-dark/20">|</span>
          <span>Raaga Control v1.0</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hover:text-brand-accent transition-colors flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Storefront
          </Link>
          <span className="text-brand-dark/20">|</span>
          <span className="text-brand-accent/70 font-semibold">{userRole}</span>
        </div>
      </footer>

      {/* ─── Main content (offset for all fixed elements) ─── */}
      <main className="flex-grow md:ml-64 mt-14 mb-16 md:mb-10 min-h-screen overflow-y-auto bg-background/50">
        <div className="max-w-7xl mx-auto w-full p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
