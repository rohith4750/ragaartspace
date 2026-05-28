'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Search, Mail, UserCheck, Shield, Plus, X, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface DBUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'internal' | 'customers'>('internal');
  
  // Create modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'STAFF'>('STAFF');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Edit / Delete states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setFormSuccess('Internal user created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setRole('STAFF');
      
      // Refresh list
      fetchUsers();
      
      // Auto close modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
      }, 1500);

    } catch (err: any) {
      setFormError(err.message || 'Error occurred while saving');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to update user role');
      } else {
        // Refresh local state
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error('Error changing role:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      return;
    }

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to delete user');
      } else {
        // Remove from local state
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const isInternal = ['ADMIN', 'MANAGER', 'STAFF'].includes(u.role);
    const matchesTab = activeTab === 'internal' ? isInternal : !isInternal;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#EAE3DB] pb-6">
        <div>
          <div className="inline-flex items-center space-x-1 bg-brand-accent/15 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-brand-dark mb-2">
            <Shield className="w-3.5 h-3.5 text-brand-accent" />
            <span>ADMINISTRATIVE PORTAL</span>
          </div>
          <h1 className="font-serif text-3xl text-brand-dark">Users & Roles</h1>
          <p className="text-xs text-brand-dark/65 max-w-lg mt-1">
            Manage your internal operations team and monitor registered store clients. Create managers, staff members, and configure console permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-full flex items-center gap-2 shadow-xs transition-all duration-300 transform hover:scale-102 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Internal User</span>
        </button>
      </div>

      {/* Control Bar (Tabs, Search) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tabs */}
        <div className="flex border border-[#EAE3DB] rounded-full p-1 bg-[#F4EFEB]/50 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 sm:flex-initial px-6 py-2 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'internal'
                ? 'bg-brand-accent text-white shadow-xs'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            Operations Team
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 sm:flex-initial px-6 py-2 text-xs font-semibold rounded-full uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-brand-accent text-white shadow-xs'
                : 'text-brand-dark/60 hover:text-brand-dark'
            }`}
          >
            Registered Clients
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-card border border-[#EAE3DB] rounded-full pl-10 pr-4 py-2.5 text-xs text-brand-dark placeholder-brand-dark/40 focus:outline-hidden focus:border-brand-accent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-brand-card border border-[#EAE3DB] rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
            <span className="text-xs text-brand-dark/50">Fetching user records...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <AlertCircle className="w-8 h-8 text-brand-dark/30 mx-auto" />
            <p className="text-sm font-medium text-brand-dark/70">No user accounts found</p>
            <p className="text-xs text-brand-dark/45">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light/60 border-b border-[#EAE3DB] text-brand-dark/70 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role / Permissions</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F4EF] text-xs text-brand-dark">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-light/35 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4 font-semibold">
                      {user.name || <span className="italic text-brand-dark/40">Not provided</span>}
                    </td>
                    
                    {/* Email */}
                    <td className="px-6 py-4 text-brand-dark/75">
                      {user.email}
                    </td>

                    {/* Role Tag & Inline Selector */}
                    <td className="px-6 py-4">
                      {activeTab === 'internal' ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={user.role}
                            disabled={actionLoading === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-brand-light border border-[#EAE3DB] text-[11px] font-semibold px-2 py-1 rounded-lg focus:outline-hidden focus:border-brand-accent cursor-pointer uppercase text-brand-dark"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="STAFF">Staff</option>
                            <option value="USER">User (Revoke)</option>
                          </select>
                        </div>
                      ) : (
                        <span className="bg-zinc-500/10 text-zinc-600 border border-zinc-200/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Customer
                        </span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="px-6 py-4 text-brand-dark/60">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionLoading === user.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all inline-flex items-center disabled:opacity-40 cursor-pointer"
                        title="Delete User"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-brand-card rounded-3xl border border-[#EAE3DB] shadow-lg max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-brand-light/80 border-b border-[#EAE3DB] p-6 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-accent" />
                <h3 className="font-serif text-lg text-brand-dark">Create Operations Member</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-dark/50 hover:text-brand-dark p-1 rounded-full hover:bg-brand-light transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 text-center font-medium">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl border border-green-100 text-center font-medium">
                  {formSuccess}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-brand-dark/60 font-bold block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohith Sharma"
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-xs text-brand-dark placeholder-brand-dark/45 focus:outline-hidden focus:border-brand-accent"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-brand-dark/60 font-bold block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. team@raagaartspace.com"
                    className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-dark placeholder-brand-dark/45 focus:outline-hidden focus:border-brand-accent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-brand-dark/60 font-bold block">
                  Initial Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-xs text-brand-dark placeholder-brand-dark/45 focus:outline-hidden focus:border-brand-accent"
                />
              </div>

              {/* Role Select */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-brand-dark/60 font-bold block">
                  Assign System Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-brand-light border border-[#EAE3DB] rounded-xl px-4 py-2.5 text-xs text-brand-dark cursor-pointer font-medium focus:outline-hidden focus:border-brand-accent uppercase"
                >
                  <option value="STAFF">Staff (Access shipments, overview, reels)</option>
                  <option value="MANAGER">Manager (Full catalog control & order status)</option>
                  <option value="ADMIN">Administrator (Unrestricted Console Access)</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
