'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus } from 'lucide-react';
import { Artwork } from '@/types';
import { useCart } from '@/store/useCart';

interface AddToCartButtonProps {
  artwork: Artwork;
}

export default function AddToCartButton({ artwork }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = artwork.stock <= 0;

  const handleQuantityChange = (val: number) => {
    setQuantity(Math.min(Math.max(val, 1), artwork.stock));
  };

  return (
    <div className="space-y-4">
      {!isOutOfStock && (
        <div className="flex items-center space-x-4">
          <span className="text-xs uppercase tracking-wider text-brand-dark/60 font-semibold">Quantity:</span>
          <div className="flex items-center border border-[#EAE3DB] rounded-full bg-brand-light overflow-hidden">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-2 hover:bg-[#EAE3DB] text-brand-dark transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-bold text-brand-dark">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-2 hover:bg-[#EAE3DB] text-brand-dark transition-colors"
              disabled={quantity >= artwork.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-brand-dark/50 font-medium">({artwork.stock} available)</span>
        </div>
      )}

      <button
        onClick={() => addToCart(artwork, quantity)}
        disabled={isOutOfStock}
        className={`w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase shadow-xs transition-all duration-300 flex items-center justify-center space-x-2 ${
          isOutOfStock
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-brand-accent hover:bg-brand-accent-hover text-white cursor-pointer hover:shadow-md'
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        <span>{isOutOfStock ? 'Sold Out' : 'Add to Meditation Cart'}</span>
      </button>
    </div>
  );
}
