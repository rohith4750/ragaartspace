import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
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

const getZenGuide = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('spiritual')) {
    return {
      resonance: "This spiritual canvas visualizes ancient celestial energy, designed to elevate consciousness, encourage daily devotion, and bring divine peace into your space.",
      placement: "Best placed in east-facing rooms to welcome morning sun and energy, or in a dedicated altar / quiet corner.",
      meditation: "Sit comfortably, focus your eyes on the center of the image, and inhale deeply for 4 seconds, holding for 4 seconds, and releasing for 4 seconds. Focus on the feeling of infinite expanse."
    };
  } else if (cat.includes('mandala')) {
    return {
      resonance: "Featuring sacred geometry and radial symmetry, this Mandala canvas acts as a visual anchor, drawing scattered thoughts back into a single point of absolute stillness.",
      placement: "Place at eye level in study rooms, home offices, or meditation rooms to improve focus and attention.",
      meditation: "Trace the circles from the outermost boundary inwards to the center point with your eyes. Let your breathing match this inward journey, slowing down as you reach the center."
    };
  } else {
    // Default / Zen / Minimalist
    return {
      resonance: "Rooted in Zen minimalism, this artwork encourages quietude, reminding us of the elegance of space, balance, and simplicity in a complex world.",
      placement: "Perfect for bedrooms, reading nooks, or transition spaces like corridors to cultivate a sense of decompression.",
      meditation: "Observe the negative space and simple lines. Let your mind become as empty and uncluttered as the canvas. Practice silent awareness for 5 minutes."
    };
  }
};

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

  const zenGuide = getZenGuide(artwork.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": artwork.title,
    "image": artwork.imageUrl,
    "description": artwork.description,
    "sku": artwork.id,
    "offers": {
      "@type": "Offer",
      "price": artwork.price,
      "priceCurrency": "INR",
      "availability": artwork.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "brand": {
      "@type": "Brand",
      "name": "Raaga Artspace"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
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
          {/* Visual Container (Left Side) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-brand-light rounded-2xl overflow-hidden border border-[#EAE3DB] flex items-center justify-center p-6 md:p-12 shadow-xs">
              <div className="relative aspect-4/3 w-full max-w-2xl rounded-lg overflow-hidden shadow-lg bg-white">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Mindful Resonance Details */}
            <div className="bg-brand-card border border-[#EAE3DB] rounded-3xl p-8 space-y-6 shadow-2xs">
              <div className="border-b border-[#F8F4EF] pb-4">
                <h2 className="font-serif text-2xl text-brand-dark">Mindful Resonance Guide</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Understanding the energy and purpose of this canvas</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-brand-dark/75">
                <div className="space-y-2">
                  <h4 className="font-serif font-semibold text-brand-dark text-sm">Spiritual Vibration</h4>
                  <p>{zenGuide.resonance}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif font-semibold text-brand-dark text-sm">Sanctuary Placement</h4>
                  <p>{zenGuide.placement}</p>
                </div>
              </div>

              <div className="bg-brand-light border border-[#EAE3DB]/50 rounded-2xl p-5 space-y-2">
                <h4 className="font-serif font-semibold text-brand-dark text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                  Meditation Practice
                </h4>
                <p className="text-brand-dark/70 leading-relaxed font-sans text-xs italic">
                  "{zenGuide.meditation}"
                </p>
              </div>
            </div>
          </div>

          {/* Text Container (Right Side) */}
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

              {/* Specifications */}
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
                  <div>
                    <span className="text-brand-dark/50 block">Craftsmanship</span>
                    <span className="font-medium text-brand-accent flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authentic Spiritual Art
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-dark/50 block">Framing</span>
                    <span className="font-medium text-brand-dark">Gallery Wrapped (Unframed)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart triggers */}
            <div className="space-y-6">
              {/* Low Stock Warning */}
              {artwork.stock < 5 && artwork.stock > 0 && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Only {artwork.stock} left in stock — printed to order.</span>
                </div>
              )}
              
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
    </>
  );
}
