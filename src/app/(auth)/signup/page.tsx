"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/signup', { email, password, name });
      setAuth(response.data.user, response.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mb-8" />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Create your account</h1>
          <p className="text-slate-500 text-sm">Start closing deals with AI — 10 leads free</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20 flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>{error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-amber-400/60 focus:bg-amber-400/5 focus:outline-none transition-all"
              placeholder="Rajiv Sharma"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-amber-400/60 focus:bg-amber-400/5 focus:outline-none transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-amber-400/60 focus:bg-amber-400/5 focus:outline-none transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-sm hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Creating account...</>
            ) : (
              <><i className="fas fa-bolt"></i> Get Started Free</>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-600">
          By signing up you agree to our{' '}
          <span className="text-slate-500 underline cursor-pointer">Terms of Service</span>
        </p>

        <div className="h-px w-full bg-white/5 my-6" />

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
