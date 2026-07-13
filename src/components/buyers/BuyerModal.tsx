"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

const STATUSES = ['NEW', 'CONTACTED', 'INTERESTED', 'SITE_VISIT', 'NEGOTIATION', 'BOOKED', 'LOST'];
const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];
const SOURCES = ['REFERRAL', 'PORTAL', 'WALKIN', 'SOCIAL', 'WHATSAPP', 'COLD_CALL', 'OTHER'];

interface BuyerModalProps {
  buyer?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function BuyerModal({ buyer, onClose, onSaved }: BuyerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    budgetMin: '',
    budgetMax: '',
    preferredLocations: '',
    propertyTypes: '',
    bedrooms: '',
    bathrooms: '',
    areaMin: '',
    areaMax: '',
    loanRequired: false,
    occupation: '',
    company: '',
    annualIncome: '',
    source: 'OTHER',
    priority: 'MEDIUM',
    status: 'NEW',
    tags: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (buyer) {
      setFormData({
        name: buyer.name || '',
        email: buyer.email || '',
        phone: buyer.phone || '',
        whatsapp: buyer.whatsapp || '',
        budgetMin: buyer.budgetMin?.toString() || '',
        budgetMax: buyer.budgetMax?.toString() || '',
        preferredLocations: buyer.preferredLocations ? JSON.parse(buyer.preferredLocations).join(', ') : '',
        propertyTypes: buyer.propertyTypes ? JSON.parse(buyer.propertyTypes).join(', ') : '',
        bedrooms: buyer.bedrooms || '',
        bathrooms: buyer.bathrooms || '',
        areaMin: buyer.areaMin?.toString() || '',
        areaMax: buyer.areaMax?.toString() || '',
        loanRequired: buyer.loanRequired || false,
        occupation: buyer.occupation || '',
        company: buyer.company || '',
        annualIncome: buyer.annualIncome?.toString() || '',
        source: buyer.source || 'OTHER',
        priority: buyer.priority || 'MEDIUM',
        status: buyer.status || 'NEW',
        tags: buyer.tags ? JSON.parse(buyer.tags).join(', ') : '',
      });
    }
  }, [buyer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parseCommaList = (str: string) => str ? JSON.stringify(str.split(',').map(s => s.trim()).filter(Boolean)) : undefined;

    const payload = {
      ...formData,
      budgetMin: formData.budgetMin ? Number(formData.budgetMin) : undefined,
      budgetMax: formData.budgetMax ? Number(formData.budgetMax) : undefined,
      areaMin: formData.areaMin ? Number(formData.areaMin) : undefined,
      areaMax: formData.areaMax ? Number(formData.areaMax) : undefined,
      annualIncome: formData.annualIncome ? Number(formData.annualIncome) : undefined,
      preferredLocations: parseCommaList(formData.preferredLocations),
      propertyTypes: parseCommaList(formData.propertyTypes),
      tags: parseCommaList(formData.tags),
    };

    // Remove undefined values
    Object.keys(payload).forEach(key => (payload as any)[key] === undefined && delete (payload as any)[key]);


    try {
      if (buyer?.id) {
        await api.put(`/buyers/${buyer.id}`, payload);
      } else {
        await api.post('/buyers', payload);
      }
      onSaved();
    } catch (error) {
      console.error(error);
      alert('Failed to save buyer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-[#0c0c14] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {buyer ? 'Edit Buyer' : 'Add New Buyer'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="buyer-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-user text-blue-500"></i> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">WhatsApp</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91..." />
                </div>
              </div>
            </div>

            {/* Budget & Requirements */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-home text-purple-500"></i> Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="lg:col-span-2">
                   <label className="block text-xs font-medium text-slate-500 mb-1.5">Preferred Locations (comma separated)</label>
                   <input name="preferredLocations" value={formData.preferredLocations} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Dwarka, Noida Sec 150" />
                </div>
                <div className="lg:col-span-2">
                   <label className="block text-xs font-medium text-slate-500 mb-1.5">Property Types (comma separated)</label>
                   <input name="propertyTypes" value={formData.propertyTypes} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="APARTMENT, VILLA" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Budget Min (₹)</label>
                  <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="5000000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Budget Max (₹)</label>
                  <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="15000000" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1.5">Bedrooms (e.g. 2,3)</label>
                   <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2,3" />
                </div>
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1.5">Bathrooms (e.g. 2)</label>
                   <input name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2" />
                </div>
              </div>
               <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input type="checkbox" name="loanRequired" checked={formData.loanRequired} onChange={handleChange} className="rounded" />
                Loan Required
              </label>
            </div>

            {/* Status & Priority */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <i className="fas fa-tag text-emerald-500"></i> CRM Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Source</label>
                  <select name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {SOURCES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                   <label className="block text-xs font-medium text-slate-500 mb-1.5">Tags (comma separated)</label>
                   <input name="tags" value={formData.tags} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="urgent, first-time-buyer" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button type="submit" form="buyer-form" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
            Save Buyer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
