import React from 'react';

const STATS = [
  { label: "Today's New Leads", value: "14", change: "+3", trend: "up", icon: "fa-user-plus", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Site Visits Scheduled", value: "8", change: "Same as yesterday", trend: "neutral", icon: "fa-calendar-check", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { label: "Deals in Negotiation", value: "12", change: "+2", trend: "up", icon: "fa-handshake", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { label: "Revenue Pipeline", value: "₹4.2Cr", change: "-10%", trend: "down", icon: "fa-chart-line", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" }
];

export default function DashboardOverview() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Good morning, Rajiv</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your real estate pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <i className={`fas ${stat.icon} ${stat.color}`}></i>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : stat.trend === 'down' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-slate-600 bg-slate-100 dark:bg-slate-800'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
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
