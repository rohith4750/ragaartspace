'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setErrorMsg(res.error || 'Invalid credentials');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20 flex-grow w-full flex flex-col justify-center">
      <div className="bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 bg-brand-accent/15 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-brand-dark mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin-slow" />
            <span>RAAGA ADMIN PANEL</span>
          </div>
          <h1 className="font-serif text-2xl text-brand-dark">Welcome back</h1>
          <p className="text-xs text-brand-dark/50 max-w-[280px] mx-auto leading-relaxed">
            Enter your credentials below to log into the gallery administration dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="admin@raagaartspace.com"
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
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="border-t border-[#F8F4EF] pt-4 text-center">
          <Link
            href="/"
            className="text-xs text-brand-dark/50 hover:text-brand-accent transition-colors"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
