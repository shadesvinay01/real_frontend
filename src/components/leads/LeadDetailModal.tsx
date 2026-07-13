import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface LeadDetailModalProps {
  lead: any;
  onClose: () => void;
}

export default function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [lead.id]);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const res = await api.get(`/notes/${lead.id}`);
      setNotes(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await api.post(`/notes/${lead.id}`, { content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      {/* Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white dark:bg-[#0c0c14] h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                lead.priority === 'HIGH' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                lead.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {lead.priority || 'NORMAL'}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                {lead.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lead.customer?.name || 'Unknown Lead'}</h2>
            <p className="text-sm text-slate-500">{lead.customer?.email} • {lead.customer?.phone}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Budget</p>
            <p className="font-semibold text-slate-900 dark:text-white">₹{(lead.customer?.budget / 100000 || 0).toFixed(1)}L</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AI Score</p>
            <div className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400">
              <i className="fas fa-robot text-sm"></i> {lead.score || 0}/100
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <i className="fas fa-sticky-note text-amber-500"></i> Notes & Activity
          </h3>
          
          <div className="space-y-4 mb-6 flex-1">
            {loadingNotes ? (
              <div className="text-center py-8 text-slate-400 text-sm"><i className="fas fa-spinner fa-spin mr-2"></i> Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">No notes yet. Add one below.</div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddNote} className="mt-auto">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Add a note</label>
            <div className="relative">
              <textarea 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Met client at site, discussed pricing..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
              />
              <button 
                type="submit"
                disabled={submittingNote || !newNote.trim()}
                className="absolute bottom-3 right-3 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {submittingNote ? <i className="fas fa-spinner fa-spin text-xs"></i> : <i className="fas fa-paper-plane text-xs"></i>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
