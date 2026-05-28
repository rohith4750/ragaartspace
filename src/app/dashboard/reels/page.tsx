'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Film, Loader2, Plus, Sparkles, Trash2, Eye } from 'lucide-react';
import { Reel } from '@/types';

export default function AdminReelsPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Reel inputs
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [category, setCategory] = useState('Zen Art');
  const [description, setDescription] = useState('');

  // Fetch posted reels
  const { data: reels = [], isLoading } = useQuery<Reel[]>({
    queryKey: ['admin-reels'],
    queryFn: async () => {
      const res = await fetch('/api/reels');
      if (!res.ok) throw new Error('Failed to fetch reels');
      return res.json();
    },
  });

  // Mutation to post new reel
  const postMutation = useMutation({
    mutationFn: async (newReel: { title: string; youtubeId: string; category: string; description: string }) => {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReel),
      });
      if (!res.ok) throw new Error('Failed to post new reel');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reels'] });
      // Reset form
      setTitle('');
      setYoutubeId('');
      setDescription('');
      setShowAddForm(false);
    },
    onError: (err: any) => {
      alert(err.message || 'Error occurred posting reel');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeId.trim() || !description.trim()) {
      alert('Please fill out all fields');
      return;
    }
    postMutation.mutate({
      title,
      youtubeId,
      category,
      description,
    });
  };

  return (
    <div className="space-y-10">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-brand-dark mb-2">Reels & Blog Management</h1>
          <p className="text-sm text-brand-dark/60">
            Publish visual art process clips, meditation guides, and YouTube shorts directly to the store blog.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3 px-5 rounded-2xl transition-all duration-300 shadow-xs flex items-center space-x-2 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'View All' : 'Post Reel'}</span>
        </button>
      </div>

      {showAddForm ? (
        /* Post Reel Form */
        <div className="max-w-2xl bg-brand-card border border-[#EAE3DB] rounded-3xl p-6 md:p-8 shadow-xs">
          <h2 className="font-serif text-xl text-brand-dark border-b border-[#F8F4EF] pb-3 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
            Publish YouTube Short / Reel
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs text-brand-dark">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-semibold uppercase tracking-wider text-[10px] text-brand-dark/60">Reel Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trust God's Plan ✨"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-accent text-brand-dark"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold uppercase tracking-wider text-[10px] text-brand-dark/60">Category / Vibe</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-accent text-brand-dark"
                >
                  <option value="Zen Art">Zen Art</option>
                  <option value="Mandala Art">Mandala Art</option>
                  <option value="Spiritual Draw">Spiritual Draw</option>
                  <option value="Scribble Art">Scribble Art</option>
                  <option value="Custom Art">Custom Art</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-[10px] text-brand-dark/60">YouTube Short URL or ID</label>
              <input
                type="text"
                required
                placeholder="e.g. https://youtube.com/shorts/aI3olODT-tk or just aI3olODT-tk"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-accent text-brand-dark font-mono"
              />
              <span className="text-[10px] text-brand-dark/45 block mt-1">
                Supports full YouTube URLs. We will automatically extract the 11-character video ID.
              </span>
            </div>

            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-[10px] text-brand-dark/60">Description & Spiritual Meaning</label>
              <textarea
                rows={4}
                required
                placeholder="Describe the paint strokes, charcoal layering process, or spiritual meditation ideas behind the art..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-accent text-brand-dark leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={postMutation.isPending}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              {postMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Publish to Storefront Blog</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Reels Listing Table */
        <div className="bg-brand-card rounded-2xl border border-[#EAE3DB] shadow-xs p-6 overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 py-8 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-[#EAE3DB]/30 rounded-xl" />
              ))}
            </div>
          ) : reels.length === 0 ? (
            <div className="text-center py-12 text-brand-dark/50 font-serif">
              No custom reels published yet. Click "Post Reel" to publish your first process clip!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-brand-dark/40 border-b border-[#F8F4EF] pb-3">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Vibe / Category</th>
                    <th className="pb-3 font-semibold">YouTube ID</th>
                    <th className="pb-3 font-semibold">Analytics</th>
                    <th className="pb-3 font-semibold">Publish Date</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8F4EF] text-brand-dark/80">
                  {reels.map((reel) => (
                    <tr key={reel.id} className="hover:bg-brand-light/35 transition-colors">
                      <td className="py-4 font-semibold text-brand-dark">{reel.title}</td>
                      <td className="py-4">
                        <span className="bg-brand-accent/15 text-brand-dark font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full text-[9px]">
                          {reel.category}
                        </span>
                      </td>
                      <td className="py-4 font-mono">{reel.youtubeId}</td>
                      <td className="py-4 font-sans text-brand-dark/60">{reel.views}</td>
                      <td className="py-4 text-brand-dark/50">
                        {new Date(reel.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <a
                          href={`https://youtube.com/shorts/${reel.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-brand-accent hover:text-brand-accent-hover p-1.5 hover:bg-brand-light rounded-lg transition-colors cursor-pointer mr-2"
                          title="Preview video"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
