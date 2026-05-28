'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Mail, Shield, Lock, Loader2, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();

  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update password');
      } else {
        setSuccessMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  const initials = (profile?.name || session?.user?.name || 'A')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-brand-dark tracking-wide">Profile</h1>
        <p className="text-sm text-brand-dark/50 mt-1">View your account details and change your password</p>
      </div>

      {/* Profile Card */}
      <div className="bg-brand-card rounded-2xl border border-[#EAE3DB] shadow-[0_4px_20px_rgba(62,62,62,0.03)] overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-brand-dark via-brand-dark/90 to-brand-accent/60 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-brand-accent/10 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-brand-accent">
              {initials}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-14 pb-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center border border-[#EAE3DB]">
                <User className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <span className="block text-[10px] text-brand-dark/40 uppercase tracking-widest font-semibold">Name</span>
                <span className="block text-sm font-semibold text-brand-dark">{profile?.name || session?.user?.name || '—'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center border border-[#EAE3DB]">
                <Mail className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <span className="block text-[10px] text-brand-dark/40 uppercase tracking-widest font-semibold">Email</span>
                <span className="block text-sm font-semibold text-brand-dark">{profile?.email || session?.user?.email || '—'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center border border-[#EAE3DB]">
                <Shield className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <span className="block text-[10px] text-brand-dark/40 uppercase tracking-widest font-semibold">Role</span>
                <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-full border border-brand-accent/20">
                  {profile?.role || (session?.user as any)?.role || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center border border-[#EAE3DB]">
                <Calendar className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <span className="block text-[10px] text-brand-dark/40 uppercase tracking-widest font-semibold">Member Since</span>
                <span className="block text-sm font-semibold text-brand-dark">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-brand-card rounded-2xl border border-[#EAE3DB] shadow-[0_4px_20px_rgba(62,62,62,0.03)] p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center border border-[#EAE3DB]">
            <Lock className="w-4 h-4 text-brand-accent" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-brand-dark">Change Password</h2>
            <p className="text-[11px] text-brand-dark/40">Update your account password</p>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-100 mb-4">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center space-x-2 bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-brand-dark/50 font-semibold block">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent text-brand-dark"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-brand-dark/50 font-semibold block">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent text-brand-dark"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-brand-dark/50 font-semibold block">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-accent text-brand-dark"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3 px-8 rounded-full transition-all duration-300 shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
