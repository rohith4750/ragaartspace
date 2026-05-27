'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ArtCard from '@/components/gallery/ArtCard';
import { Artwork } from '@/types';
import { Search, Sparkles } from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Fetch artworks using TanStack React Query
  const { data: artworks = [], isLoading, error } = useQuery<Artwork[]>({
    queryKey: ['artworks', search, category],
    queryFn: async () => {
      const res = await fetch(`/api/artworks?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error('Failed to fetch artworks');
      return res.json();
    },
  });

  const categories = ['All', 'Spiritual', 'Mandala', 'Zen', 'Minimalist'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-light border-b border-[#EAE3DB] py-12 md:py-20 px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-[#EAE3DB]/80 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-brand-dark/80">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Art that calms the mind and soothes the soul</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-brand-dark max-w-2xl mx-auto leading-tight">
            Mindful Art for <br /><span className="italic text-brand-accent">Soulful Spaces</span>
          </h1>
          <p className="text-sm md:text-base text-brand-dark/70 max-w-lg mx-auto leading-relaxed">
            Welcome to Raaga Artspace. Discover a curated collection of spiritual canvas paintings, minimalist line art, and visual meditations designed to bring peaceful energy into your home.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 flex-grow w-full">
        {/* Controls: Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          {/* Search bar */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
            <input
              type="text"
              placeholder="Search artworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-card pl-10 pr-4 py-2.5 rounded-full border border-[#EAE3DB] text-sm text-brand-dark focus:outline-hidden focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-dark/30 shadow-xs"
            />
          </div>

          {/* Categories Selector */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                  category === cat
                    ? 'bg-brand-accent text-white shadow-xs'
                    : 'bg-brand-card border border-[#EAE3DB] text-brand-dark/70 hover:border-brand-accent hover:text-brand-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col space-y-4">
                <div className="aspect-4/3 w-full bg-[#EAE3DB]/50 rounded-2xl" />
                <div className="h-4 bg-[#EAE3DB]/50 rounded-md w-3/4" />
                <div className="h-4 bg-[#EAE3DB]/50 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600 font-medium">
            Failed to load gallery. Please check your database connection or try again.
          </div>
        )}

        {/* Artworks Grid */}
        {!isLoading && !error && (
          <>
            {artworks.length === 0 ? (
              <div className="text-center py-16 text-brand-dark/50 font-serif text-lg">
                No artworks found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {artworks.map((artwork) => (
                  <ArtCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
