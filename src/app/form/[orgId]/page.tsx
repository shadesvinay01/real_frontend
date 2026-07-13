"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function IntakeFormPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    location: '',
    budget: '',
    downPayment: '',
    timeline: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/leads/public/${orgId}`, formData);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit form', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#04040a] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">You're Pre-Qualified!</h1>
          <p className="text-slate-400 text-sm">Your broker has received your verified profile and will connect with you on WhatsApp shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04040a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="w-full max-w-md relative z-10"
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <i className="fas fa-bolt text-white text-xs"></i>
          </div>
          <span className="text-xl font-black text-white tracking-tight">Jugnu<span className="text-amber-400">AI</span></span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-amber-400' : 'bg-white/10'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-4">Let's get started.</h2>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Your Name</label>
                    <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none" placeholder="Rajiv Sharma" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">WhatsApp Number</label>
                    <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none" placeholder="+91 9876543210" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-4">What are you looking for?</h2>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Preferred Location</label>
                    <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none" placeholder="e.g. Dwarka Sector 11" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Budget (₹)</label>
                    <input required type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none" placeholder="e.g. 15000000" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-4">Financial Readiness</h2>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Down Payment Status</label>
                    <select required name="downPayment" value={formData.downPayment} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none appearance-none">
                      <option value="" disabled>Select option...</option>
                      <option value="ready">Ready (20%+ available)</option>
                      <option value="arranging">Arranging funds</option>
                      <option value="need_loan">Need 100% funding</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Buying Timeline</label>
                    <select required name="timeline" value={formData.timeline} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none appearance-none">
                      <option value="" disabled>Select option...</option>
                      <option value="immediate">Immediate (0-30 days)</option>
                      <option value="3_months">Within 3 months</option>
                      <option value="researching">Just researching</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3.5 rounded-xl bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-sm hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all flex items-center justify-center gap-2">
                {loading ? <i className="fas fa-spinner fa-spin"></i> : step === 3 ? 'Verify & Submit' : 'Continue'}
                {step < 3 && <i className="fas fa-arrow-right text-[10px]"></i>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
