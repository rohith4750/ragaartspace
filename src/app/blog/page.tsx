'use client';

import React, { useState } from 'react';
import { Play, Sparkles, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface BlogVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  category: string;
  views: string;
}

export default function BlogPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Your YouTube Shorts dataset
  const videos: BlogVideo[] = [
    {
      id: '1',
      youtubeId: 'aI3olODT-tk',
      title: "Trust God's Plan ✨",
      description: "Whatever is coming into your life... maybe that is what you truly need. A detailed process video of hand-drawing a sacred geometric mandala.",
      category: 'Mandala Art',
      views: '8.4k views',
    },
    {
      id: '2',
      youtubeId: 'TpFuRuQPooM',
      title: "Endless Creativity 🎨",
      description: "A gorgeous process sketch illustrating classical dance postures. Captured step-by-step with charcoal and pen strokes.",
      category: 'Classical Dance',
      views: '3.4k views',
    },
    {
      id: '3',
      youtubeId: 'qkhKhNsscuU',
      title: "ఓం నమో వేంకటేశాయ 🕉",
      description: "Bringing spiritual devotion to life with an intricate drawing of Lord Venkateswara. Visual meditation process.",
      category: 'Spiritual Draw',
      views: '1.9k views',
    },
    {
      id: '4',
      youtubeId: 'HELtW2Ttvg0',
      title: "A Pause From It All..",
      description: "A calming session of emotional scribble art. Slow down, breathe, and let the pen move with your feelings.",
      category: 'Scribble Art',
      views: '1.2k views',
    },
    {
      id: '5',
      youtubeId: '4V4zc_ft83s',
      title: "Custom Bookmark Orders 💌",
      description: "Wrapping and preparing handmade custom bookmark orders for dispatch. Crafting art that follows you in your books.",
      category: 'Custom Art',
      views: '1.6k views',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-brand-light border-b border-[#EAE3DB] py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-[#EAE3DB]/80 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-dark/80">
            <Sparkles className="w-3 h-3 text-brand-accent" />
            <span>Visual Process & Daily Meditations</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-brand-dark">
            Art Space <span className="italic text-brand-accent">Shorts & Blogs</span>
          </h1>
          <p className="text-xs md:text-sm text-brand-dark/65 max-w-md mx-auto leading-relaxed">
            Follow the brushstrokes, scribbles, and meditative patterns behind every canvas. Watch process clips directly from our YouTube sanctuary.
          </p>
        </div>
      </section>

      {/* Grid of Shorts */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 flex-grow w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group bg-brand-card rounded-3xl overflow-hidden border border-[#EAE3DB] shadow-xs flex flex-col h-full hover:shadow-md transition-all duration-300"
            >
              {/* YouTube Iframe Embed Container (Vertical 9:16 Aspect Ratio) */}
              <div className="relative aspect-[9/16] w-full bg-black flex-shrink-0">
                {activeVideo === video.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <div
                    onClick={() => setActiveVideo(video.id)}
                    className="absolute inset-0 w-full h-full cursor-pointer bg-brand-light flex flex-col items-center justify-center group/play"
                  >
                    {/* Fallback pattern / background */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#A3B18A_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* YouTube Logo Watermark */}
                    <div className="absolute top-4 right-4 text-brand-dark/20 group-hover/play:text-red-500 transition-colors duration-300">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>

                    {/* Play button bubble */}
                    <div className="relative w-16 h-16 rounded-full bg-white/90 shadow-md flex items-center justify-center text-brand-accent group-hover/play:bg-brand-accent group-hover/play:text-white transition-all duration-500 transform group-hover/play:scale-110">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>

                    <span className="relative mt-4 text-[10px] uppercase font-bold tracking-widest text-brand-dark/45 group-hover/play:text-brand-dark transition-colors">
                      Click to Meditate
                    </span>
                  </div>
                )}

                {/* Video Category Tag */}
                <span className="absolute top-4 left-4 z-10 bg-[#EAE3DB]/80 backdrop-blur-xs text-brand-dark text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                  {video.category}
                </span>
              </div>

              {/* Text / Details Section */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-brand-dark leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3">
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F8F4EF] text-[10px] font-semibold text-brand-dark/50">
                  <span>{video.views}</span>
                  <a
                    href={`https://youtube.com/shorts/${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-brand-accent hover:text-brand-accent-hover transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
