import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artwork = await prisma.artwork.findUnique({ where: { id } });
  
  return {
    title: artwork ? `${artwork.title} | Raaga Artspace` : 'Artwork Details | Raaga Artspace',
    description: artwork ? artwork.description : 'View details of our spiritual artworks.',
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params;
  const artwork = await prisma.artwork.findUnique({
    where: { id },
  });

  if (!artwork) {
    notFound();
  }

  const serializableArtwork = {
    ...artwork,
    createdAt: artwork.createdAt.toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm font-medium text-brand-dark/60 hover:text-brand-dark transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Gallery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Visual Container */}
        <div className="lg:col-span-7 bg-brand-light rounded-2xl overflow-hidden border border-[#EAE3DB] flex items-center justify-center p-6 md:p-12 shadow-xs">
          <div className="relative aspect-4/3 w-full max-w-2xl rounded-lg overflow-hidden shadow-lg bg-white">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            {/* Category */}
            <span className="inline-block bg-brand-accent/15 text-brand-dark text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4">
              {artwork.category}
            </span>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl text-brand-dark mb-2">
              {artwork.title}
            </h1>

            {/* Price */}
            <div className="font-serif text-2xl font-semibold text-brand-dark mb-6">
              ₹{artwork.price.toLocaleString('en-IN')}
            </div>

            {/* Divider */}
            <hr className="border-[#EAE3DB] mb-6" />

            {/* Description */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-xs tracking-widest text-brand-dark/80 uppercase">The Story</h3>
              <p className="text-sm text-brand-dark/75 leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Dimensions */}
            <div className="space-y-2 mb-8">
              <h3 className="font-semibold text-xs tracking-widest text-brand-dark/80 uppercase">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 bg-brand-light p-4 rounded-xl text-xs border border-[#EAE3DB]">
                <div>
                  <span className="text-brand-dark/50 block">Dimensions</span>
                  <span className="font-medium text-brand-dark">{artwork.dimensions}</span>
                </div>
                <div>
                  <span className="text-brand-dark/50 block">Medium</span>
                  <span className="font-medium text-brand-dark">Premium Canvas Print</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart triggers */}
          <div className="space-y-6">
            <AddToCartButton artwork={serializableArtwork} />
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-[10px] text-brand-dark/60 text-center border-t border-[#EAE3DB]">
              <div className="flex flex-col items-center space-y-1">
                <Truck className="w-4 h-4 text-brand-accent" />
                <span>Free Safe Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-brand-accent" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <RefreshCw className="w-4 h-4 text-brand-accent" />
                <span>100% Authentic Art</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
