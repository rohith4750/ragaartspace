import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Package, Truck, CheckCircle, Sparkles, MapPin, Phone, Mail, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Tracking #${id.substring(0, 8).toUpperCase()} | Raaga Artspace`,
    description: 'Track your spiritual artwork delivery status.',
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      artwork: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = statuses.indexOf(order.orderStatus);

  const steps = [
    { label: 'Order Placed', desc: 'We have received your order details.', icon: Clock },
    { label: 'Processing', desc: 'Preparing your canvas package.', icon: Package },
    { label: 'Shipped', desc: 'En route via secure art courier.', icon: Truck },
    { label: 'Delivered', desc: 'Arrived at your sanctuary.', icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 w-full flex-grow">
      {/* Return link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-brand-dark/60 hover:text-brand-dark transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Gallery</span>
      </Link>

      <div className="bg-brand-card rounded-3xl p-6 md:p-10 border border-[#EAE3DB] shadow-xs space-y-10">
        {/* Header receipt info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#F8F4EF] pb-6 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1 bg-brand-accent/15 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-brand-dark">
              <Sparkles className="w-3 h-3 text-brand-accent" />
              <span>THANK YOU FOR YOUR PURCHASE</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-brand-dark">
              Order #{order.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-xs text-brand-dark/50">
              Placed on {order.createdAt.toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <div className="text-left md:text-right space-y-1">
            <span className="text-xs text-brand-dark/50 block">Payment Status</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              order.paymentStatus.toLowerCase() === 'success' || order.paymentStatus.toLowerCase() === 'paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Shipping timeline */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-brand-dark">Delivery Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 relative">
            {/* Horizontal timeline bar for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-0.5 bg-[#EAE3DB]" />
            <div
              className="hidden md:block absolute top-[28px] left-[12.5%] h-0.5 bg-brand-accent transition-all duration-700"
              style={{ width: `${(Math.max(currentStepIndex, 0) / 3) * 75}%` }}
            />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={idx} className="flex md:flex-col items-center md:text-center space-x-4 md:space-x-0 md:space-y-3 relative z-10">
                  {/* Step bubble */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-brand-accent border-brand-accent text-white shadow-xs'
                        : 'bg-white border-[#EAE3DB] text-brand-dark/30'
                    } ${isCurrent ? 'ring-4 ring-brand-accent/20 scale-105' : ''}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Step descriptions */}
                  <div className="text-left md:text-center space-y-0.5 flex-grow md:flex-grow-0">
                    <h3 className={`font-serif text-sm font-semibold ${isCompleted ? 'text-brand-dark font-bold' : 'text-brand-dark/40'}`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-brand-dark/50 max-w-[160px] md:mx-auto leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Address Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#F8F4EF]">
          {/* Items checklist */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg text-brand-dark flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-accent" />
              Receipt Details
            </h2>
            <div className="bg-brand-light border border-[#EAE3DB] p-5 rounded-2xl space-y-4 text-sm">
              <div className="flex justify-between items-start pb-4 border-b border-[#EAE3DB]">
                <div className="flex items-center space-x-3">
                  <span className="w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-[#EAE3DB]">
                    <img
                      src={order.artwork.imageUrl}
                      alt={order.artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <div>
                    <span className="font-serif font-medium text-brand-dark block">{order.artwork.title}</span>
                    <span className="text-xs text-brand-dark/50 block">{order.artwork.dimensions}</span>
                  </div>
                </div>
                <span className="font-serif text-brand-dark whitespace-nowrap">
                  Qty: {order.quantity}
                </span>
              </div>

              <div className="flex justify-between font-semibold text-brand-dark text-base pt-2">
                <span>Paid Amount</span>
                <span className="font-serif">₹{order.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg text-brand-dark flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-accent" />
              Delivery Location
            </h2>
            <div className="bg-brand-light border border-[#EAE3DB] p-5 rounded-2xl space-y-4 text-sm">
              <div className="font-medium text-brand-dark border-b border-[#EAE3DB] pb-2 text-base">
                {order.customerName}
              </div>
              <div className="space-y-2 text-brand-dark/70">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-dark/40" />
                  <span>{order.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-dark/40" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-brand-dark/40 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{order.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
