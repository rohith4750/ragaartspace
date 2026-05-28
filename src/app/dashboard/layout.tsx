import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { LayoutDashboard, Palette, ShoppingBag, ArrowLeft, Truck, Film, Users } from 'lucide-react';

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
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar panel */}
      <aside className="w-full md:w-64 bg-brand-dark text-[#F4EFEB] flex flex-col border-b md:border-b-0 md:border-r border-[#EAE3DB] flex-shrink-0">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-[#F4EFEB]/10 flex items-center space-x-2.5">
          <img
            src="/images/logo.jpg"
            alt="RAAGA Artspace"
            className="w-8 h-8 rounded-full object-cover border border-white/20"
          />
          <span className="font-serif text-lg tracking-widest font-semibold text-white">
            RAAGA <span className="text-brand-accent text-sm">Control</span>
          </span>
        </div>

        {/* Links list */}
        <nav className="flex-grow p-4 space-y-2 text-sm font-medium tracking-wide">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-accent" />
            <span>Overview</span>
          </Link>

          {/* MANAGER/ADMIN can manage catalog */}
          {['ADMIN', 'MANAGER'].includes(userRole) && (
            <Link
              href="/dashboard/artworks"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
            >
              <Palette className="w-4 h-4 text-brand-accent" />
              <span>Artworks</span>
            </Link>
          )}

          {/* MANAGER/ADMIN can view/edit orders */}
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

          {/* ADMIN only can manage users and roles */}
          {isAdmin && (
            <Link
              href="/dashboard/users"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
            >
              <Users className="w-4 h-4 text-brand-accent" />
              <span>Users & Roles</span>
            </Link>
          )}

          <hr className="border-[#F4EFEB]/10 my-4" />

          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#F4EFEB]/10 hover:text-white transition-all text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront Gallery</span>
          </Link>
        </nav>

        {/* Footer with logged in user status */}
        <div className="p-4 border-t border-[#F4EFEB]/10 text-xs text-[#F4EFEB]/60 bg-black/10">
          <span className="block text-[#F4EFEB] font-semibold">{session.user?.name || 'Raaga Admin'}</span>
          <span className="block font-medium text-[10px] text-brand-accent/90 uppercase tracking-widest">{userRole}</span>
          <span className="block mt-0.5 opacity-80">{session.user?.email}</span>
        </div>
      </aside>

      {/* Admin content frame */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto bg-background/50">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
