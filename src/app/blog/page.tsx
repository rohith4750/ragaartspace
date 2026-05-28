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
  const [reels, setReels] = useState<BlogVideo[]>([]);

  React.useEffect(() => {
    async function fetchReels() {
      try {
        const res = await fetch('/api/reels');
        if (res.ok) {
          const data = await res.json();
          setReels(data);
        }
      } catch (err) {
        console.error('Failed to load reels:', err);
      }
    }
    fetchReels();
  }, []);

  // Your YouTube Shorts dataset (as default fallback content)
  const defaultVideos: BlogVideo[] = [
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

  const displayedVideos = reels.length > 0 ? [...reels, ...defaultVideos] : defaultVideos;

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
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-brand-card rounded-[2rem] overflow-hidden border border-[#EAE3DB] shadow-[0_4px_20px_rgba(62,62,62,0.03)] flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(163,177,138,0.18)] hover:border-brand-accent/40 transition-all duration-500 ease-out"
            >
              {/* YouTube Iframe Embed Container (Vertical 9:16 Aspect Ratio) */}
              <div className="relative aspect-[9/16] w-full bg-black flex-shrink-0 overflow-hidden">
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
                    className="absolute inset-0 w-full h-full cursor-pointer bg-brand-light flex flex-col items-center justify-center group/play overflow-hidden"
                  >
                    {/* YouTube Video Thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/0.jpg`}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 transition-all duration-300 opacity-90 group-hover:opacity-95" />

                    {/* Subtle dot pattern overlaid to soften the thumbnail */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* YouTube Premium Watermark Logo */}
                    <div className="absolute top-4 right-4 z-10 bg-black/35 backdrop-blur-md border border-white/10 p-2 rounded-full text-white/70 hover:text-red-500 transition-colors duration-300">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>

                    {/* Play button bubble (layered with outer blur & inner solid icon) */}
                    <div className="relative z-10 flex items-center justify-center">
                      {/* Outer pulsing circle */}
                      <div className="absolute w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-500 scale-95 group-hover:scale-110 group-hover:bg-brand-accent/20 group-hover:border-brand-accent/30" />
                      
                      {/* Inner solid button */}
                      <div className="relative w-14 h-14 rounded-full bg-white text-brand-dark flex items-center justify-center transition-all duration-500 shadow-md group-hover:bg-brand-accent group-hover:text-white group-hover:shadow-[0_0_20px_rgba(163,177,138,0.6)]">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Brand Channel Card Overlay at the bottom */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center space-x-3 bg-black/45 backdrop-blur-md border border-white/15 p-3 rounded-2xl transition-all duration-300 group-hover:bg-black/60">
                      <img
                        src="/images/logo.jpg"
                        alt="Raaga Artspace Logo"
                        className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-xs"
                      />
                      <div className="flex-grow min-w-0">
                        <div className="text-[11px] font-bold text-white tracking-wide truncate">
                          Raaga Artspace
                        </div>
                        <div className="text-[9px] text-white/75 truncate flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A3B18A] animate-pulse" />
                          Zen & Mandala Shorts
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-brand-accent/90 hover:bg-brand-accent text-white text-[9px] font-semibold px-2.5 py-1.5 rounded-lg uppercase tracking-wider transition-colors">
                          Meditate
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Category Tag */}
                <span className="absolute top-4 left-4 z-10 bg-black/35 backdrop-blur-md border border-white/10 text-white text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-xs">
                  {video.category}
                </span>
              </div>

              {/* Text / Details Section */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-brand-dark leading-snug hover:text-brand-accent transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-xs text-brand-dark/70 leading-relaxed line-clamp-3">
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F8F4EF] text-[10px] font-semibold text-brand-dark/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/50" />
                    {video.views}
                  </span>
                  <a
                    href={`https://youtube.com/shorts/${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-brand-accent hover:text-brand-accent-hover transition-colors duration-300 group/link"
                  >
                    <span>Watch on YouTube</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
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
