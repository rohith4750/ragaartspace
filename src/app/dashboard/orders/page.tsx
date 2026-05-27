'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, Loader2, Check, Clock, Edit, ShieldAlert } from 'lucide-react';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Status controls
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');

  // Fetch orders
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  // Mutation to update order
  const updateMutation = useMutation({
    mutationFn: async ({ id, orderStatus, paymentStatus }: { id: string; orderStatus: string; paymentStatus: string }) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      setEditingOrderId(null);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update order');
    },
  });

  const handleEditClick = (order: Order) => {
    setEditingOrderId(order.id);
    setSelectedOrderStatus(order.orderStatus);
    setSelectedPaymentStatus(order.paymentStatus);
  };

  const handleSaveClick = (id: string) => {
    updateMutation.mutate({
      id,
      orderStatus: selectedOrderStatus,
      paymentStatus: selectedPaymentStatus,
    });
  };

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'All') return true;
    return order.orderStatus === filterStatus;
  });

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="space-y-10">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-brand-dark mb-2">Order Management</h1>
          <p className="text-sm text-brand-dark/60">
            Fulfill pending canvas orders, update courier shipping numbers, or confirm merchant bank deposits.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                filterStatus === status
                  ? 'bg-brand-accent text-white shadow-xs'
                  : 'bg-brand-card border border-[#EAE3DB] text-brand-dark/70 hover:border-brand-accent hover:text-brand-dark'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-brand-card rounded-2xl border border-[#EAE3DB] shadow-xs p-6 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 py-8 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#EAE3DB]/30 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">
            Failed to load orders. Please check your prisma schemas.
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-brand-dark/50 font-serif">
            No orders found matching this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-brand-dark/40 border-b border-[#F8F4EF]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Artwork Title</th>
                  <th className="pb-3 font-semibold">Qty</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Payment Status</th>
                  <th className="pb-3 font-semibold">Shipping Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4EF] text-brand-dark/80">
                {filteredOrders.map((order) => {
                  const isEditing = editingOrderId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-brand-light/35 transition-colors">
                      {/* ID */}
                      <td className="py-4 font-medium">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </td>

                      {/* Customer Info */}
                      <td className="py-4">
                        <span className="block text-brand-dark font-medium">{order.customerName}</span>
                        <span className="block text-[10px] text-brand-dark/55">{order.phone}</span>
                      </td>

                      {/* Artwork Title */}
                      <td className="py-4 font-serif">{order.artwork?.title || 'Deleted Artwork'}</td>

                      {/* Qty */}
                      <td className="py-4">{order.quantity}</td>

                      {/* Amount */}
                      <td className="py-4 font-serif font-medium">
                        ₹{order.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4">
                        {isEditing ? (
                          <select
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                            className="bg-brand-light border border-[#EAE3DB] rounded-lg px-2 py-1 text-xs text-brand-dark"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.paymentStatus.toLowerCase() === 'success' || order.paymentStatus.toLowerCase() === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        )}
                      </td>

                      {/* Order status */}
                      <td className="py-4">
                        {isEditing ? (
                          <select
                            value={selectedOrderStatus}
                            onChange={(e) => setSelectedOrderStatus(e.target.value)}
                            className="bg-brand-light border border-[#EAE3DB] rounded-lg px-2 py-1 text-xs text-brand-dark"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            order.orderStatus === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.orderStatus}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveClick(order.id)}
                            disabled={updateMutation.isPending}
                            className="text-emerald-600 hover:text-emerald-700 p-1.5 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Save changes"
                          >
                            {updateMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(order)}
                            className="text-brand-dark/60 hover:text-brand-accent p-1.5 hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                            title="Edit order status"
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
