import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#04040a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
              <i className="fas fa-brain"></i>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Jugnu<span className="text-blue-500">AI</span>
            </span>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
}
