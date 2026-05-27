import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-brand-light border-t border-[#EAE3DB] py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <img
              src="/images/logo.jpg"
              alt="RAAGA Artspace"
              className="w-8 h-8 rounded-full object-cover border border-[#EAE3DB]"
            />
            <h3 className="font-serif text-xl tracking-wider text-brand-dark">RAAGA Artspace</h3>
          </div>
          <p className="text-sm text-brand-dark/70 max-w-xs leading-relaxed">
            A digital sanctuary showcasing mindful, spiritual, and calming artwork. Designed to bring peaceful energy and soulful aesthetics into your home.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-xs tracking-widest text-brand-dark/80 uppercase mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-brand-dark/70">
            <li>
              <Link href="/" className="hover:text-brand-accent transition-colors">Art Gallery</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-accent transition-colors">Video Meditations (Blog)</Link>
            </li>
            <li>
              <Link href="/orders/track" className="hover:text-brand-accent transition-colors">Order Tracking</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-xs tracking-widest text-brand-dark/80 uppercase mb-4">Mindful Statement</h4>
          <p className="text-xs text-brand-dark/65 italic leading-relaxed">
            "Art is not what you see, but what you make others feel. Let every canvas be a visual meditation for your home."
          </p>
          <div className="mt-4 text-xs text-brand-dark/50">
            © {new Date().getFullYear()} Raaga Artspace. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
