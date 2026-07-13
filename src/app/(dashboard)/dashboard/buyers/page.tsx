"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import BuyerModal from '@/components/buyers/BuyerModal';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  CONTACTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  INTERESTED: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  SITE_VISIT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  NEGOTIATION: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  BOOKED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  LOST: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const PRIORITY_DOT: Record<string, string> = {
  HIGH: 'bg-red-500', MEDIUM: 'bg-amber-500', LOW: 'bg-slate-400',
};

const STATUSES = ['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'BOOKED', 'LOST'];
const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editBuyer, setEditBuyer] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBuyers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page), limit: '15', sortBy, sortOrder,
        ...(search && { search }),
        ...(status && { status }),
        ...(priority && { priority }),
      });
      const res = await api.get(`/buyers?${params}`);
      setBuyers(res.data.data);
      setMeta(res.data.meta);
    } catch { showToast('Failed to load buyers', 'error'); }
    finally { setLoading(false); }
  }, [page, search, status, priority, sortBy, sortOrder]);

  useEffect(() => { fetchBuyers(); }, [fetchBuyers]);

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const toggleAll = () =>
    setSelected(selected.length === buyers.length ? [] : buyers.map(b => b.id));

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    if (!confirm(`Delete ${selected.length} buyer(s)?`)) return;
    try {
      await api.post('/buyers/bulk/delete', { ids: selected });
      showToast(`${selected.length} buyers deleted`);
      setSelected([]);
      fetchBuyers();
    } catch { showToast('Bulk delete failed', 'error'); }
  };

  const handleBulkStatus = async (newStatus: string) => {
    if (!selected.length) return;
    try {
      await api.post('/buyers/bulk/status', { ids: selected, status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      setSelected([]);
      fetchBuyers();
    } catch { showToast('Bulk update failed', 'error'); }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/buyers/export/csv', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = 'buyers.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch { showToast('Export failed', 'error'); }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: string }) => (
    <i className={`fas fa-sort${sortBy === field ? (sortOrder === 'asc' ? '-up' : '-down') : ''} ml-1 text-[10px] opacity-60`}></i>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-medium text-sm text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-times-circle'} mr-2`}></i>{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#09090b]/50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Buyers</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{meta.total} total buyers</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExport} className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <i className="fas fa-download mr-1.5"></i>Export
            </button>
            <button onClick={() => { setEditBuyer(null); setShowModal(true); }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg shadow hover:shadow-lg transition-all">
              <i className="fas fa-plus mr-1.5"></i>Add Buyer
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search name, email, phone..." />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <select value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none">
            <option value="">All Priority</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mt-3 flex items-center gap-2 overflow-hidden">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{selected.length} selected:</span>
              <select onChange={e => handleBulkStatus(e.target.value)} defaultValue=""
                className="px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <option value="" disabled>Change Status</option>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
              <button onClick={handleBulkDelete} className="px-3 py-1.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 transition-colors">
                <i className="fas fa-trash mr-1"></i>Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 z-10">
            <tr>
              <th className="px-4 py-3"><input type="checkbox" checked={selected.length === buyers.length && buyers.length > 0} onChange={toggleAll} className="rounded" /></th>
              <th className="px-4 py-3 cursor-pointer font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap" onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Contact</th>
              <th className="px-4 py-3 cursor-pointer font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap" onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
              <th className="px-4 py-3 cursor-pointer font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap" onClick={() => handleSort('priority')}>Priority <SortIcon field="priority" /></th>
              <th className="px-4 py-3 cursor-pointer font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap" onClick={() => handleSort('budgetMax')}>Budget <SortIcon field="budgetMax" /></th>
              <th className="px-4 py-3 cursor-pointer font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap" onClick={() => handleSort('score')}>Score <SortIcon field="score" /></th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Broker</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(9).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div></td>
                  ))}
                </tr>
              ))
            ) : buyers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-2xl text-slate-400"></i>
                    </div>
                    <p className="text-slate-500 font-medium">No buyers found</p>
                    <p className="text-slate-400 text-xs">Try adjusting your filters or add a new buyer</p>
                    <button onClick={() => setShowModal(true)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                      <i className="fas fa-plus mr-1.5"></i>Add First Buyer
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              buyers.map(buyer => (
                <motion.tr key={buyer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(buyer.id)} onChange={() => toggleSelect(buyer.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {buyer.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/dashboard/buyers/${buyer.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                          {buyer.name}
                        </Link>
                        <p className="text-[11px] text-slate-400">{buyer.source || 'No source'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-slate-500 space-y-0.5">
                      {buyer.phone && <div><i className="fas fa-phone mr-1 text-[9px]"></i>{buyer.phone}</div>}
                      {buyer.email && <div><i className="fas fa-envelope mr-1 text-[9px]"></i>{buyer.email}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${STATUS_COLORS[buyer.status] || 'bg-slate-100 text-slate-600'}`}>
                      {buyer.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[buyer.priority] || 'bg-slate-400'}`}></div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{buyer.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                    {buyer.budgetMin || buyer.budgetMax ? (
                      <span>
                        {buyer.budgetMin ? `₹${(buyer.budgetMin / 100000).toFixed(0)}L` : ''}
                        {buyer.budgetMin && buyer.budgetMax ? ' – ' : ''}
                        {buyer.budgetMax ? `₹${(buyer.budgetMax / 100000).toFixed(0)}L` : ''}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${buyer.score >= 80 ? 'bg-emerald-500' : buyer.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${buyer.score}%` }}></div>
                      </div>
                      <span className={`text-xs font-bold ${buyer.score >= 80 ? 'text-emerald-600' : buyer.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {buyer.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {buyer.assignedBroker?.name || <span className="text-slate-300 dark:text-slate-700">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/buyers/${buyer.id}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 hover:bg-blue-200 transition-colors">
                        <i className="fas fa-eye text-xs"></i>
                      </Link>
                      <button onClick={() => { setEditBuyer(buyer); setShowModal(true); }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] flex items-center justify-between text-sm">
          <span className="text-slate-500">Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, meta.total)} of {meta.total}</span>
          <div className="flex gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <BuyerModal
            buyer={editBuyer}
            onClose={() => { setShowModal(false); setEditBuyer(null); }}
            onSaved={() => { fetchBuyers(); showToast(editBuyer ? 'Buyer updated!' : 'Buyer added!'); setShowModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
