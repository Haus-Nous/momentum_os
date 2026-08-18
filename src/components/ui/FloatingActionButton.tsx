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
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white shadow-xl shadow-[#D85A2A]/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Quick Add Anything"
      >
        <Plus className="w-7 h-7" />
      </button>

      <QuickAddModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
