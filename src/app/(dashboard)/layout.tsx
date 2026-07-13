"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: 'fa-chart-pie' },
  { name: 'Leads', href: '/dashboard/leads', icon: 'fa-bullseye' },
  { name: 'Customers', href: '/dashboard/customers', icon: 'fa-users' },
  { name: 'Properties', href: '/dashboard/properties', icon: 'fa-building' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: 'fa-check-square' },
  { name: 'Meetings', href: '/dashboard/meetings', icon: 'fa-calendar-alt' },
  { name: 'AI Assistant', href: '/dashboard/ai-tools', icon: 'fa-robot', isAi: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-brain text-sm"></i>
            </div>
            <span className="font-bold text-lg tracking-tight">JugnuAI</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                  <i className={`fas ${item.icon} w-5 text-center ${isActive ? '' : 'opacity-70'} ${item.isAi ? 'text-purple-500' : ''}`}></i>
                  <span>{item.name}</span>
                  {item.isAi && (
                    <span className="ml-auto text-[10px] uppercase font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-md">New</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium overflow-hidden border border-slate-300 dark:border-slate-700">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500" onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 w-64 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search leads, properties..." className="bg-transparent border-none outline-none w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <i className="fas fa-bell"></i>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#09090b]"></span>
            </button>
            <Link href="/dashboard/settings">
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <i className="fas fa-cog"></i>
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#09090b]">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#09090b] border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Similar to desktop sidebar but mobile */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <i className="fas fa-brain text-sm"></i>
                  </div>
                  <span className="font-bold text-lg tracking-tight">JugnuAI</span>
                </div>
                <button className="p-2 text-slate-500" onClick={() => setSidebarOpen(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}>
                        <i className={`fas ${item.icon} w-5 text-center ${isActive ? '' : 'opacity-70'} ${item.isAi ? 'text-purple-500' : ''}`}></i>
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
