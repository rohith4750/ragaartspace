'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, FileText, Palette, Clock, Users, ArrowUpRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsData, Order } from '@/types';

export default function DashboardOverviewPage() {
  // Fetch analytics metrics
  const { data: stats, isLoading: statsLoading } = useQuery<AnalyticsData>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders-recent'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  const cards = [
    {
      title: 'Total Revenue',
      value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '₹0',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders : 0,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Active Catalog',
      value: stats ? stats.totalArtworks : 0,
      icon: Palette,
      color: 'text-[#A3B18A] bg-[#A3B18A]/10 border-[#A3B18A]/20',
    },
    {
      title: 'Pending Orders',
      value: stats ? stats.pendingOrders : 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Customers',
      value: stats ? stats.totalCustomers : 0,
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-brand-dark mb-2">Control Center</h1>
        <p className="text-sm text-brand-dark/60">
          Real-time snapshot of your spiritual art space business operations.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`bg-brand-card p-5 rounded-2xl border flex flex-col justify-between shadow-xs transition-all duration-300 ${
                statsLoading ? 'animate-pulse bg-[#EAE3DB]/30 border-transparent' : 'border-[#EAE3DB]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-brand-dark/50 font-semibold">
                  {card.title}
                </span>
                <span className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-2xl font-semibold text-brand-dark">
                {statsLoading ? '...' : card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Split view: Recent Orders and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent orders card */}
        <div className="lg:col-span-2 bg-brand-card p-6 rounded-2xl border border-[#EAE3DB] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F8F4EF] pb-4">
            <h2 className="font-serif text-xl text-brand-dark">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="text-xs text-brand-accent font-semibold flex items-center space-x-1 hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-[#EAE3DB]/30 rounded-xl" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-brand-dark/50 font-serif">
              No orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-brand-dark/40 border-b border-[#F8F4EF]">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Artwork</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8F4EF] text-brand-dark/80">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-light/35 transition-colors">
                      <td className="py-3.5 font-medium">#{order.id.substring(0, 5).toUpperCase()}</td>
                      <td className="py-3.5">{order.customerName}</td>
                      <td className="py-3.5 truncate max-w-[120px]">{order.artwork?.title || 'Unknown'}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.orderStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.orderStatus === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-serif font-medium">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-brand-card p-6 rounded-2xl border border-[#EAE3DB] shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl text-brand-dark border-b border-[#F8F4EF] pb-4 mb-4">
              Quick Tasks
            </h2>
            <p className="text-xs text-brand-dark/60 leading-relaxed mb-6">
              Review active store operations, manage current inventories, or dispatch pending canvas artworks.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/dashboard/artworks"
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Palette className="w-4 h-4" />
              <span>Add New Artwork</span>
            </Link>

            <Link
              href="/dashboard/orders"
              className="w-full border border-[#EAE3DB] bg-brand-light text-brand-dark hover:bg-[#EAE3DB] text-xs font-bold tracking-widest uppercase py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Fulfill Shipments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
