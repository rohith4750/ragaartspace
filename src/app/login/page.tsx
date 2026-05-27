'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

function CombinedLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle redirect if session is already active
  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if ((session?.user as any)?.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [status, session, router, searchParams]);

  if (status === 'loading') {
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
        setErrorMsg(res.error || 'Invalid credentials');
        setIsLoading(false);
      } else {
        // Handled by useEffect redirect
      }
    } catch (err: any) {
      setErrorMsg('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await signupRes.json();

      if (!signupRes.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg('Account created successfully! Logging you in...');
      
      // Auto login after signup
      const loginRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        setErrorMsg('Sign up succeeded but auto-login failed. Please sign in manually.');
        setActiveTab('login');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 flex-grow w-full flex flex-col justify-center">
      <div className="bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-xs space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1 bg-brand-accent/15 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-brand-dark mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>RAAGA CUSTOMER PORTAL</span>
          </div>
          <h1 className="font-serif text-2xl text-brand-dark">Raaga Sanctuary</h1>
          <p className="text-xs text-brand-dark/50 max-w-[280px] mx-auto leading-relaxed">
            Create an account or sign in to explore process blogs and track orders.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border border-[#EAE3DB] rounded-full p-1 bg-brand-light">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-brand-accent text-white shadow-xs'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-brand-accent text-white shadow-xs'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100 text-center font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg border border-green-100 text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* Credentials Forms */}
        {activeTab === 'login' ? (
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
                  placeholder="e.g. priya@example.com"
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
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  placeholder="e.g. Priya Sharma"
                />
              </div>
            </div>

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
                  placeholder="e.g. priya@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Register Account</span>}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-[#EAE3DB]" />
          <span className="relative bg-brand-card px-3 text-[10px] uppercase font-bold text-brand-dark/40">
            Or continue with
          </span>
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={() => signIn('google')}
          className="w-full border border-[#EAE3DB] hover:border-brand-accent bg-brand-light hover:bg-[#EAE3DB] text-brand-dark text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer"
        >
          {/* Custom Chrome / Google Color Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.8-1.5 2.5v2.08h2.4a11.5 11.5 0 0 0 3.5-6.43z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3a7.15 7.15 0 0 1-11.19-3.76H2.43v3.18A12 12 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M4.88 14.33a7.12 7.12 0 0 1 0-4.51V6.64H2.43a12 12 0 0 0 0 10.87z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.93 11.93 0 0 0 12 0 12 12 0 0 0 2.43 6.64l2.45 3.18a7.15 7.15 0 0 1 7.12-5.07z"
            />
          </svg>
          <span>Google Account</span>
        </button>

        <div className="border-t border-[#F8F4EF] pt-4 text-center">
          <Link href="/" className="text-xs text-brand-dark/50 hover:text-brand-accent transition-colors">
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CombinedLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
        </div>
      }
    >
      <CombinedLoginPageContent />
    </Suspense>
  );
}
