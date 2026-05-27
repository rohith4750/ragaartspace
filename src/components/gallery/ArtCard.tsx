'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Artwork } from '@/types';
import { useCart } from '@/store/useCart';

interface ArtCardProps {
  artwork: Artwork;
}

export default function ArtCard({ artwork }: ArtCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = artwork.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(artwork);
    }
  };

  return (
    <Link
      href={`/artworks/${artwork.id}`}
      className="group flex flex-col bg-brand-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-[#EAE3DB] transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-brand-light">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <span className="bg-white/95 text-brand-dark p-2.5 rounded-full shadow-xs hover:bg-brand-accent hover:text-white transition-colors duration-300">
            <Eye className="w-5 h-5" />
          </span>
        </div>

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-[#EAE3DB]/80 backdrop-blur-xs text-brand-dark text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
          {artwork.category}
        </span>

        {/* Stock status indicator */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-red-100 text-red-800 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
            Sold Out
          </span>
        ) : artwork.stock <= 3 ? (
          <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full">
            Only {artwork.stock} Left
          </span>
        ) : null}
      </div>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif text-lg text-brand-dark group-hover:text-brand-accent transition-colors duration-300 mb-1">
          {artwork.title}
        </h3>
        <p className="text-xs text-brand-dark/60 mb-3">{artwork.dimensions}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F8F4EF]">
          <span className="font-serif text-lg font-medium text-brand-dark">
            ₹{artwork.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-accent/15 text-brand-dark hover:bg-brand-accent hover:text-white cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
