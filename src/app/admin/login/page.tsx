"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      const role = (session?.user as any)?.role;
      if (['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  }, [status, session, router, searchParams]);

  // Show spinner while loading OR while already authenticated (redirect pending)
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setErrorMsg(res.error || 'Invalid admin credentials');
        setIsLoading(false);
      } else {
        // Fetch session info immediately to determine the user's role
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (['ADMIN', 'MANAGER', 'STAFF'].includes(sessionData?.user?.role)) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      }
    } catch {
      setErrorMsg('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex flex-col md:grid md:grid-cols-2 flex-grow bg-background px-4 md:px-0">
      <div className="hidden md:flex flex-col justify-center items-center bg-brand-light border-r border-[#EAE3DB] p-12 relative overflow-hidden">
        <Image src="/logo.jpg" alt="Raga Artspace Logo" width={120} height={120} className="mb-6" />
        <h1 className="font-serif text-2xl text-brand-dark mb-2">RAAGA ADMIN PORTAL</h1>
        <p className="text-center text-sm text-brand-dark/70">“Art is the lie that enables us to realize the truth.” – Pablo Picasso</p>
      </div>
      <div className="flex flex-col justify-center items-center px-4 py-12 md:py-16 md:px-12 w-full flex-grow">
        <div className="max-w-sm md:max-w-md w-full bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-xs space-y-6">
          <div className="text-center space-y-4">

            <h1 className="font-serif text-2xl text-brand-dark">RAAGA ADMIN PORTAL</h1>
            <p className="text-sm text-brand-dark/70">Welcome to the Sanctuary. Create an account or sign in to explore process blogs and track orders.</p>
          </div>
          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 text-center font-medium">
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  placeholder="e.g. admin@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Login</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-brand-accent" /></div>}>
      <AdminLoginPageContent />
    </Suspense>
  );
}


