'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Loader2, Upload, X, Palette, AlertCircle } from 'lucide-react';
import { Artwork } from '@/types';

export default function AdminArtworksPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Spiritual');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Local helper states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch artworks
  const { data: artworks = [], isLoading, error } = useQuery<Artwork[]>({
    queryKey: ['admin-artworks'],
    queryFn: async () => {
      const res = await fetch('/api/artworks');
      if (!res.ok) throw new Error('Failed to fetch artworks');
      return res.json();
    },
  });

  // Open modal for adding
  const handleOpenAdd = () => {
    setEditingArtwork(null);
    setTitle('');
    setDescription('');
    setCategory('Spiritual');
    setPrice('');
    setStock('');
    setDimensions('');
    setImageUrl('');
    setUploadError('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setTitle(artwork.title);
    setDescription(artwork.description);
    setCategory(artwork.category);
    setPrice(artwork.price.toString());
    setStock(artwork.stock.toString());
    setDimensions(artwork.dimensions);
    setImageUrl(artwork.imageUrl);
    setUploadError('');
    setIsModalOpen(true);
  };

  // Handle local image file upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image. Make sure you are signed in.');
    } finally {
      setIsUploading(false);
    }
  };

  // Mutation for creating/updating
  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        dimensions,
        imageUrl,
      };

      const url = editingArtwork ? `/api/artworks/${editingArtwork.id}` : '/api/artworks';
      const method = editingArtwork ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save artwork');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      alert(err.message || 'Operation failed');
    },
  });

  // Mutation for deleting
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/artworks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete artwork');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete artwork');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setUploadError('Artwork image is required.');
      return;
    }
    saveMutation.mutate();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-brand-dark mb-2">Artwork Catalog</h1>
          <p className="text-sm text-brand-dark/60">
            Publish new art pieces, manage canvas inventory levels, or update sizes and details.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Artwork</span>
        </button>
      </div>

      {/* Catalog Table Card */}
      <div className="bg-brand-card rounded-2xl border border-[#EAE3DB] shadow-xs p-6 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 py-8 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-[#EAE3DB]/30 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600 font-medium">
            Failed to load artworks. Please check your database tables.
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-12 text-brand-dark/50 font-serif">
            No artworks in catalog. Click "Upload Artwork" to add one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-brand-dark/40 border-b border-[#F8F4EF]">
                  <th className="pb-3 font-semibold">Image</th>
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                  <th className="pb-3 font-semibold text-center">Stock</th>
                  <th className="pb-3 font-semibold">Dimensions</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4EF] text-brand-dark/80">
                {artworks.map((artwork) => (
                  <tr key={artwork.id} className="hover:bg-brand-light/35 transition-colors">
                    <td className="py-4">
                      <span className="w-12 h-12 rounded-lg bg-brand-light overflow-hidden flex border border-[#EAE3DB]">
                        <img
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </span>
                    </td>
                    <td className="py-4 font-serif text-base text-brand-dark font-medium">
                      {artwork.title}
                    </td>
                    <td className="py-4">
                      <span className="bg-[#EAE3DB]/75 text-brand-dark text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full">
                        {artwork.category}
                      </span>
                    </td>
                    <td className="py-4 text-right font-serif">
                      ₹{artwork.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        artwork.stock <= 0
                          ? 'bg-red-100 text-red-800'
                          : artwork.stock <= 3
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {artwork.stock}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-brand-dark/60">{artwork.dimensions}</td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(artwork)}
                        className="text-brand-dark/60 hover:text-brand-accent p-1.5 hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                        title="Edit artwork"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(artwork.id, artwork.title)}
                        className="text-brand-dark/40 hover:text-red-600 p-1.5 hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
                        title="Delete artwork"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/45 backdrop-blur-xs px-4">
          <div className="bg-brand-card rounded-3xl max-w-2xl w-full border border-[#EAE3DB] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EAE3DB] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-brand-accent" />
                <h2 className="font-serif text-xl text-brand-dark">
                  {editingArtwork ? `Edit ${editingArtwork.title}` : 'Upload New Artwork'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-brand-light rounded-full text-brand-dark/60 hover:text-brand-dark transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              {uploadError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Visual Asset Uploader (With Preview) */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                  Artwork Canvas Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-dashed border-[#EAE3DB] rounded-2xl bg-brand-light/30">
                  {/* Image preview box */}
                  <div className="w-32 h-24 bg-brand-light rounded-xl overflow-hidden border border-[#EAE3DB] flex items-center justify-center flex-shrink-0 relative">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Artwork preview" className="w-full h-full object-cover" />
                    ) : (
                      <Palette className="w-8 h-8 text-brand-dark/20" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-brand-dark/20 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
                      </div>
                    )}
                  </div>

                  {/* Upload triggers */}
                  <div className="flex-grow space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center space-x-2 bg-brand-accent/15 hover:bg-brand-accent/25 text-brand-dark text-xs font-semibold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-brand-accent" />
                      <span>{imageUrl ? 'Replace Canvas File' : 'Upload Image File'}</span>
                    </button>
                    <p className="text-[10px] text-brand-dark/50">
                      Supports JPG, PNG or WebP files. High-resolution canvas crops recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                    Artwork Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                    placeholder="e.g. Shiva Canvas Art"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  >
                    <option value="Spiritual">Spiritual</option>
                    <option value="Mandala">Mandala</option>
                    <option value="Zen">Zen</option>
                    <option value="Minimalist">Minimalist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                    placeholder="e.g. 799"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                    placeholder="e.g. 10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    required
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                    placeholder="e.g. 18x24 inches"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                  Description / Story
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark resize-none"
                  placeholder="Detail the spiritual history, textures, and meditation guidelines for this art piece..."
                />
              </div>

              {/* Submit panel */}
              <div className="border-t border-[#EAE3DB] pt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#EAE3DB] text-brand-dark hover:bg-brand-light transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase px-6 py-2.5 rounded-full shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {saveMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingArtwork ? 'Save Changes' : 'Publish Artwork'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
