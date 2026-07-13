"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import LeadDetailModal from '@/components/leads/LeadDetailModal';

const COLUMNS = [
  { id: 'NEW', label: 'New Leads', color: 'bg-blue-500' },
  { id: 'CONTACTED', label: 'Contacted', color: 'bg-purple-500' },
  { id: 'SITE_VISIT', label: 'Site Visit', color: 'bg-emerald-500' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-amber-500' },
  { id: 'WON', label: 'Closed Won', color: 'bg-green-600' },
];

export default function LeadsKanban() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    const id = e.dataTransfer.getData('leadId');
    // Optimistic update
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
    
    try {
      await api.patch(`/leads/${id}/status`, { status });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchLeads(); // revert on fail
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addTestLead = async () => {
    try {
      await api.post('/leads', { 
        customerName: 'New AI Lead', 
        type: 'Test Property',
        budget: 5000000 
      });
      fetchLeads();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#09090b]/50 sticky top-0 z-10 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-slate-500">Manage your real estate deals with AI assistance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <i className="fas fa-filter mr-2"></i> Filter
          </button>
          <button onClick={addTestLead} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all">
            <i className="fas fa-plus mr-2"></i> Add Lead
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6 h-full items-start min-w-max">
          {COLUMNS.map(col => {
            const columnLeads = leads.filter(l => l.status === col.id);
            return (
              <div 
                key={col.id} 
                className="w-80 flex flex-col bg-slate-100/50 dark:bg-slate-800/20 rounded-xl max-h-full"
                onDrop={(e) => handleDrop(e, col.id)}
                onDragOver={handleDragOver}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">{col.label}</h3>
                  </div>
                  <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs font-medium text-slate-500 border border-slate-200 dark:border-slate-700">
                    {columnLeads.length}
                  </span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
                  {columnLeads.map(lead => (
                    <motion.div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      layoutId={`lead-${lead.id}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{lead.customer?.name || 'Unknown'}</h4>
                        <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded text-xs text-purple-600 font-bold border border-purple-100 dark:border-purple-800/30" title="AI Intent Score">
                          <i className="fas fa-robot"></i> {lead.score || 0}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{lead.customer?.preferredLocation || 'Property'} • ₹{lead.customer?.budget || 0}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400">
                          {lead.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}
