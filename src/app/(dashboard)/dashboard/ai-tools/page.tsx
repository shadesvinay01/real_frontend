"use client";
import React from 'react';

export default function AIToolsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
          <i className="fas fa-robot text-purple-500"></i> AI Assistant
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Your AI co-pilot for automating sales, emails, and proposals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <i className="fas fa-magic text-9xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2 relative z-10">AI Proposal Generator</h2>
          <p className="text-purple-100 mb-6 relative z-10 max-w-md">Generate branded, professional real estate proposals instantly based on customer requirements.</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium text-sm relative z-10 hover:bg-slate-50 transition-colors">
            Generate Proposal
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <i className="fas fa-envelope-open-text text-9xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2 relative z-10">AI Email & WhatsApp Writer</h2>
          <p className="text-blue-100 mb-6 relative z-10 max-w-md">Draft perfect follow-ups, meeting reminders, and property suggestions in one click.</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm relative z-10 hover:bg-slate-50 transition-colors">
            Draft Message
          </button>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
              <i className="fas fa-brain text-lg"></i>
            </div>
            <h3 className="font-bold text-lg">Sales Coach</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Get AI-driven insights on your active deals, next best actions, and probability scores.</p>
          <button className="text-emerald-500 font-medium text-sm hover:underline">View Insights</button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center">
              <i className="fas fa-file-contract text-lg"></i>
            </div>
            <h3 className="font-bold text-lg">Document Analyzer</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Upload property agreements or PAN cards to automatically extract key information.</p>
          <button className="text-rose-500 font-medium text-sm hover:underline">Upload Document</button>
        </div>
      </div>
    </div>
  );
}
