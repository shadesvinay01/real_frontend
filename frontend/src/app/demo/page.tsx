"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LEADS = [
  {
    id: 1, initials: 'RS', name: 'Rahul Sharma', probability: 96, tag: 'Pre-Approved',
    budget: '₹85L–1Cr', downPayment: '₹20L', location: 'Dwarka Sec-12', timeline: 'Immediate',
    cibil: 780, phone: '+91 98765 43210', stage: 'hot',
    propertyImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    chat: [
      { from: 'bot', text: 'Hi Rahul 👋 Your CIBIL of 780 qualifies you for up to ₹1.1Cr. We have 3 perfect matches in Dwarka Sec-12.', time: '10:41 AM' },
      { from: 'user', text: 'Great! I have ₹20L ready as down payment.', time: '10:43 AM' },
      { from: 'bot', text: 'Perfect fit! I\'ve scheduled a site visit for Saturday 11AM. Our broker Rajiv will meet you.', time: '10:44 AM' },
    ]
  },
  {
    id: 2, initials: 'VM', name: 'Vikram Mehta', probability: 82, tag: 'Verified',
    budget: '₹1.5Cr', downPayment: '₹40L', location: 'Punjabi Bagh', timeline: '1–3 months',
    cibil: 755, phone: '+91 98765 43211', stage: 'warm',
    propertyImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    chat: [
      { from: 'bot', text: 'Hello Vikram! We found a premium floor in Punjabi Bagh matching your budget of ₹1.5Cr.', time: '9:20 AM' },
      { from: 'user', text: 'Can you share more details?', time: '9:35 AM' },
    ]
  },
  {
    id: 3, initials: 'PS', name: 'Priya Singh', probability: 74, tag: 'Prospect',
    budget: '₹60L–75L', downPayment: '₹12L', location: 'Janakpuri', timeline: '3–6 months',
    cibil: 710, phone: '+91 98765 43212', stage: 'new',
    propertyImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    chat: [
      { from: 'bot', text: 'Hi Priya! Based on your inquiry, we have affordable 2BHK options in Janakpuri within ₹65L.', time: '8:00 AM' },
    ]
  },
];

const PROPERTIES = [
  { id: 1, name: '3BHK Premium Floor', location: 'Dwarka Sec-12', price: '₹95L', type: 'Floor', status: 'Available', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80' },
  { id: 2, name: 'Luxury Builder Floor', location: 'Punjabi Bagh', price: '₹1.45Cr', type: 'Builder Floor', status: 'Available', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80' },
  { id: 3, name: 'Ready 2BHK Flat', location: 'Janakpuri', price: '₹68L', type: 'Apartment', status: 'Limited', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80' },
  { id: 4, name: '4BHK Villa', location: 'Rajouri Garden', price: '₹2.1Cr', type: 'Villa', status: 'Available', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
];

type View = 'pipeline' | 'chat' | 'properties' | 'analytics';

export default function BrokerOS() {
  const [view, setView] = useState<View>('pipeline');
  const [activeLead, setActiveLead] = useState(LEADS[0]);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState(LEADS[0].chat);
  const [queue, setQueue] = useState([
    { id: 4491, progress: 85, status: 'CIBIL verified ✓  Scoring intent...', ok: true },
    { id: 4490, progress: 100, status: 'Rejected — Down payment < 10%', ok: false },
  ]);
  const [toast, setToast] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  useEffect(() => {
    const t = setInterval(() => {
      const id = Math.floor(Math.random() * 900) + 5000;
      setQueue(q => [{ id, progress: 40, status: 'Analyzing financial footprint...', ok: true }, q[0]]);
    }, 18000);
    return () => clearInterval(t);
  }, []);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const handleSend = () => {
    if (!chatMsg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = [...chatHistory, { from: 'broker', text: chatMsg, time: now }];
    setChatHistory(updated);
    setChatMsg('');
    setTimeout(() => {
      const aiReply = { from: 'bot', text: 'Got it! I\'ll follow up with the lead immediately and update their intent score.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatHistory(h => [...h, aiReply]);
    }, 1200);
  };

  const switchLead = (lead: typeof LEADS[0]) => {
    setActiveLead(lead);
    setChatHistory(lead.chat);
    setView('chat');
  };

  const stageConfig: Record<string, any> = {
    hot:  { label: 'Hot Leads',  color: 'text-rose-400',    dot: 'bg-rose-500',    ring: 'ring-rose-500/30' },
    warm: { label: 'Warm Leads', color: 'text-amber-400',   dot: 'bg-amber-400',   ring: 'ring-amber-400/30' },
    new:  { label: 'New / Cold', color: 'text-blue-400',    dot: 'bg-blue-400',    ring: 'ring-blue-400/30' },
  };

  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'pipeline',   icon: 'fa-columns',    label: 'Pipeline'    },
    { id: 'chat',       icon: 'fa-comments',   label: 'AI Chat'     },
    { id: 'properties', icon: 'fa-building',   label: 'Properties'  },
    { id: 'analytics',  icon: 'fa-chart-area', label: 'Analytics'   },
  ];

  return (
    <div className="h-screen w-full bg-[#050507] text-slate-200 font-sans flex overflow-hidden relative">
      {/* Background ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-15%] w-[55%] h-[55%] bg-blue-700/12 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] bg-violet-700/12 blur-[120px] rounded-full" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/15 px-5 py-3 rounded-2xl shadow-2xl">
            <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-[0_0_10px_rgba(16,185,129,.6)]">✓</span>
            <span className="text-sm font-semibold text-white">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className="w-[72px] lg:w-60 border-r border-white/5 bg-black/30 backdrop-blur-2xl flex flex-col items-center lg:items-stretch py-6 z-50 shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start gap-3 px-0 lg:px-5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_24px_rgba(79,70,229,.5)]">
            <i className="fas fa-bolt text-white text-base" />
          </div>
          <div className="hidden lg:block">
            <div className="font-black text-white text-base leading-none tracking-tight">Broker OS</div>
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">by PreApproved AI</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 w-full px-3 flex-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl w-full transition-all ${view === n.id ? 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/25' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <i className={`fas ${n.icon} text-base w-5 text-center`} />
              <span className="hidden lg:block text-sm font-bold">{n.label}</span>
            </button>
          ))}
        </nav>

        {/* AI Queue mini-panel */}
        <div className="hidden lg:block w-full px-3 mb-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <i className="fas fa-microchip text-indigo-400 text-[9px]" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Queue</span>
            </div>
            <div className="space-y-3">
              {queue.map(q => (
                <div key={q.id} className="text-[10px]">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 font-bold">#{q.id}</span>
                    <span className={q.ok ? 'text-emerald-400' : 'text-rose-400'}>{q.ok ? 'Processing' : 'Rejected'}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-[3px] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${q.progress}%` }} transition={{ duration: 1.5 }}
                      className={`h-full rounded-full ${q.ok ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                  </div>
                  <div className={`mt-1 ${q.ok ? 'text-slate-500' : 'text-rose-500/70'} leading-tight`}>{q.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User */}
        <div className="px-3 w-full">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-black text-white">RK</div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold text-white leading-none">Rajiv Khanna</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Dwarka Properties</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/10 backdrop-blur-xl shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tighter">
                {{
                  pipeline: 'Lead Pipeline', chat: 'AI Chat Engine',
                  properties: 'Property Vault', analytics: 'Analytics'
                }[view]}
              </h1>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">AI Active</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Micro-market: West Delhi & Dwarka corridor</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => showToast('Intake link copied!')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-colors">
              <i className="fas fa-link text-blue-400" /> Share Intake
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white hover:shadow-[0_0_24px_rgba(79,70,229,.5)] transition-all">
              <i className="fas fa-plus" /> Add Lead
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 lg:p-8">
          <AnimatePresence mode="wait">

            {/* ── PIPELINE VIEW ── */}
            {view === 'pipeline' && (
              <motion.div key="pipeline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="h-full flex flex-col gap-6">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4 shrink-0">
                  {[
                    { label: 'Est. Deal Value', val: '₹14.2Cr', delta: '+12%', icon: 'fa-coins', from: 'from-blue-600/30', to: 'to-transparent' },
                    { label: 'Verified Buyers', val: '84', delta: '+6', icon: 'fa-user-check', from: 'from-indigo-600/30', to: 'to-transparent' },
                    { label: 'Avg AI Score', val: '88%', delta: '+3%', icon: 'fa-brain', from: 'from-violet-600/30', to: 'to-transparent' },
                    { label: 'This Month Closed', val: '7', delta: '+2', icon: 'fa-handshake', from: 'from-emerald-600/30', to: 'to-transparent' },
                  ].map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.from} ${s.to} border border-white/8 rounded-2xl p-5 relative overflow-hidden`}>
                      <div className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <i className={`fas ${s.icon} text-white/30`} />
                      </div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{s.label}</div>
                      <div className="text-3xl font-black text-white mb-1">{s.val}</div>
                      <div className="text-xs font-bold text-emerald-400">{s.delta} vs last mo.</div>
                    </div>
                  ))}
                </div>

                {/* Kanban columns */}
                <div className="flex-1 grid grid-cols-3 gap-5 min-h-0">
                  {(['hot','warm','new'] as const).map(stage => {
                    const sc = stageConfig[stage];
                    const stageLeads = LEADS.filter(l => l.stage === stage);
                    return (
                      <div key={stage} className="flex flex-col bg-white/[0.02] border border-white/6 rounded-2xl overflow-hidden">
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5 bg-black/20 shrink-0">
                          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                          <span className={`text-xs font-black uppercase tracking-widest ${sc.color}`}>{sc.label}</span>
                          <span className="ml-auto bg-white/8 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scroll">
                          {stageLeads.map(lead => (
                            <motion.div key={lead.id} whileHover={{ y: -2 }} onClick={() => switchLead(lead)}
                              className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-500/40 hover:shadow-[0_8px_32px_rgba(79,70,229,.15)] transition-all group">
                              <div className="relative h-28 overflow-hidden">
                                <img src={lead.propertyImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-white">{lead.location}</div>
                                    <div className="text-xs text-slate-300">{lead.budget}</div>
                                  </div>
                                  <div className={`text-xl font-black ${lead.probability >= 90 ? 'text-emerald-400' : lead.probability >= 75 ? 'text-amber-400' : 'text-blue-400'}`}>{lead.probability}%</div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white ring-2 ${sc.ring}`}>{lead.initials}</div>
                                  <div>
                                    <div className="text-sm font-bold text-white leading-none mb-0.5">{lead.name}</div>
                                    <div className={`text-[9px] font-black uppercase tracking-widest ${sc.color}`}>{lead.tag}</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div className="bg-white/4 rounded-lg p-2">
                                    <div className="text-slate-500 font-bold mb-0.5 uppercase">CIBIL</div>
                                    <div className="font-black text-white">{lead.cibil}</div>
                                  </div>
                                  <div className="bg-white/4 rounded-lg p-2">
                                    <div className="text-slate-500 font-bold mb-0.5 uppercase">Down Pay</div>
                                    <div className="font-black text-emerald-400">{lead.downPayment}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <button onClick={e => { e.stopPropagation(); window.open(`https://wa.me/${lead.phone.replace(/\D/g,'')}`); }}
                                    className="flex-1 py-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-1.5">
                                    <i className="fab fa-whatsapp" /> Chat
                                  </button>
                                  <button onClick={e => { e.stopPropagation(); switchLead(lead); }}
                                    className="flex-1 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold hover:bg-indigo-600/30 transition-colors flex items-center justify-center gap-1.5">
                                    <i className="fas fa-eye" /> View AI
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── CHAT VIEW ── */}
            {view === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="h-full flex gap-5">
                {/* Lead selector */}
                <div className="w-64 shrink-0 flex flex-col gap-3">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 px-1">Active Leads</div>
                  {LEADS.map(l => (
                    <button key={l.id} onClick={() => switchLead(l)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all w-full ${activeLead.id === l.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/6 hover:bg-white/5'}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-sm shrink-0">{l.initials}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{l.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{l.location}</div>
                      </div>
                      <div className={`ml-auto text-sm font-black shrink-0 ${l.probability >= 90 ? 'text-emerald-400' : l.probability >= 75 ? 'text-amber-400' : 'text-blue-400'}`}>{l.probability}%</div>
                    </button>
                  ))}
                </div>

                {/* Chat window */}
                <div className="flex-1 bg-[#0b141a] rounded-3xl border border-white/8 flex flex-col overflow-hidden shadow-2xl">
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#25D366]" />
                  </div>
                  {/* Chat Header */}
                  <div className="flex items-center gap-4 px-6 py-4 bg-[#202c33] border-b border-white/5 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white">{activeLead.initials}</div>
                    <div>
                      <div className="font-bold text-white">{activeLead.name}</div>
                      <div className="text-xs text-[#25D366] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                        AI Agent is online
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <button onClick={() => showToast('Call initiated…')} className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                        <i className="fas fa-phone text-emerald-400" /> Call
                      </button>
                      <button onClick={() => showToast('Sharing property brochure…')} className="px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                        <i className="fas fa-paper-plane text-blue-400" /> Send Brochure
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0b141a] custom-scroll">
                    {chatHistory.map((m, i) => (
                      <div key={i} className={`flex ${m.from !== 'user' ? 'justify-start' : 'justify-end'}`}>
                        {m.from === 'bot' && (
                          <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mr-2 mt-auto shrink-0">
                            <i className="fas fa-robot text-indigo-400 text-[10px]" />
                          </div>
                        )}
                        <div className={`max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                          m.from === 'bot'    ? 'bg-[#202c33] text-[#e9edef] rounded-tl-sm' :
                          m.from === 'user'   ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-sm' :
                                               'bg-indigo-600/80 text-white rounded-tr-sm'
                        }`}>
                          {m.from === 'broker' && <div className="text-[9px] text-indigo-200/60 font-bold uppercase tracking-widest mb-1">Broker Override</div>}
                          {m.text}
                          <div className="text-[10px] text-white/40 text-right mt-1.5">{m.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 bg-[#202c33] border-t border-white/5 shrink-0 flex gap-3">
                    <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="Override AI message or send custom note..."
                      className="flex-1 bg-[#2a3942] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500" />
                    <button onClick={handleSend} className="w-12 h-12 rounded-xl bg-[#00a884] text-white flex items-center justify-center hover:bg-[#008f6f] transition-colors shadow-lg">
                      <i className="fas fa-paper-plane" />
                    </button>
                  </div>
                </div>

                {/* Context panel */}
                <div className="w-72 shrink-0 flex flex-col gap-4">
                  <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden">
                    <img src={activeLead.propertyImg} className="w-full h-32 object-cover" alt="" />
                    <div className="p-5">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Matched Property</div>
                      <div className="font-bold text-white mb-0.5">3BHK Premium Floor</div>
                      <div className="text-xs text-slate-400">{activeLead.location}</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/15 to-transparent border border-indigo-500/20 rounded-2xl p-5">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">AI Intent Score</div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">{activeLead.probability}%</div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${activeLead.probability}%` }} transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,.8)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-white/4 rounded-lg p-2"><div className="text-slate-500 mb-0.5 uppercase font-bold">CIBIL</div><div className="font-black text-emerald-400">{activeLead.cibil}</div></div>
                      <div className="bg-white/4 rounded-lg p-2"><div className="text-slate-500 mb-0.5 uppercase font-bold">Down Pay</div><div className="font-black text-white">{activeLead.downPayment}</div></div>
                    </div>
                  </div>
                  <button onClick={() => showToast('Schedule sent via WhatsApp!')} className="w-full py-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-bold hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-2">
                    <i className="fab fa-whatsapp" /> Schedule Site Visit
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── PROPERTIES VIEW ── */}
            {view === 'properties' && (
              <motion.div key="properties" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="h-full flex flex-col gap-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {PROPERTIES.map(p => (
                    <div key={p.id} className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_8px_32px_rgba(79,70,229,.15)] transition-all group cursor-pointer">
                      <div className="relative h-40 overflow-hidden">
                        <img src={p.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${p.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{p.status}</div>
                        <div className="absolute bottom-3 left-3 text-xl font-black text-white">{p.price}</div>
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-white mb-0.5">{p.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1"><i className="fas fa-map-marker-alt text-indigo-400 text-[10px]" /> {p.location}</div>
                        <button onClick={() => showToast(`Matching leads for ${p.name}…`)} className="mt-3 w-full py-2 rounded-xl bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 text-xs font-bold hover:bg-indigo-600/25 transition-colors">
                          Find Matching Buyers
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── ANALYTICS VIEW ── */}
            {view === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="h-full grid grid-cols-3 gap-5">
                {/* Chart area */}
                <div className="col-span-2 bg-white/[0.02] border border-white/6 rounded-2xl p-6">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Monthly Lead Conversion</div>
                  <div className="text-2xl font-black text-white mb-6">64% Win Rate <span className="text-sm font-normal text-emerald-400">↑ 8%</span></div>
                  <div className="flex items-end gap-3 h-36">
                    {[40,55,48,72,65,88,64,90,82,78,95,84].map((v, i) => (
                      <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-indigo-600 to-blue-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group" style={{ height: `${v}%` }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white text-[#050507] text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v}%</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] text-slate-600">
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  {[
                    { label: 'Leads Received', val: '284', sub: 'This year' },
                    { label: 'Pre-Approved', val: '102', sub: '36% of total' },
                    { label: 'Deals Closed', val: '23', sub: '22% close rate' },
                    { label: 'Revenue (Est.)', val: '₹3.2Cr', sub: 'Commissions' },
                  ].map((s, i) => (
                    <div key={i} className="flex-1 bg-white/[0.02] border border-white/6 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
                      <div className="text-3xl font-black text-white">{s.val}</div>
                      <div className="text-xs text-slate-500">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}
