"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
        
        {/* NEW BUYER REQUEST WIDGET */}
        <div className="lg:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-amber-900 dark:text-amber-100 flex items-center gap-2">
              🔥 New Buyer Requests
            </h2>
            <Link href="/dashboard/buyers" className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:underline">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Hardcoded for visual structure, real data comes from API in a real app */}
            <div className="bg-white dark:bg-[#0c0c14] border border-amber-100 dark:border-amber-800/50 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rahul Sharma</h3>
                  <p className="text-sm text-slate-500">Looking for 3BHK Apartment in Dwarka</p>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-xs font-bold inline-block">Score: 92/100</div>
                  <p className="text-xs text-slate-400 mt-1">High Probability</p>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 italic mb-4">
                <i className="fas fa-robot text-amber-500 mr-2"></i>
                "Rahul is a pre-approved salaried professional looking to move within 3 months. Budget is strong at ₹1.5 Cr. He prefers properties with a Gym and Parking."
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">Budget: ₹1.5 Cr</span>
                  <span className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500">Matches: 4 Properties</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                    <i className="fab fa-whatsapp text-sm"></i> WhatsApp
                  </button>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                    <i className="fas fa-phone-alt"></i> Call
                  </button>
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors">
                    Assign
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#0c0c14] border border-amber-100 dark:border-amber-800/50 rounded-xl p-5 shadow-sm opacity-70">
               <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sneha Kapoor</h3>
                  <p className="text-sm text-slate-500">Looking for Villa in Gurugram</p>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-xs font-bold inline-block">Score: 65/100</div>
                  <p className="text-xs text-slate-400 mt-1">Medium Probability</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                 <button className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg">View Details</button>
              </div>
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
