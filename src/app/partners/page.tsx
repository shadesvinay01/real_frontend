"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const REASONS = [
  { icon: 'fa-rupee-sign', title: 'Industry-Leading Commissions', desc: 'Earn up to 20% recurring commission on every client you bring. No cap. No ceiling. The more you close, the more you earn.' },
  { icon: 'fa-headset', title: 'Dedicated Partner Support', desc: 'Get a dedicated account manager, co-sell support, and priority access to our sales team to help close every deal.' },
  { icon: 'fa-box-open', title: 'Full Sales Toolkit', desc: 'Access branded pitch decks, case studies, one-pagers, demo accounts, and proposal templates — all ready on Day 1.' },
  { icon: 'fa-certificate', title: 'Optivra Partner Badge', desc: 'Display the Optivra Certified Partner badge on your website and proposals to instantly build credibility with clients.' },
  { icon: 'fa-graduation-cap', title: 'Free Training & Certification', desc: 'Get free product training, AI literacy courses, and certification — so you always have the right answer in front of clients.' },
  { icon: 'fa-chart-line', title: 'Real-Time Partner Dashboard', desc: 'Track your leads, commissions, deal stages, and payouts in one transparent, real-time dashboard at all times.' },
];

const COMMISSION_TIERS = [
  { tier: 'Starter', icon: 'fa-seedling', color: 'from-slate-600 to-slate-700', glow: 'shadow-slate-500/20', revenue: '₹0 – ₹5 Lakh / year', commission: '10%', perks: ['Partner Badge', 'Sales Toolkit', 'Email Support'] },
  { tier: 'Growth', icon: 'fa-rocket', color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/30', revenue: '₹5 L – ₹25 Lakh / year', commission: '15%', perks: ['Everything in Starter', 'Dedicated Manager', 'Co-sell Support', 'Priority Leads'] },
  { tier: 'Elite', icon: 'fa-crown', color: 'from-violet-600 to-purple-700', glow: 'shadow-violet-500/30', revenue: '₹25 Lakh+ / year', commission: '20% + Bonus', perks: ['Everything in Growth', 'Revenue Share Bonus', 'Joint Marketing', 'Executive Access', 'Custom Agreements'] },
];

const SERVICES = [
  { icon: 'fa-brain', title: 'AI Consulting & Strategy', desc: 'Sell AI roadmaps and feasibility assessments to enterprises ready to adopt intelligent automation.' },
  { icon: 'fa-robot', title: 'AI Agents & Automation', desc: 'Pitch autonomous AI agents for sales, support, and internal operations to reduce client headcount costs.' },
  { icon: 'fa-database', title: 'Machine Learning & Data Science', desc: 'Help data-heavy industries unlock revenue from their data via predictive models and analytics.' },
  { icon: 'fa-code', title: 'Full-Stack MVP Development', desc: 'Sell rapid product engineering for startups and innovation teams who need to launch fast.' },
  { icon: 'fa-eye', title: 'Computer Vision Systems', desc: 'Target manufacturing, logistics, and security clients with our AI-powered vision solutions.' },
  { icon: 'fa-cloud', title: 'Cloud Engineering & DevOps', desc: 'Propose AWS, GCP, and Azure cloud architecture and migration services to tech-scaling businesses.' },
  { icon: 'fa-shield-alt', title: 'CTO-as-a-Service', desc: 'Offer fractional technical leadership to early-stage startups who need senior engineering guidance.' },
  { icon: 'fa-home', title: 'Real Estate AI (Jugnu AI)', desc: 'Sell our flagship AI Real Estate CRM platform to brokers, agencies, and property developers.' },
];

const IDEAL_CLIENTS = [
  { icon: 'fa-building', label: 'Enterprise & Mid-Market Companies' },
  { icon: 'fa-store', label: 'SMEs Digitizing Operations' },
  { icon: 'fa-lightbulb', label: 'Tech Startups Seeking Speed' },
  { icon: 'fa-hospital', label: 'Healthcare & Pharma' },
  { icon: 'fa-industry', label: 'Manufacturing & Logistics' },
  { icon: 'fa-university', label: 'BFSI & Financial Services' },
  { icon: 'fa-shopping-cart', label: 'E-Commerce & Retail' },
  { icon: 'fa-hard-hat', label: 'Real Estate Developers & Brokers' },
];

const FAQS = [
  { q: 'How do I apply to become a partner?', a: 'Fill out the "Become a Partner" application form below. Our team reviews all applications within 2 business days and schedules a 30-minute onboarding call.' },
  { q: 'Is there any fee to join the partner program?', a: 'No. The Optivra Partner Program is completely free to join. There are no upfront costs, monthly fees, or hidden charges.' },
  { q: 'How and when do I get paid?', a: 'Commissions are paid within 15 days of a client payment being received. You can track all payouts in real-time from your Partner Dashboard.' },
  { q: 'Do I need a technical background to become a partner?', a: 'Not at all! Many of our top partners come from sales, consulting, and business development backgrounds. We provide full training and support so you can confidently pitch any of our services.' },
  { q: 'Can I refer clients internationally?', a: 'Yes! Our partner program is open globally. You can refer clients from any country and still earn full commissions.' },
  { q: 'What happens if a client I referred expands their contract?', a: 'You continue to earn commissions on all revenue generated from that client for as long as they remain a customer — including any upsells or expansions.' },
  { q: 'How do I track my referred leads?', a: 'You will receive a unique referral link and access to a real-time Partner Dashboard where you can monitor every lead, deal stage, and payout.' },
];

export default function PartnersPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', company: '', phone: '', website: '', audience: '', services: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#04040a] text-slate-200 font-sans overflow-x-hidden selection:bg-amber-500/30">

      {/* ══ AMBIENT BACKGROUND ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] left-[5%] w-[600px] h-[600px] bg-amber-600/6 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[0%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[120px]" />
      </div>

      {/* ══ NAV ══ */}
      <header className="fixed top-0 w-full z-50 bg-[#04040a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-widest text-white uppercase">
            Optivra<span className="text-amber-400">.</span>
          </Link>
          <Link href="#apply" className="px-6 py-2.5 bg-amber-400 text-black font-black text-sm tracking-widest uppercase hover:bg-amber-300 transition-all rounded-sm">
            Become a Partner
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-20">

        {/* ══ HERO ══ */}
        <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5 flex flex-col items-center text-center px-6">
          {/* Decorative grid lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(251,191,36,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-5 py-2 border border-amber-400/20 bg-amber-400/5 rounded-full text-[11px] tracking-[0.3em] font-bold text-amber-400 uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
            Partner Program
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-white max-w-5xl mb-6">
            Grow Your Business<br />by Selling <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Cutting-Edge AI</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
            Join the Optivra Partner Network and earn industry-leading commissions by referring clients to our enterprise AI consulting, product engineering, and automation services.
          </motion.p>

          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 items-center">
            <a href="#apply" className="px-8 py-4 bg-amber-400 text-black font-black text-sm tracking-widest uppercase hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all rounded-sm flex items-center gap-2">
              <i className="fas fa-handshake" /> Apply Now — It's Free
            </a>
            <a href="#why" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all rounded-sm">
              Learn More <i className="fas fa-arrow-down ml-2" />
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            {[
              { value: '20%', label: 'Max Commission Rate' },
              { value: '15 Days', label: 'Payout Cycle' },
              { value: '₹0', label: 'Cost to Join' },
              { value: '8+', label: 'Services to Sell' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-amber-400 mb-1">{stat.value}</p>
                <p className="text-xs tracking-widest uppercase text-slate-500 font-bold">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══ WHY PARTNER ══ */}
        <section id="why" className="py-24 px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">Why Partner With Us</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Everything You Need to <span className="text-amber-400">Win.</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto">We've built a partner program that puts your success first — with the resources, support, and commissions to make every partnership worth your time.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REASONS.map((r, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                  className="group bg-white/[0.03] border border-white/8 rounded-2xl p-8 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center mb-5 group-hover:bg-amber-400/20 transition-colors">
                    <i className={`fas ${r.icon} text-amber-400 text-xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{r.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ COMMISSION STRUCTURE ══ */}
        <section className="py-24 px-6 border-b border-white/5 bg-[#060610]">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">Commission Structure</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Earn More as You <span className="text-amber-400">Scale.</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Three tiers designed to reward performance. Unlock higher commissions and exclusive perks as your referral revenue grows.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COMMISSION_TIERS.map((tier, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}
                  className={`relative rounded-2xl overflow-hidden border ${i === 1 ? 'border-amber-400/40' : 'border-white/10'}`}>
                  {i === 1 && (
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                  )}
                  {i === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>
                  )}
                  <div className={`p-8 bg-gradient-to-br ${i === 1 ? 'from-amber-500/10 to-orange-500/5' : 'from-white/3 to-transparent'}`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-5 shadow-lg ${tier.glow}`}>
                      <i className={`fas ${tier.icon} text-white text-xl`} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{tier.tier}</p>
                    <p className="text-sm text-slate-400 mb-4">{tier.revenue}</p>
                    <div className="text-4xl font-black text-white mb-6">{tier.commission}</div>
                    <ul className="space-y-3">
                      {tier.perks.map((perk, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                          <i className="fas fa-check text-amber-400 text-xs shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p {...fadeUp} className="text-center text-slate-500 text-sm mt-8">
              <i className="fas fa-info-circle mr-2 text-amber-400/60" />
              Commission rates are calculated on net revenue received. Detailed terms shared on onboarding.
            </motion.p>
          </div>
        </section>

        {/* ══ SERVICES YOU SELL ══ */}
        <section className="py-24 px-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">What You'll Sell</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">A Full Suite of <span className="text-amber-400">AI Products.</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto">From AI consulting to custom software, you'll have a broad, in-demand portfolio that fits clients in almost every industry.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
              {SERVICES.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: (i % 4) * 0.1 }}
                  className="group p-8 bg-[#04040a] hover:bg-amber-400/5 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/5 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 text-amber-400 mb-5 group-hover:scale-110 group-hover:text-white transition-all duration-300">
                    <i className={`fas ${s.icon} text-2xl`} />
                  </div>
                  <h3 className="font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ IDEAL CLIENTS ══ */}
        <section className="py-24 px-6 border-b border-white/5 bg-[#060610]">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">Ideal Clients</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Who to Target <span className="text-amber-400">First.</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Our services are built for organizations that are scaling, digitalizing, or looking to unlock the power of AI. Here's where you'll find the best fit.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {IDEAL_CLIENTS.map((c, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }}
                  className="group flex flex-col items-center justify-center text-center p-8 bg-white/3 border border-white/8 rounded-2xl hover:border-amber-400/40 hover:bg-amber-400/5 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-amber-400/10 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 transition-colors">
                    <i className={`fas ${c.icon} text-amber-400 text-xl`} />
                  </div>
                  <p className="text-sm font-bold text-slate-300">{c.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="py-24 px-6 border-b border-white/5">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Simple. Fast. <span className="text-amber-400">Profitable.</span></h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/60 via-amber-400/20 to-transparent hidden md:block" />
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Apply & Get Approved', desc: 'Fill out the form below. Our team reviews your application within 2 business days and schedules a quick onboarding call.' },
                  { step: '02', title: 'Get Your Toolkit', desc: 'Receive access to your unique referral link, branded collateral, demo accounts, and your Partner Dashboard.' },
                  { step: '03', title: 'Refer & Co-sell', desc: 'Share your referral link or introduce us directly. We\'ll handle the full sales process — you just stay in the loop.' },
                  { step: '04', title: 'Earn Your Commission', desc: 'When your referral converts, you get paid within 15 days. No questions asked, fully transparent tracking.' },
                ].map((item, i) => (
                  <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex gap-8 items-start">
                    <div className="w-16 h-16 shrink-0 rounded-full bg-[#0c0c14] border-2 border-amber-400/40 flex items-center justify-center font-black text-amber-400 text-lg relative z-10">
                      {item.step}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="py-24 px-6 border-b border-white/5 bg-[#060610]">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">FAQs</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Questions? <span className="text-amber-400">Answered.</span></h2>
            </motion.div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }}
                  className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                  <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-amber-400/5 transition-colors">
                    <span className="font-bold text-white pr-4">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-45' : ''}`}>
                      <i className="fas fa-plus text-amber-400 text-xs" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <p className="px-6 pb-6 text-slate-400 leading-relaxed text-sm border-t border-white/5 pt-4">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ APPLICATION FORM ══ */}
        <section id="apply" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">Apply Now</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Become a <span className="text-amber-400">Partner.</span></h2>
              <p className="text-slate-400">Fill out the form below and our partnership team will reach out within 2 business days.</p>
            </motion.div>

            <motion.div {...fadeUp} className="bg-[#0c0c14] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Full Name *</label>
                      <input required value={formState.name} onChange={e => setFormState({ ...formState, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all"
                        placeholder="Sarvesh Mehta" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Business Email *</label>
                      <input required type="email" value={formState.email} onChange={e => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all"
                        placeholder="sarvesh@company.com" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Company / Agency *</label>
                      <input required value={formState.company} onChange={e => setFormState({ ...formState, company: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all"
                        placeholder="Acme Consulting Pvt. Ltd." />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Phone Number *</label>
                      <input required type="tel" value={formState.phone} onChange={e => setFormState({ ...formState, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all"
                        placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Website / LinkedIn</label>
                    <input value={formState.website} onChange={e => setFormState({ ...formState, website: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all"
                      placeholder="https://yourcompany.com or linkedin.com/in/yourprofile" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Who is your target audience? *</label>
                    <select required value={formState.audience} onChange={e => setFormState({ ...formState, audience: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all appearance-none">
                      <option value="" disabled>Select your target market</option>
                      <option>Enterprise & Mid-Market Companies</option>
                      <option>Startups & SMEs</option>
                      <option>Real Estate Developers & Brokers</option>
                      <option>Healthcare & Pharma</option>
                      <option>BFSI & Financial Services</option>
                      <option>E-Commerce & Retail</option>
                      <option>Manufacturing & Logistics</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Which services are you most interested in selling? *</label>
                    <select required value={formState.services} onChange={e => setFormState({ ...formState, services: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all appearance-none">
                      <option value="" disabled>Select service area</option>
                      <option>AI Consulting & Strategy</option>
                      <option>AI Agents & Automation</option>
                      <option>Machine Learning & Data Science</option>
                      <option>Full-Stack MVP Development</option>
                      <option>Real Estate AI (Jugnu AI CRM)</option>
                      <option>Cloud Engineering</option>
                      <option>All of the above</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Tell us about yourself and why you'd be a great partner</label>
                    <textarea value={formState.message} onChange={e => setFormState({ ...formState, message: e.target.value })} rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-amber-400/60 focus:outline-none focus:bg-amber-400/5 transition-all resize-none"
                      placeholder="Brief background, your existing client network, expected referrals per month, etc." />
                  </div>

                  <button type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-lg hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:from-amber-300 transition-all flex items-center justify-center gap-3">
                    <i className="fas fa-handshake" /> Submit Partner Application
                  </button>

                  <p className="text-center text-slate-600 text-xs">By submitting, you agree to our Terms of Partnership. We'll respond within 2 business days.</p>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-amber-400/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                    <i className="fas fa-check text-amber-400 text-4xl" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">Application Submitted!</h3>
                  <p className="text-slate-400 max-w-md mx-auto mb-8">Thank you for applying to the Optivra Partner Program. Our team will review your application and reach out within <strong className="text-amber-400">2 business days</strong>.</p>
                  <Link href="/" className="text-amber-400 font-bold hover:underline">
                    <i className="fas fa-arrow-left mr-2" /> Back to Homepage
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-slate-600 text-sm">© 2026 Optivra. All rights reserved.</p>
        <p className="text-slate-700 text-xs mt-2">
          Questions? Email us at <a href="mailto:partners@optivra.in" className="text-amber-400/60 hover:text-amber-400 transition-colors">partners@optivra.in</a>
        </p>
      </footer>
    </div>
  );
}
