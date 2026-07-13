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

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">AI Tools</h1>
          <p className="text-slate-500 dark:text-slate-400">Leverage Jugnu AI to automate and scale your sales.</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button 
          onClick={() => setActiveTab('insights')}
          className={`pb-4 font-medium text-sm transition-colors relative ${activeTab === 'insights' ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          Pipeline Insights
          {activeTab === 'insights' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('coach')}
          className={`pb-4 font-medium text-sm transition-colors relative ${activeTab === 'coach' ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
          AI Pitch Coach
          {activeTab === 'coach' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500"></div>}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm min-h-[400px]">
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Data-Driven Insights</h3>
            {loading ? (
              <div className="text-slate-400">Loading AI Insights...</div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex gap-4 items-start ${
                    insight.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/10 dark:border-amber-800/30 dark:text-amber-300' :
                    insight.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-800/30 dark:text-red-300' :
                    insight.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-800/30 dark:text-emerald-300' :
                    'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/10 dark:border-blue-800/30 dark:text-blue-300'
                  }`}>
                    <i className={`fas mt-1 ${
                      insight.type === 'warning' ? 'fa-exclamation-triangle' :
                      insight.type === 'danger' ? 'fa-fire' :
                      insight.type === 'success' ? 'fa-check-circle' :
                      'fa-info-circle'
                    }`}></i>
                    <div>
                      <p className="font-medium text-sm leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500">No insights available right now. Let the CRM gather more data.</div>
            )}
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="flex flex-col items-center justify-center text-center h-64">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <i className="fas fa-microphone-alt text-2xl text-slate-400"></i>
            </div>
            <h3 className="font-bold text-lg mb-2">Practice Your Pitch</h3>
            <p className="text-slate-500 max-w-md mx-auto">Jugnu AI will listen to your sales pitch and give you real-time feedback on confidence, objections handling, and clarity.</p>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Start Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
