"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const MOCK_STATS = [
    { label: 'Total Revenue', value: stats ? `₹${(stats.totalRevenue / 10000000).toFixed(1)}Cr` : '...', icon: 'fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Active Leads', value: stats ? stats.totalLeads : '...', icon: 'fa-users', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { label: 'Properties Sold', value: stats ? stats.wonLeads : '...', icon: 'fa-building', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Pending Tasks', value: stats ? stats.activeTasks : '...', icon: 'fa-check-square', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your deals today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Lead Conversion Funnel</h2>
            <select className="text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            <div className="text-center">
              <i className="fas fa-chart-bar text-4xl mb-3 opacity-20"></i>
              <p>Chart Component Ready (Phase 4)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">AI Recommended Actions</h2>
            <i className="fas fa-robot text-purple-500"></i>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <div className="flex gap-3">
                <i className="fas fa-phone-alt text-blue-500 mt-1"></i>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Call Vikram Mehta</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">High intent score (94%). Site visit pending for 3BHK in Dwarka Sec 12.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex gap-3">
                <i className="fas fa-paper-plane text-emerald-500 mt-1"></i>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">Send Proposal to Neha</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">She requested details for Godrej South Estate. AI generated draft ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
