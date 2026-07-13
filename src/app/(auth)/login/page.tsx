"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth(response.data.user, response.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Card */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_80px_rgba(79,70,229,0.15)]">
        
        {/* Top accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to your Jugnu AI dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>{error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-violet-500/60 focus:bg-violet-500/5 focus:outline-none transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              <span className="text-xs text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">Forgot password?</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-violet-500/60 focus:bg-violet-500/5 focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-sm hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
            ) : (
              <><i className="fas fa-bolt"></i> Sign In</>
            )}
          </button>
        </form>

        <div className="h-px w-full bg-white/5 my-6" />

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
