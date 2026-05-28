'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, Loader2, Check, Edit, ExternalLink, Calendar, Search, HelpCircle } from 'lucide-react';
import { Order, Shipment } from '@/types';

// Extended type to include parent order
interface ExtendedShipment extends Shipment {
  order: Order;
}

export default function AdminShipmentsPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status edit controls
  const [editingShipmentId, setEditingShipmentId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editingCarrier, setEditingCarrier] = useState('');
  const [editingTrackingId, setEditingTrackingId] = useState('');

  // Fetch orders (includes shipments)
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  // Mutation to update shipment details via order PUT API
  const updateShipmentMutation = useMutation({
    mutationFn: async ({ 
      orderId, 
      shipmentStatus, 
      courierPartner, 
      trackingId 
    }: { 
      orderId: string; 
      shipmentStatus?: string; 
      courierPartner?: string; 
      trackingId?: string;
    }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentStatus, courierPartner, trackingId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update shipment');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setEditingShipmentId(null);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update shipment');
    },
  });

  // Extract all shipments from orders list
  const allShipments: ExtendedShipment[] = orders.flatMap((order) => {
    return (order.shipments || []).map((shipment) => ({
      ...shipment,
      order,
    }));
  });

  // Apply filters and search queries
  const filteredShipments = allShipments.filter((shipment) => {
    // Status Filter
    const matchesStatus = filterStatus === 'All' || shipment.currentStatus === filterStatus;
    
    // Search Query (Customer Name, Order ID, Tracking ID, Courier Partner)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      shipment.order.customerName.toLowerCase().includes(query) ||
      shipment.order.id.toLowerCase().includes(query) ||
      shipment.trackingId.toLowerCase().includes(query) ||
      shipment.courierPartner.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const handleEditClick = (shipment: ExtendedShipment) => {
    setEditingShipmentId(shipment.id);
    setSelectedStatus(shipment.currentStatus);
    setEditingCarrier(shipment.courierPartner);
    setEditingTrackingId(shipment.trackingId);
  };

  const handleSaveClick = (orderId: string) => {
    updateShipmentMutation.mutate({
      orderId,
      shipmentStatus: selectedStatus,
      courierPartner: editingCarrier,
      trackingId: editingTrackingId,
    });
  };

  const getTrackingUrl = (partner: string, id: string) => {
    const p = partner.toLowerCase();
    if (p.includes('delhivery')) return `https://www.delhivery.com/track/package/${id}`;
    if (p.includes('dhl')) return `https://www.dhl.com/en/express/tracking.html?AWB=${id}`;
    if (p.includes('fedex')) return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${id}`;
    if (p.includes('bluedart') || p.includes('blue dart')) return `https://www.bluedart.com/`;
    if (p.includes('dtdc')) return `https://www.dtdc.in/`;
    if (p.includes('speed post') || p.includes('india post')) return `https://www.indiapost.gov.in/`;
    return `https://www.google.com/search?q=${encodeURIComponent(partner + ' tracking ' + id)}`;
  };

  const statusOptions = ['All', 'Shipped', 'In Transit', 'Out For Delivery', 'Delivered', 'Failed'];

  return (
    <div className="space-y-10">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-dark mb-2">Logistics Control Tower</h1>
          <p className="text-sm text-brand-dark/60">
            Real-time package dispatch monitoring, carrier assignments, and shipping transit logs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search customer, order, tracking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-hidden focus:border-brand-accent text-brand-dark placeholder:text-brand-dark/40"
          />
          <Search className="w-4 h-4 text-brand-dark/30 absolute left-3 top-3" />
        </div>
      </div>

      {/* Filter Status Chips */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              filterStatus === status
                ? 'bg-brand-accent text-white shadow-xs'
                : 'bg-brand-card border border-[#EAE3DB] text-brand-dark/70 hover:border-brand-accent hover:text-brand-dark'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Shipments Listing */}
      <div className="bg-brand-card rounded-2xl border border-[#EAE3DB] shadow-xs p-6 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 py-8 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#EAE3DB]/30 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">
            Failed to load shipments. Please sync database schemas.
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-12 text-brand-dark/50 font-serif">
            No shipments active in this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-brand-dark/40 border-b border-[#F8F4EF] pb-3">
                  <th className="pb-3 font-semibold">Shipment Key</th>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Destination / Patron</th>
                  <th className="pb-3 font-semibold">Carrier / Partner</th>
                  <th className="pb-3 font-semibold">Tracking Number</th>
                  <th className="pb-3 font-semibold">Transit Status</th>
                  <th className="pb-3 font-semibold">Logs / Timeline</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4EF] text-brand-dark/80">
                {filteredShipments.map((shipment) => {
                  const isEditing = editingShipmentId === shipment.id;
                  
                  return (
                    <tr key={shipment.id} className="hover:bg-brand-light/35 transition-colors">
                      {/* Shipment Key */}
                      <td className="py-4 font-mono font-semibold">
                        #{shipment.id.substring(0, 8).toUpperCase()}
                      </td>

                      {/* Parent Order Link */}
                      <td className="py-4 font-mono">
                        <Link 
                          href="/dashboard/orders" 
                          className="text-brand-accent hover:underline"
                        >
                          #{shipment.order.id.substring(0, 8).toUpperCase()}
                        </Link>
                      </td>

                      {/* Patron Info */}
                      <td className="py-4">
                        <span className="block text-brand-dark font-medium">{shipment.order.customerName}</span>
                        <span className="block text-[10px] text-brand-dark/50 truncate max-w-[150px]">{shipment.order.address}</span>
                      </td>

                      {/* Carrier */}
                      <td className="py-4 font-serif">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingCarrier}
                            onChange={(e) => setEditingCarrier(e.target.value)}
                            className="bg-brand-light border border-[#EAE3DB] rounded-lg px-2 py-1 text-xs text-brand-dark font-sans w-24"
                          />
                        ) : (
                          shipment.courierPartner
                        )}
                      </td>

                      {/* Tracking ID */}
                      <td className="py-4 font-mono">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingTrackingId}
                            onChange={(e) => setEditingTrackingId(e.target.value)}
                            className="bg-brand-light border border-[#EAE3DB] rounded-lg px-2 py-1 text-xs text-brand-dark w-32"
                          />
                        ) : (
                          <div className="flex items-center gap-1">
                            <span>{shipment.trackingId}</span>
                            <a
                              href={getTrackingUrl(shipment.courierPartner, shipment.trackingId)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-dark/40 hover:text-brand-accent transition-colors"
                              title="Live carrier page lookup"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4">
                        {isEditing ? (
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-brand-light border border-[#EAE3DB] rounded-lg px-2 py-1 text-xs text-brand-dark"
                          >
                            <option value="Shipped">Shipped</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Out For Delivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Failed">Failed</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            shipment.currentStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : shipment.currentStatus === 'Failed'
                              ? 'bg-red-100 text-red-800'
                              : shipment.currentStatus === 'Out For Delivery'
                              ? 'bg-purple-100 text-purple-800'
                              : shipment.currentStatus === 'In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {shipment.currentStatus.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      {/* Timeline dates */}
                      <td className="py-4 text-[10px] text-brand-dark/60 font-sans space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-dark/30" />
                          <span>Shipped: {shipment.shippedAt ? new Date(shipment.shippedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {shipment.deliveredAt && (
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                            <span>Delivered: {new Date(shipment.deliveredAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveClick(shipment.order.id)}
                            disabled={updateShipmentMutation.isPending}
                            className="text-emerald-600 hover:text-emerald-700 p-1.5 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Save shipment changes"
                          >
                            {updateShipmentMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(shipment)}
                            className="text-brand-dark/60 hover:text-brand-accent p-1.5 hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                            title="Edit shipment status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
