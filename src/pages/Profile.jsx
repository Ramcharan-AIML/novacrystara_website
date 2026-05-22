import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  UserCircle,
  Save,
  CheckCircle,
  Mail,
  User,
  FileText
} from 'lucide-react';

export default function Profile() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 1. Fetch User Profile
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user');
      if (!res.ok) {
        setLocation('/'); // Redirect if unauthorized
        throw new Error('Not authenticated');
      }
      return res.json();
    }
  });

  // Sync state once data loads
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Mutation to save profile
  const saveProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/user'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000); // Clear check mark after 3s
    }
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    saveProfileMutation.mutate({ firstName, lastName, bio });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-left animate-pulse">
        <div className="h-6 w-24 bg-slate-900 rounded mb-6"></div>
        <div className="h-44 bg-slate-900 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Back to dashboard */}
      <Link href="/dashboard">
        <button className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyber-cyan transition-colors mb-6 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          BACK TO WORKSPACE DASHBOARD
        </button>
      </Link>

      <div className="p-6 sm:p-8 rounded-2xl cyber-glass relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyber-cyan/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center gap-4 mb-8 border-b border-slate-900/60 pb-6">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-cyber-cyan">
            <UserCircle className="h-10 w-10" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-extrabold text-white">
              Edit Cohort Profile
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Unique ID: {user?.id}
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyber-cyan" />
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sarah"
                className="w-full px-4 py-2.5 text-sm text-slate-200 bg-slate-900/60 border border-slate-800 rounded focus:border-cyber-cyan focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyber-cyan" />
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Chen"
                className="w-full px-4 py-2.5 text-sm text-slate-200 bg-slate-900/60 border border-slate-800 rounded focus:border-cyber-cyan focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-cyber-cyan" />
              Registered Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-2.5 text-sm text-slate-500 bg-slate-950 border border-slate-900 rounded cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500 mt-1">Contact administrators to update credentials routing.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-cyber-cyan" />
              Bio / Technical Focus
            </label>
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Building autonomous agent environments..."
              className="w-full px-4 py-2.5 text-sm text-slate-200 bg-slate-900/60 border border-slate-800 rounded focus:border-cyber-cyan focus:outline-none transition-colors"
            ></textarea>
          </div>

          <div className="border-t border-slate-900/60 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSaved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase font-cyber tracking-widest animate-fadeIn">
                  <CheckCircle className="h-4 w-4" /> Telemetry updated
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saveProfileMutation.isPending}
              className="w-full sm:w-auto px-6 py-2.5 rounded text-xs font-bold font-cyber text-slate-900 bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saveProfileMutation.isPending ? "SAVING TELEMETRY..." : "SAVE PROFILE TELEMETRY"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
