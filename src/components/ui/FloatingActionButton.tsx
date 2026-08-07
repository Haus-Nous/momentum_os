"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { QuickAddModal } from './QuickAddModal';

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Quick Add Anything"
      >
        <Plus className="w-7 h-7" />
      </button>

      <QuickAddModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
