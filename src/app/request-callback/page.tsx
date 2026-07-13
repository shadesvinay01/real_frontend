"use client";
import React, { useState } from 'react';

export default function RequestCallbackPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="min-h-screen bg-[#04040a] flex items-center justify-center p-4">
       <div className="max-w-md w-full bg-[#0c0c14] border border-white/10 rounded-3xl p-8 shadow-2xl">
         <h1 className="text-2xl font-black text-white mb-2">Request a Callback</h1>
         <p className="text-slate-400 mb-6 text-sm">Drop your number and our expert broker will call you within 15 minutes.</p>
         
         {!submitted ? (
           <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
             <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Your Name</label>
               <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" placeholder="John Doe" />
             </div>
             <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Phone Number</label>
               <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none" placeholder="+91 98765 43210" />
             </div>
             <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black hover:shadow-[0_0_20px_rgba(251,191,36,.4)] transition-all">
               Call Me Back
             </button>
           </form>
         ) : (
           <div className="text-center py-8">
             <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl"><i className="fas fa-check"></i></div>
             <h3 className="text-xl font-bold text-white mb-2">Request Received!</h3>
             <p className="text-slate-400">Our expert is reviewing your details and will call you shortly.</p>
           </div>
         )}
       </div>
    </div>
  );
}
