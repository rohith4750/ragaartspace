'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  FileText, 
  Palette, 
  Clock, 
  Users, 
  ArrowUpRight, 
  ShoppingBag, 
  ShieldAlert, 
  Sparkles, 
  Truck, 
  TrendingUp, 
  Compass,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { AnalyticsData, Order, Artwork } from '@/types';

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
    queryKey: ['admin-orders-all'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  // Fetch artworks
  const { data: artworks = [], isLoading: artworksLoading } = useQuery<Artwork[]>({
    queryKey: ['admin-artworks-all'],
    queryFn: async () => {
      const res = await fetch('/api/artworks');
      if (!res.ok) throw new Error('Failed to fetch artworks');
      return res.json();
    },
  });

  // Client-Side Intelligence Calculations
  const paidOrders = orders.filter(
    (o) => o.paymentStatus.toLowerCase() === 'success' || o.paymentStatus.toLowerCase() === 'paid'
  );

  // 1. Today's Revenue
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const todaysRevenue = paidOrders
    .filter((o) => new Date(o.createdAt) >= oneDayAgo)
    .reduce((sum, o) => sum + o.amount, 0);

  // 2. Average Order Value (AOV)
  const averageOrderValue = paidOrders.length > 0 ? paidOrders.reduce((sum, o) => sum + o.amount, 0) / paidOrders.length : 0;

  // 3. Repeat Customer Rate
  const emailCounts = orders.reduce((acc: { [key: string]: number }, o) => {
    const email = o.email.toLowerCase();
    acc[email] = (acc[email] || 0) + 1;
    return acc;
  }, {});
  const totalUniqueCustomers = Object.keys(emailCounts).length;
  const repeatCustomersCount = Object.values(emailCounts).filter((count) => count > 1).length;
  const repeatCustomerRate = totalUniqueCustomers > 0 ? (repeatCustomersCount / totalUniqueCustomers) * 100 : 0;

  // 4. Best Performing Category & Spiritual Resonance
  const categorySales = paidOrders.reduce((acc: { [key: string]: number }, o) => {
    const cat = o.artwork?.category || 'General';
    acc[cat] = (acc[cat] || 0) + o.amount;
    return acc;
  }, {});
  let bestCategory = 'N/A';
  let maxCategorySales = 0;
  Object.entries(categorySales).forEach(([cat, sales]) => {
    if (sales > maxCategorySales) {
      maxCategorySales = sales;
      bestCategory = cat;
    }
  });

  // 5. Intelligent Smart Alerts
  const alerts: { type: 'danger' | 'warning' | 'info'; title: string; desc: string }[] = [];
  
  // Low Stock Warnings
  artworks.forEach((art) => {
    if (art.stock <= 2 && art.stock > 0) {
      alerts.push({
        type: 'warning',
        title: `Low Stock: ${art.title}`,
        desc: `Only ${art.stock} prints remaining in inventory.`
      });
    } else if (art.stock === 0) {
      alerts.push({
        type: 'danger',
        title: `Sold Out: ${art.title}`,
        desc: `Customers cannot place new bookings for this artwork.`
      });
    }
  });

  // High-value Order Warnings
  orders.forEach((o) => {
    if (o.amount >= 15000) {
      alerts.push({
        type: 'info',
        title: `High-Value Order Received`,
        desc: `${o.customerName} purchased ${o.artwork?.title || 'art'} for ₹${o.amount.toLocaleString('en-IN')}.`
      });
    }
  });

  // Delayed Shipments (Shipped status but older than 5 days, or processing older than 4 days)
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  orders.forEach((o) => {
    if ((o.orderStatus === 'Pending' || o.orderStatus === 'Processing') && new Date(o.createdAt) < fiveDaysAgo) {
      alerts.push({
        type: 'danger',
        title: `Delayed Fulfillment Alert`,
        desc: `Order #${o.id.substring(0, 5).toUpperCase()} has been pending for over 5 days.`
      });
    }
  });

  // 6. Logistics Carrier Stats
  const carrierCounts = orders.reduce((acc: { [key: string]: number }, o) => {
    const carrier = o.shipments?.[0]?.courierPartner;
    if (carrier) {
      acc[carrier] = (acc[carrier] || 0) + 1;
    }
    return acc;
  }, {});

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-10 relative">
      {/* Decorative Aura Background Blobs for Luxury/Spiritual Feel */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-accent/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#DB7093]/3 rounded-full filter blur-3xl pointer-events-none -z-10" />

      {/* Header and Vision */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-[#B8860B] mb-2 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Raaga Control System v2.0</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-dark tracking-wide">
            Operational Command Center
          </h1>
          <p className="text-sm text-brand-dark/60 max-w-xl leading-relaxed mt-1">
            Real-time logistics control, revenue intelligence, and spiritual inventory forecasting.
          </p>
        </div>
        <div className="text-xs text-brand-dark/50 bg-brand-card px-4 py-2 border border-[#EAE3DB] rounded-2xl self-start font-mono">
          Last sync: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Core Command Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            title: 'Revenue Flow',
            value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '₹0',
            subtitle: `Today: ₹${todaysRevenue.toLocaleString('en-IN')}`,
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          },
          {
            title: 'Meditation Orders',
            value: stats ? stats.totalOrders : 0,
            subtitle: `${stats ? stats.pendingOrders : 0} awaiting prep`,
            icon: FileText,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
          },
          {
            title: 'Spiritual Catalog',
            value: stats ? stats.totalArtworks : 0,
            subtitle: `${artworks.filter(a => a.stock === 0).length} items sold out`,
            icon: Palette,
            color: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20',
          },
          {
            title: 'Active Pipeline',
            value: orders.filter(o => o.orderStatus === 'Shipped').length,
            subtitle: 'En route with couriers',
            icon: Truck,
            color: 'text-purple-600 bg-purple-50 border-purple-100',
          },
          {
            title: 'Unique Patrons',
            value: stats ? stats.totalCustomers : 0,
            subtitle: `Rate: ${repeatCustomerRate.toFixed(1)}% returning`,
            icon: Users,
            color: 'text-rose-600 bg-rose-50 border-rose-100',
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-brand-card p-5 rounded-3xl border border-[#EAE3DB] flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-dark/50 font-bold">
                  {card.title}
                </span>
                <span className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="space-y-1">
                <div className="font-serif text-2xl font-semibold text-brand-dark">
                  {statsLoading ? '...' : card.value}
                </div>
                <div className="text-[10px] text-brand-dark/50 font-sans tracking-wide">
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Split view: Intelligence & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity & Logs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders */}
          <div className="bg-brand-card p-6 rounded-3xl border border-[#EAE3DB] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#F8F4EF] pb-4">
              <h2 className="font-serif text-lg text-brand-dark">Active Fulfillment Pipeline</h2>
              <Link
                href="/dashboard/orders"
                className="text-xs text-brand-accent font-semibold flex items-center space-x-1 hover:underline"
              >
                <span>Logistics Tower</span>
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
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-widest text-brand-dark/40 border-b border-[#F8F4EF] pb-3">
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Spiritual Canvas</th>
                      <th className="pb-3 font-semibold">Pipeline Status</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8F4EF] text-brand-dark/80">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-brand-light/35 transition-colors">
                        <td className="py-4 font-semibold">#{order.id.substring(0, 5).toUpperCase()}</td>
                        <td className="py-4">
                          <span className="block text-brand-dark font-medium">{order.customerName}</span>
                          <span className="block text-[9px] text-brand-dark/50">{order.phone}</span>
                        </td>
                        <td className="py-4">
                          <span className="block font-serif text-brand-dark">{order.artwork?.title || 'Unknown'}</span>
                          {order.shipments?.[0] && (
                            <span className="inline-flex items-center gap-1 text-[9px] text-brand-accent mt-0.5 font-sans font-medium">
                              <Truck className="w-2.5 h-2.5" />
                              {order.shipments[0].courierPartner} #{order.shipments[0].trackingId.substring(0, 8)}
                            </span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            order.orderStatus === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 text-right font-serif font-medium">
                          ₹{order.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Business & Logistics Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue & Marketing Insights */}
            <div className="bg-brand-card p-5 rounded-3xl border border-[#EAE3DB] shadow-2xs space-y-4">
              <h3 className="font-serif font-semibold text-sm text-brand-dark flex items-center gap-1.5 border-b border-[#F8F4EF] pb-3">
                <TrendingUp className="w-4 h-4 text-brand-accent" />
                Revenue Intelligence
              </h3>
              <div className="space-y-3.5 text-xs text-brand-dark/85 font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-brand-dark/65">AOV (Average Order Value)</span>
                  <span className="font-semibold text-brand-dark">₹{averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-dark/65">Leading Theme / Category</span>
                  <span className="font-semibold text-brand-accent uppercase tracking-wider text-[10px] bg-brand-accent/15 px-2 py-0.5 rounded-full">{bestCategory}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-brand-dark/65">Repeat Buyer Rate</span>
                  <span className="font-semibold text-brand-dark">{repeatCustomerRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Carrier Analytics */}
            <div className="bg-brand-card p-5 rounded-3xl border border-[#EAE3DB] shadow-2xs space-y-4">
              <h3 className="font-serif font-semibold text-sm text-brand-dark flex items-center gap-1.5 border-b border-[#F8F4EF] pb-3">
                <Compass className="w-4 h-4 text-brand-accent animate-spin-slow" />
                Courier Performance
              </h3>
              <div className="space-y-3">
                {Object.keys(carrierCounts).length === 0 ? (
                  <p className="text-[11px] text-brand-dark/50 italic py-2 text-center">No carriers assigned to active shipments yet.</p>
                ) : (
                  Object.entries(carrierCounts).map(([carrier, count]) => (
                    <div key={carrier} className="flex justify-between items-center text-xs text-brand-dark/85">
                      <span className="font-medium">{carrier}</span>
                      <span className="text-brand-dark/55 bg-brand-light border border-[#EAE3DB]/40 px-2.5 py-0.5 rounded-lg text-[10px]">{count} shipments</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts Panel & Command Actions */}
        <div className="space-y-8">
          
          {/* Smart Operational Alerts */}
          <div className="bg-brand-card p-6 rounded-3xl border border-[#EAE3DB] shadow-2xs space-y-5">
            <div className="border-b border-[#F8F4EF] pb-3 flex items-center justify-between">
              <h2 className="font-serif text-base text-brand-dark flex items-center gap-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-[#FF8C00]" />
                Command Center Alerts
              </h2>
              <span className="bg-[#FF8C00]/10 text-[#FF8C00] font-bold text-[9px] px-2 py-0.5 rounded-full">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-brand-dark/45 text-[11px] font-sans">
                  ✨ Clear skies: All logs and stock lists running at 100% capacity.
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex flex-col space-y-1 ${
                      alert.type === 'danger'
                        ? 'bg-red-50/70 border-red-100 text-red-800'
                        : alert.type === 'warning'
                        ? 'bg-amber-50/70 border-amber-100 text-amber-800'
                        : 'bg-blue-50/70 border-blue-100 text-blue-800'
                    }`}
                  >
                    <span className="font-semibold text-brand-dark flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        alert.type === 'danger' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-brand-dark/65 font-sans">
                      {alert.desc}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-brand-card p-6 rounded-3xl border border-[#EAE3DB] shadow-2xs space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-base text-brand-dark border-b border-[#F8F4EF] pb-3 mb-3">
                Command Actions
              </h2>
              <p className="text-[11px] text-brand-dark/65 leading-relaxed">
                Execute catalog restock modifications, audit ship records, or adjust inventory thresholds.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <Link
                href="/dashboard/artworks"
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-2xl transition-all duration-300 shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Palette className="w-4 h-4" />
                <span>Manage Artworks</span>
                <ArrowRight className="w-3.5 h-3.5 translate-x-0.5" />
              </Link>

              <Link
                href="/dashboard/orders"
                className="w-full border border-[#EAE3DB] bg-[#FAF8F5] text-brand-dark hover:bg-[#EAE3DB] text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Fulfill Shipments</span>
                <ArrowRight className="w-3.5 h-3.5 translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
