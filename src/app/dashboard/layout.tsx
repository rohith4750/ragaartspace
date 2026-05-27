import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { LayoutDashboard, Palette, ShoppingBag, ArrowLeft } from 'lucide-react';

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar panel */}
      <aside className="w-full md:w-64 bg-brand-dark text-[#F4EFEB] flex flex-col border-b md:border-b-0 md:border-r border-[#EAE3DB] flex-shrink-0">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-[#F4EFEB]/10 flex items-center justify-between">
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

          <Link
            href="/dashboard/artworks"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <Palette className="w-4 h-4 text-brand-accent" />
            <span>Artworks</span>
          </Link>

          <Link
            href="/dashboard/orders"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-brand-accent/25 hover:text-white transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-brand-accent" />
            <span>Orders</span>
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

        {/* Footer with logged in user status */}
        <div className="p-4 border-t border-[#F4EFEB]/10 text-xs text-[#F4EFEB]/60 bg-black/10">
          <span className="block text-[#F4EFEB] font-semibold">{session.user?.name || 'Raaga Admin'}</span>
          <span className="block">{session.user?.email}</span>
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
