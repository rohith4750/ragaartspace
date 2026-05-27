"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, User, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

function AdminLoginPageContent() {
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

  // Redirect after successful login (admin or customer)
  useEffect(() => {
    if (status === 'authenticated') {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if ((session?.user as any)?.role === 'ADMIN') {
        router.push('/admin');
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
      }
    } catch {
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
      const loginRes = await signIn('credentials', { email, password, redirect: false });
      if (loginRes?.error) {
        setErrorMsg('Sign up succeeded but auto‑login failed. Please sign in manually.');
        setActiveTab('login');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex flex-col md:grid md:grid-cols-2 flex-grow bg-background px-4 md:px-0">
      {/* Left Panel – optional branding */}
      <div className="hidden md:flex flex-col justify-center items-center bg-brand-light border-r border-[#EAE3DB] p-12 relative overflow-hidden">
        {/* Branding content can stay the same as customer login */}
      </div>
      {/* Right Panel – auth forms */}
      <div className="flex flex-col justify-center items-center px-4 py-12 md:py-16 md:px-12 w-full flex-grow">
        <div className="max-w-sm md:max-w-md w-full bg-brand-card rounded-3xl p-8 border border-[#EAE3DB] shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-2xl text-brand-dark md:hidden">Admin Portal</h1>
            <h1 className="font-serif text-2xl text-brand-dark hidden md:block">Admin Sign‑In</h1>
          </div>
          {/* Tabs */}
          <div className="flex border border-[#EAE3DB] rounded-full p-1 bg-brand-light">
            <button
              className={`flex-1 py-2 rounded-full ${activeTab === 'login' ? 'bg-brand-accent text-white shadow-xs' : 'text-brand-dark/60 hover:text-brand-dark'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-full ${activeTab === 'signup' ? 'bg-brand-accent text-white shadow-xs' : 'text-brand-dark/60 hover:text-brand-dark'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Success messages */}
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

          {/* Forms */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">Email Address</label>
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
              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">Password</label>
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
              {/* Forgot password link */}
              <div className="text-right text-xs">
                <Link href="/admin/forgot-password" className="text-brand-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Login</span>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-hidden focus:border-brand-accent text-brand-dark"
                    placeholder="e.g. Admin User"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">Email Address</label>
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
              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">Password (min 6 characters)</label>
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
              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-brand-dark/70 font-semibold block">Confirm Password</label>
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
