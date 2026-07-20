"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PropertyFinderWizard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // State for all 6 steps
  const [form, setForm] = useState({
    // Step 1: Personal
    name: '', phone: '', whatsapp: '', email: '',
    // Step 2: Property
    purpose: 'Buying', type: 'Apartment', budgetRange: '', location: '', area: '', timeline: '',
    // Step 3: Financial
    loanRequired: 'No', occupation: '', company: '', income: '', cibil: '',
    // Step 4: Preferences
    preferences: [] as string[], notes: '',
    // Step 5: Contact
    contactTime: 'Morning',
    // Step 6: Source
    source: 'Website',
  });

  if (!isOpen) return null;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/lead-engine/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success) {
        // Store matches in sessionStorage for Thank You page to read
        sessionStorage.setItem('ai_matches', JSON.stringify(data.matches || []));
        sessionStorage.setItem('ai_summary', data.aiSummary || '');
        onClose();
        router.push('/thank-you');
      } else {
        alert('Failed to process your request.');
      }
    } catch (e) {
      alert('An error occurred. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const PREFERENCES = ['Parking', 'Balcony', 'Lift', 'Gym', 'Swimming Pool', 'Clubhouse', 'Corner Property', 'Furnished', 'Semi Furnished', 'Unfurnished'];

  const togglePref = (p: string) => {
    setForm(prev => ({
      ...prev,
      preferences: prev.preferences.includes(p) ? prev.preferences.filter(x => x !== p) : [...prev.preferences, p]
    }));
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0c0c14] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-2xl font-black text-white">AI Property Finder</h2>
            <p className="text-sm text-amber-400 font-bold mt-1">Step {step} of 6</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/5">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300" style={{ width: `${(step / 6) * 100}%` }} />
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 text-slate-300 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">WhatsApp</label>
                    <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="Same as phone" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="john@example.com" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Property Requirements</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['Buying', 'Renting', 'Investment'].map(p => (
                    <button key={p} onClick={() => setForm({...form, purpose: p})} className={`py-3 rounded-xl border font-bold text-sm ${form.purpose === p ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{p}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Property Type</label>
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white">
                      <option className="bg-[#0c0c14]">Apartment</option><option className="bg-[#0c0c14]">Villa</option><option className="bg-[#0c0c14]">Plot</option><option className="bg-[#0c0c14]">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Budget Range</label>
                    <input value={form.budgetRange} onChange={e => setForm({...form, budgetRange: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="e.g. 50L - 1Cr" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Location</label>
                    <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="Dwarka, Delhi" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Timeline</label>
                    <select value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white">
                      <option className="bg-[#0c0c14]">Immediate</option><option className="bg-[#0c0c14]">1-3 Months</option><option className="bg-[#0c0c14]">3-6 Months</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Financial Profile (Helps AI match faster)</h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-bold">Loan Required?</span>
                  {['Yes', 'No'].map(o => (
                     <button key={o} onClick={() => setForm({...form, loanRequired: o})} className={`px-6 py-2 rounded-xl border font-bold text-sm ${form.loanRequired === o ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10'}`}>{o}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Occupation</label>
                    <input value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="Salaried / Business" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Monthly Income</label>
                    <input value={form.income} onChange={e => setForm({...form, income: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="e.g. 1L - 2L" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 mt-4">Estimated CIBIL Score (Optional)</label>
                  <select value={form.cibil} onChange={e => setForm({...form, cibil: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white">
                    <option className="bg-[#0c0c14]">Not Sure</option>
                    <option className="bg-[#0c0c14]">750+</option>
                    <option className="bg-[#0c0c14]">700-749</option>
                    <option className="bg-[#0c0c14]">650-699</option>
                    <option className="bg-[#0c0c14]">Below 650</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCES.map(p => (
                    <button key={p} onClick={() => togglePref(p)} className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${form.preferences.includes(p) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Additional Notes</label>
                  <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none text-white" placeholder="Any specific requirements..."></textarea>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Preferred Contact Time</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Morning', 'Afternoon', 'Evening', 'Weekend'].map(t => (
                     <button key={t} onClick={() => setForm({...form, contactTime: t})} className={`py-4 rounded-xl border font-bold text-sm ${form.contactTime === t ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                       <i className={`fas ${t === 'Morning' ? 'fa-sun' : t === 'Afternoon' ? 'fa-cloud-sun' : t === 'Evening' ? 'fa-moon' : 'fa-calendar-day'} mr-2`}></i> {t}
                     </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Review & Submit</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm space-y-2">
                  <p><span className="text-slate-500">Name:</span> {form.name || '-'}</p>
                  <p><span className="text-slate-500">Looking for:</span> {form.purpose} {form.type} in {form.location || '-'}</p>
                  <p><span className="text-slate-500">Budget:</span> {form.budgetRange || '-'}</p>
                  <p><span className="text-slate-500">CIBIL:</span> {form.cibil || '-'}</p>
                  <p><span className="text-slate-500">Preferences:</span> {form.preferences.join(', ') || 'None'}</p>
                </div>
                <p className="text-xs text-amber-400 text-center font-semibold"><i className="fas fa-magic mr-1"></i> Our AI will instantly match properties for you!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between">
           {step > 1 ? (
             <button onClick={prevStep} className="px-6 py-3 rounded-xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">Back</button>
           ) : <div />}
           
           {step < 6 ? (
             <button onClick={nextStep} className="px-8 py-3 rounded-xl font-black text-black bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-[0_0_30px_rgba(251,191,36,.4)] transition-all">
               Next Step <i className="fas fa-arrow-right ml-1"></i>
             </button>
           ) : (
             <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:shadow-[0_0_30px_rgba(124,58,237,.5)] transition-all flex items-center gap-2">
               {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
               Submit & Find Matches
             </button>
           )}
        </div>
      </motion.div>
    </div>
  );
}
