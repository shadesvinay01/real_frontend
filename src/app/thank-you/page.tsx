"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Mock matching properties (Phase 3 will connect to backend)
const MATCHED_PROPERTIES = [
  { id: 1, title: 'Luxury 3BHK in Sector 150', price: '₹ 1.2 Cr', loc: 'Noida Sec 150', match: 95, reason: 'Matches your budget and preferred location perfectly.' },
  { id: 2, title: 'Golf View Villa', price: '₹ 2.5 Cr', loc: 'Jaypee Greens', match: 88, reason: 'Slightly above budget, but fits your lifestyle preferences.' },
  { id: 3, title: 'Premium Apartment', price: '₹ 85 L', loc: 'Noida Extension', match: 82, reason: 'Great value, fits your timeline and budget.' }
];

export default function ThankYouPage() {
  const [loading, setLoading] = useState(true);

  // Simulate AI calculating matches
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#04040a] text-slate-200 font-sans selection:bg-violet-500/30 flex flex-col items-center pt-24 pb-12 px-6">
      
      {/* ══ AMBIENT BACKGROUND ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Success Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(52,211,153,.4)]">
             <i className="fas fa-check text-white text-4xl" />
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Property Request Received!</h1>
           <p className="text-xl text-slate-400">Our AI has analyzed your requirements. A broker will contact you shortly.</p>
        </motion.div>

        {/* AI Matches */}
        <div className="bg-[#0c0c14] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,.4)]">
              <i className="fas fa-bolt text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">AI Property Matches</h2>
              <p className="text-sm text-slate-400">We scanned 1,200+ properties to find these for you.</p>
            </div>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-16 space-y-4">
               <i className="fas fa-spinner fa-spin text-4xl text-amber-500"></i>
               <p className="text-slate-400 animate-pulse font-medium">Jugnu AI is matching your criteria...</p>
             </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {MATCHED_PROPERTIES.map((prop, i) => (
                <motion.div key={prop.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-white/10 transition-all">
                  
                  {/* Match Score Badge */}
                  <div className="w-24 h-24 shrink-0 rounded-full border-4 border-emerald-500/20 flex flex-col items-center justify-center relative bg-[#04040a]">
                     <span className="text-2xl font-black text-emerald-400">{prop.match}%</span>
                     <span className="text-[10px] font-bold text-slate-500 uppercase">Match</span>
                     {/* SVG Circle Progress could go here */}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{prop.title}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400 mb-3">
                       <span className="flex items-center gap-1.5"><i className="fas fa-map-marker-alt text-amber-500"></i> {prop.loc}</span>
                       <span className="flex items-center gap-1.5"><i className="fas fa-tag text-emerald-500"></i> {prop.price}</span>
                    </div>
                    <p className="text-sm text-slate-500 italic"><i className="fas fa-magic text-violet-400 mr-2"></i>{prop.reason}</p>
                  </div>

                  <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors whitespace-nowrap">
                    View Details
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors font-medium">
            <i className="fas fa-arrow-left mr-2"></i> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
