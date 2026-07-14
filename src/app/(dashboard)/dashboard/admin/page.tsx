"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MOCK_ADMIN_METRICS = [
  { label: 'Daily Enquiries', value: '124', icon: 'fa-inbox', trend: '+12%', color: 'text-blue-500' },
  { label: 'Conversion Rate', value: '4.8%', icon: 'fa-percentage', trend: '+1.2%', color: 'text-emerald-500' },
  { label: 'Hot Buyers', value: '45', icon: 'fa-fire', trend: '+5', color: 'text-orange-500' },
  { label: 'Revenue Forecast', value: '₹4.5 Cr', icon: 'fa-chart-line', trend: '+₹40L', color: 'text-purple-500' },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full flex flex-col justify-center items-center">
        <i className="fas fa-spinner fa-spin text-4xl text-amber-500 mb-4"></i>
        <p className="text-slate-500 font-medium">Loading Admin Insights...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Company Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">High-level insights across all brokers and properties.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_ADMIN_METRICS.map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} 
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.label}</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded mb-1">{stat.trend}</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><i className="fas fa-bullseye text-blue-500"></i> Top Lead Sources</h2>
          <div className="space-y-4">
             {['Website Wizard (52%)', 'Facebook Ads (28%)', 'Referral (15%)', 'Walk-in (5%)'].map((source, i) => (
               <div key={i} className="flex items-center gap-3">
                 <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full" style={{ width: source.match(/\d+/)?.[0] + '%' }}></div>
                 </div>
                 <span className="text-sm font-medium w-32">{source}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><i className="fas fa-map-marker-alt text-amber-500"></i> Top Micro-Markets</h2>
          <div className="space-y-4">
             {['Dwarka Expressway (35%)', 'Noida Extension (25%)', 'Gurugram Sec 56 (20%)', 'South Delhi (20%)'].map((loc, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                 <span className="text-sm font-medium">{loc.split('(')[0]}</span>
                 <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">{loc.match(/\(.*\)/)?.[0]}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
