"use client";
import React from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Analytics Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your CRM performance and revenue forecasts.</p>
        </div>
        <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm outline-none">
          <option>Last 30 Days</option>
          <option>Last Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold">₹1.2Cr</h3>
          <p className="text-xs text-green-500 mt-2"><i className="fas fa-arrow-up"></i> 12% vs last month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-1">Leads Converted</p>
          <h3 className="text-3xl font-bold">24</h3>
          <p className="text-xs text-green-500 mt-2"><i className="fas fa-arrow-up"></i> 5% vs last month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-1">Avg Deal Size</p>
          <h3 className="text-3xl font-bold">₹50L</h3>
          <p className="text-xs text-slate-400 mt-2"><i className="fas fa-minus"></i> No change</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-1">AI Prediction (Next Month)</p>
          <h3 className="text-3xl font-bold text-purple-600">₹1.5Cr</h3>
          <p className="text-xs text-purple-500 mt-2"><i className="fas fa-robot"></i> High confidence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[300px] flex items-center justify-center">
          <p className="text-slate-400">Revenue Growth Chart</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[300px] flex items-center justify-center">
          <p className="text-slate-400">Lead Source Distribution</p>
        </div>
      </div>
    </div>
  );
}
