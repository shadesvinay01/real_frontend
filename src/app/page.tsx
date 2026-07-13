"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PropertyFinderWizard from '@/components/website/PropertyFinderWizard';

const FEATURES = [
  {
    icon: 'fa-shield-alt', color: 'from-blue-500 to-cyan-400', bg: 'from-blue-500/10 to-cyan-500/5',
    title: 'CIBIL Verified Buyers Only',
    desc: 'Every lead is auto-screened via financial APIs. You never speak to an unqualified buyer again. No more wasted site visits.'
  },
  {
    icon: 'fa-brain', color: 'from-violet-500 to-purple-400', bg: 'from-violet-500/10 to-purple-500/5',
    title: 'AI Intent Scoring Engine',
    desc: 'Our ML model assigns a 0–100 intent score based on search behavior, engagement, and financial readiness. Only 80+ reach you.'
  },
  {
    icon: 'fab fa-whatsapp', color: 'from-green-500 to-emerald-400', bg: 'from-green-500/10 to-emerald-500/5',
    title: 'WhatsApp AI Agent',
    desc: 'Jugnu AI chats with your leads 24/7 on WhatsApp, qualifies them, shares listings, and schedules site visits — automatically.'
  },
  {
    icon: 'fa-columns', color: 'from-orange-500 to-amber-400', bg: 'from-orange-500/10 to-amber-500/5',
    title: 'Visual Kanban Pipeline',
    desc: 'See every lead\'s journey — from inquiry to closing — in one drag-and-drop board with matched property photos and scores.'
  },
  {
    icon: 'fa-chart-area', color: 'from-rose-500 to-pink-400', bg: 'from-rose-500/10 to-pink-500/5',
    title: 'Real-time Analytics',
    desc: 'Track conversion rates, deal values, top micro-markets, and broker performance in a beautiful live dashboard.'
  },
  {
    icon: 'fa-link', color: 'from-indigo-500 to-blue-400', bg: 'from-indigo-500/10 to-blue-500/5',
    title: 'Custom Intake Form Link',
    desc: 'Share your Jugnu AI link anywhere — Facebook ads, 99acres, magicbricks. Every click gets pre-qualified before landing in your CRM.'
  },
];

const STEPS = [
  { num: '01', icon: 'fa-share-alt', title: 'Share Your AI Link', desc: 'Share your custom Jugnu AI intake link on social media, property portals, or WhatsApp groups.' },
  { num: '02', icon: 'fa-robot', title: 'AI Qualifies in Real-Time', desc: 'Jugnu AI instantly verifies CIBIL, budget, down payment, and purchase intent — no manual calls.' },
  { num: '03', icon: 'fa-star', title: 'You Get Scored Leads', desc: 'Only buyers with 80%+ match score land in your dashboard — with full financial context attached.' },
  { num: '04', icon: 'fa-handshake', title: 'Close the Deal', desc: 'WhatsApp AI schedules site visits, follows up, and keeps the buyer warm until you meet.' },
];

const TESTIMONIALS = [
  {
    quote: '"Pehle 100 leads me se sirf 5-6 kaam ke hote the. Ab Jugnu AI ke baad 10 me se 8 genuine buyers hain. Conversion rate 4x ho gayi."',
    name: 'Rajiv Khanna', loc: 'Dwarka, New Delhi', initials: 'RK', color: 'from-blue-500 to-indigo-500'
  },
  {
    quote: '"Sabse badi baat — ab main calls waste nahi karta. Jugnu AI ne already unhe qualify kar diya hota hai. My time is money."',
    name: 'Suresh Aggarwal', loc: 'Punjabi Bagh, Delhi', initials: 'SA', color: 'from-violet-500 to-purple-500'
  },
  {
    quote: '"Free 10 leads mein 2 deals close ho gayi. ₹36 lakh commission sirf pehle mahine mein. ROI is insane."',
    name: 'Anil Sharma', loc: 'Rajouri Garden, Delhi', initials: 'AS', color: 'from-emerald-500 to-teal-500'
  },
];

const FAQS = [
  { q: 'How does Jugnu AI verify financial data?', a: 'We use secure, read-only integrations to check CIBIL score ranges and cross-validate down payment intent, loan eligibility, and monthly income declared by the buyer.' },
  { q: 'Can I use Jugnu AI outside West Delhi?', a: 'Our current micro-market intelligence is optimized for West Delhi and Dwarka corridor. We are actively expanding to Noida, Gurugram, and Mumbai in Q3 2026.' },
  { q: 'What happens after I submit the Get Access form?', a: 'Our team will call you within 24 hours, set up your custom intake link, and credit your first 10 leads absolutely free.' },
  { q: 'Is there a long-term contract?', a: 'No. You can start with Pay Per Lead (₹3,000/buyer) with zero commitment. Upgrade to Retainer anytime.' },
  { q: 'Does Jugnu AI work with my existing WhatsApp?', a: 'Yes. We link your existing WhatsApp Business number and the AI handles conversations seamlessly under your identity.' },
];

export default function JugnuAI() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [accessModal, setAccessModal] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', city: '', leads: '', plan: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#04040a] text-slate-200 font-sans overflow-x-hidden selection:bg-violet-500/30">

      {/* ══ AMBIENT BACKGROUND ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[30%] left-[10%] w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[30%] w-[600px] h-[600px] bg-indigo-600/6 rounded-full blur-[130px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ══ GET ACCESS MODAL ══ */}
      <AnimatePresence>
        {accessModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setAccessModal(false); setSubmitted(false); }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="relative z-10 w-full max-w-lg bg-[#0c0c14] rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.2)]">

              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500" />

              {!submitted ? (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,.4)]">
                      <i className="fas fa-bolt text-white" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">Jugnu AI</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-4 mb-1">Request Early Access</h2>
                  <p className="text-slate-400 text-sm mb-8">Fill in your details. We'll set you up with <span className="text-amber-400 font-bold">10 free verified leads</span> within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Full Name *</label>
                        <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="Rajiv Khanna"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-violet-500 focus:bg-violet-500/5 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">WhatsApp Number *</label>
                        <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-violet-500 focus:bg-violet-500/5 focus:outline-none transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">City / Area *</label>
                        <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                          placeholder="Dwarka, Delhi"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:border-violet-500 focus:bg-violet-500/5 focus:outline-none transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Leads/Month Target</label>
                        <select value={form.leads} onChange={e => setForm({...form, leads: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-violet-500 focus:bg-violet-500/5 focus:outline-none transition-all appearance-none">
                          <option value="" className="bg-[#0c0c14]">Select range</option>
                          <option value="1-10" className="bg-[#0c0c14]">1–10 leads</option>
                          <option value="10-30" className="bg-[#0c0c14]">10–30 leads</option>
                          <option value="30+" className="bg-[#0c0c14]">30+ leads</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Preferred Plan</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Pay Per Lead', 'Retainer', 'Commission'].map(p => (
                          <button key={p} type="button" onClick={() => setForm({...form, plan: p})}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${form.plan === p ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="submit"
                      className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 text-white font-black text-lg tracking-tight hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] transition-all relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      Get Free Access → 10 Leads on Us
                    </button>
                    <p className="text-center text-[11px] text-slate-600">No credit card. No contract. Just results.</p>
                  </form>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(251,191,36,.5)]">
                    <i className="fas fa-check text-white text-3xl" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">You're on the list! 🎉</h3>
                  <p className="text-slate-400 mb-2">Hi <span className="text-white font-bold">{form.name}</span>, we've received your request.</p>
                  <p className="text-slate-400 text-sm mb-8">Our team will WhatsApp you at <span className="text-amber-400 font-bold">{form.phone}</span> within 24 hours with your custom AI intake link and your <span className="text-emerald-400 font-bold">first 10 leads free</span>.</p>
                  <button onClick={() => { setAccessModal(false); setSubmitted(false); setForm({ name: '', phone: '', city: '', leads: '', plan: '' }); }}
                    className="px-8 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/15 transition-colors">
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ NAVBAR ══ */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#04040a]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,.4)]">
              <i className="fas fa-bolt text-white text-sm" />
            </div>
            <div>
              <span className="font-black text-xl text-white tracking-tight">Jugnu AI</span>
              <span className="ml-2 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Beta</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {['#features', '#how-it-works', '#pricing', '#faq'].map((href, i) => (
              <a key={i} href={href} className="hover:text-white transition-colors">
                {['Features', 'How it Works', 'Pricing', 'FAQ'][i]}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors px-4 py-2">
              <i className="fas fa-sign-in-alt text-xs"></i> Sign In
            </Link>
            <Link href="/signup"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-black hover:shadow-[0_0_24px_rgba(251,191,36,.5)] transition-all flex items-center gap-2">
              Get Started <i className="fas fa-arrow-right text-[11px]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            India's First AI Broker Engine — West Delhi & Dwarka
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] max-w-5xl mb-6">
          Stop Chasing<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300">
            Bad Leads.
          </span>
          <br />Close Deals with AI.
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
          Jugnu AI automatically verifies buyers by CIBIL score, budget & intent — delivering only <span className="text-white font-bold">conversion-ready leads</span> straight to your WhatsApp.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button onClick={() => setWizardOpen(true)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 text-white font-black text-lg hover:shadow-[0_0_50px_rgba(124,58,237,.5)] transition-all flex items-center justify-center gap-3">
            <i className="fas fa-home" /> Find My Property
          </button>
          <a href="#demo"
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
            <i className="fas fa-headset text-amber-400" /> Talk to an Expert
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          {[
            { icon: 'fa-user-check', label: '800+ Leads Generated' },
            { icon: 'fa-rupee-sign', label: '₹40Cr+ Deals Facilitated' },
            { icon: 'fa-map-marker-alt', label: 'West Delhi Micro-Market' },
            { icon: 'fa-shield-alt', label: 'CIBIL Verified Buyers Only' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <i className={`fas ${t.icon} text-amber-400/70`} />
              <span>{t.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══ LAPTOP DEMO ══ */}
      <section id="demo" className="py-24 relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Live Platform Demo
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">See Jugnu AI in Action.</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Interact directly with the real broker dashboard. No sign-up required.</p>
        </div>

        {/* MacBook */}
        <div className="relative mx-auto w-full max-w-4xl">
          {/* Glow behind laptop */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-violet-500/10 to-blue-500/10 blur-[80px] -z-10 rounded-full" />

          {/* Screen */}
          <div className="relative mx-auto w-full bg-[#0a0a0a] rounded-[1.8rem] p-[10px] border border-[#2a2a2a] shadow-[0_40px_100px_rgba(0,0,0,.9),0_0_0_1px_rgba(255,255,255,.05)] overflow-hidden" style={{ aspectRatio: '16/10' }}>
            {/* Notch */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-24 h-5 bg-[#0a0a0a] rounded-b-xl z-30 flex justify-center items-center">
              <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10 relative">
                <div className="absolute inset-0.5 rounded-full bg-blue-500/40 blur-[2px]" />
              </div>
            </div>
            {/* Screen bezel - inner rounded border */}
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#050505]">
              <iframe src="/demo" className="w-full h-full border-0" title="Jugnu AI Demo" />
            </div>
          </div>

          {/* Base */}
          <div className="relative mx-auto w-[106%] -left-[3%]">
            <div className="h-[18px] bg-gradient-to-b from-[#909098] to-[#5a5a60] rounded-b-[2.5rem] border-t border-[#bbb] shadow-[0_20px_60px_rgba(0,0,0,.6)] flex justify-center items-start pt-0.5">
              <div className="w-28 h-2.5 bg-[#4a4a50] rounded-b-xl shadow-[inset_0_2px_6px_rgba(0,0,0,.8)]" />
            </div>
          </div>

          {/* Table reflection */}
          <div className="mx-auto w-[106%] -left-[3%] relative h-8 bg-gradient-to-b from-white/5 to-transparent rounded-b-[3rem] -mt-1" />

          {/* Ambient glow under laptop */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-amber-500/10 blur-[50px] -z-10" />
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">Built for Brokers.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Not for Generic CRMs.</span></h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">Every feature was designed specifically for the way Delhi brokers actually work.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`p-8 rounded-3xl bg-gradient-to-br ${f.bg} border border-white/6 hover:border-white/15 transition-all group relative overflow-hidden cursor-default`}>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity blur-xl" />
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <i className={`${f.icon.startsWith('fab') ? '' : 'fas'} ${f.icon}`} />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-24 bg-[#07070f] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">How Jugnu AI Works</h2>
            <p className="text-slate-400 text-lg">From inquiry to site visit in under 5 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            {STEPS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-[#0c0c16] border border-white/10 flex items-center justify-center mb-6 relative shadow-xl shadow-black group">
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black text-[10px] font-black shadow-[0_0_12px_rgba(251,191,36,.5)]">{s.num}</div>
                  <i className={`fas ${s.icon} text-2xl text-amber-400`} />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-32 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Brokers Who Switched to Jugnu AI</h2>
          <p className="text-slate-400 text-lg">Real results. Real commissions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/6 hover:border-white/12 transition-all flex flex-col">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => <i key={j} className="fas fa-star text-amber-400 text-sm" />)}
              </div>
              <p className="text-slate-300 leading-relaxed mb-8 flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 border-t border-white/5 pt-6">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center font-black text-white text-sm shadow-lg`}>{t.initials}</div>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.loc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="pricing" className="py-24 bg-[#07070f] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Simple, ROI-Driven Pricing.</h2>
            <p className="text-slate-400 text-lg">Pay only for qualified results. No subscriptions forced.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Pay Per Lead', price: '₹3,000', unit: '/ verified buyer', highlight: false,
                features: ['Financially verified buyer', 'Intent score > 80%', 'WhatsApp notification', 'No monthly commitment', 'Dashboard access included'],
                cta: 'Get 10 Leads Free', ctaColor: 'bg-white/10 hover:bg-white/15 text-white'
              },
              {
                name: 'Broker Retainer', price: '₹60,000', unit: '/ month', highlight: true,
                features: ['Unlimited verified buyers', 'Dedicated AI dashboard', 'WhatsApp AI Agent', 'Priority support (24/7)', 'First 10 leads absolutely free', 'Custom intake link & branding'],
                cta: 'Get Access Now', ctaColor: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black'
              },
              {
                name: 'Commission', price: '0.5%', unit: '/ deal closed', highlight: false,
                features: ['No upfront payment', 'Pay only on success', 'Full AI engine access', 'Unlimited leads flow', 'WhatsApp AI included'],
                cta: 'Contact Sales', ctaColor: 'bg-white/10 hover:bg-white/15 text-white'
              },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl flex flex-col relative overflow-hidden ${plan.highlight ? 'bg-gradient-to-b from-amber-400/10 to-transparent border-2 border-amber-400/40 shadow-[0_0_60px_rgba(251,191,36,.12)] md:-translate-y-4' : 'bg-white/[0.02] border border-white/8'}`}>
                {plan.highlight && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black px-4 py-1 rounded-b-xl uppercase tracking-widest shadow-[0_4px_20px_rgba(251,191,36,.4)]">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-black text-white mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.unit}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                      <i className={`fas fa-check-circle mt-0.5 ${plan.highlight ? 'text-amber-400' : 'text-indigo-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setAccessModal(true)}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:shadow-lg ${plan.ctaColor}`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="py-32 px-6 max-w-3xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Got Questions?</h2>
          <p className="text-slate-400">Everything you need to know about Jugnu AI.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-white/8 rounded-2xl bg-white/[0.02] overflow-hidden">
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-white hover:bg-white/5 transition-colors gap-4">
                <span>{faq.q}</span>
                <i className={`fas fa-chevron-down text-slate-500 shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-amber-400' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="relative bg-gradient-to-br from-[#0f0f1f] to-[#07070f] border border-white/10 rounded-[2.5rem] p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-violet-500/5 to-blue-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
          <div className="relative z-10">
            <div className="text-5xl mb-6">⚡</div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Ready to Close Faster?</h2>
            <p className="text-slate-400 text-xl mb-10 max-w-xl mx-auto">Join 50+ West Delhi brokers already using Jugnu AI. Get your first 10 leads free — no credit card needed.</p>
            <button onClick={() => setAccessModal(true)}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xl hover:shadow-[0_0_60px_rgba(251,191,36,.5)] transition-all inline-flex items-center gap-3">
              <i className="fas fa-bolt" /> Get Free Access Now
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/5 bg-[#030308] z-10 relative">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,.4)]">
                <i className="fas fa-bolt text-white text-sm" />
              </div>
              <span className="font-black text-xl text-white">Jugnu AI</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">India's first AI lead engine built exclusively for real estate brokers. CIBIL verified buyers. WhatsApp AI agent. Close faster.</p>
            <div className="flex gap-3">
              {[['fa-twitter', '#'], ['fa-linkedin-in', '#'], ['fa-whatsapp', '#'], ['fa-instagram', '#']].map(([icon, href], i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-amber-400/20 hover:text-amber-400 transition-all border border-white/5">
                  <i className={`fab ${icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {[
            { head: 'Product', links: [['Features', '#features'], ['Demo', '#demo'], ['Pricing', '#pricing'], ['FAQ', '#faq']] },
            { head: 'Company', links: [['About Us', '#'], ['Contact', '#'], ['Blog', '#'], ['Careers', '#']] },
            { head: 'Legal', links: [['Privacy Policy', '#'], ['Terms of Use', '#'], ['Refund Policy', '#']] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-5">{col.head}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, href], j) => (
                  <li key={j}><a href={href} className="text-slate-500 text-sm hover:text-white transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2026 Jugnu AI. All rights reserved.</p>
          <p className="text-slate-600 text-sm flex items-center gap-2">
            Powered by
            <a href="https://optivra.in" target="_blank" rel="noreferrer"
              className="text-white font-black hover:text-amber-400 transition-colors flex items-center gap-1.5">
              Optivra <i className="fas fa-external-link-alt text-[10px]" />
            </a>
          </p>
        </div>
      </footer>

      {/* Property Finder Wizard Modal */}
      <PropertyFinderWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
