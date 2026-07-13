"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function BuyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const buyerId = params.id as string;

  const [buyer, setBuyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBuyer = useCallback(async () => {
    try {
      const res = await api.get(`/buyers/${buyerId}`);
      setBuyer(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load buyer');
      router.push('/dashboard/buyers');
    } finally {
      setLoading(false);
    }
  }, [buyerId, router]);

  useEffect(() => {
    fetchBuyer();
  }, [fetchBuyer]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  if (!buyer) {
    return null; // Redirected
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/buyers" className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{buyer.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Added {new Date(buyer.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-semibold">{buyer.status}</span>
           <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-sm font-semibold">Priority: {buyer.priority}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="fas fa-id-card text-blue-500"></i> Contact Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><i className="fas fa-envelope text-slate-400 w-4 text-center"></i>{buyer.email || 'N/A'}</div>
              <div className="flex items-center gap-3"><i className="fas fa-phone text-slate-400 w-4 text-center"></i>{buyer.phone || 'N/A'}</div>
              <div className="flex items-center gap-3"><i className="fab fa-whatsapp text-emerald-500 w-4 text-center"></i>{buyer.whatsapp || 'N/A'}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="fas fa-home text-purple-500"></i> Requirements</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Budget</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                   {buyer.budgetMin ? `₹${(buyer.budgetMin / 100000).toFixed(0)}L` : '—'} 
                   {buyer.budgetMin && buyer.budgetMax && ' - '}
                   {buyer.budgetMax ? `₹${(buyer.budgetMax / 100000).toFixed(0)}L` : '—'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Locations</span>
                <span className="font-semibold text-slate-900 dark:text-white">{buyer.preferredLocations ? JSON.parse(buyer.preferredLocations).join(', ') : 'Any'}</span>
              </div>
               <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Types</span>
                <span className="font-semibold text-slate-900 dark:text-white">{buyer.propertyTypes ? JSON.parse(buyer.propertyTypes).join(', ') : 'Any'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Loan Req.</span>
                <span className="font-semibold text-slate-900 dark:text-white">{buyer.loanRequired ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights & History */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center shrink-0">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">AI Lead Score: {buyer.score}/100</h2>
                <p className="text-amber-700 dark:text-amber-300 text-sm">{buyer.scoreReason || 'Calculated based on provided criteria.'}</p>
              </div>
            </div>
          </div>

          {/* Activity / Notes - we will expand this later, keeping it simple for now */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
             <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
               <h2 className="text-lg font-bold">Activity & History</h2>
               <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Add Note</button>
             </div>
             <div className="p-6 flex-1 flex flex-col items-center justify-center text-slate-400">
                <i className="fas fa-history text-4xl mb-3 opacity-20"></i>
                <p>Activity timeline will appear here.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
