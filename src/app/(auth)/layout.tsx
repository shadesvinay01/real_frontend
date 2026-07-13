"use client";
import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#04040a] relative overflow-hidden">
      
      {/* Same ambient background as landing page */}
      <div className="absolute -top-[30%] left-[10%] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[30%] w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[130px] pointer-events-none" />
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Top nav */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,.4)]">
            <i className="fas fa-bolt text-white text-sm"></i>
          </div>
          <span className="text-lg font-black text-white tracking-tight">Jugnu<span className="text-amber-400">AI</span></span>
        </Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5">
          <i className="fas fa-arrow-left text-xs"></i> Back to home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md p-6 pt-24">
        {children}
      </div>
    </div>
  );
}
