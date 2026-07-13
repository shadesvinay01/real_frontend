"use client";
import React, { useEffect, useState } from 'react';
import PropertyFinderWizard from '@/components/website/PropertyFinderWizard';

export default function FindPropertyPage() {
  const [wizardOpen, setWizardOpen] = useState(true);

  // If they close it, just keep it on a landing page with a button to reopen
  return (
    <div className="min-h-screen bg-[#04040a] flex items-center justify-center">
      {!wizardOpen && (
        <button onClick={() => setWizardOpen(true)} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black text-lg">
          Open Property Finder
        </button>
      )}
      <PropertyFinderWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
