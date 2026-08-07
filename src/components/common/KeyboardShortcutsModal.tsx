import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setShortcutsOpen, setActiveTab } = useMomentumStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key >= '1' && e.key <= '7') {
        const tabs: ('tasks' | 'systems' | 'habits' | 'calendar' | 'focus' | 'notes' | 'analytics')[] = [
          'tasks', 'systems', 'habits', 'calendar', 'focus', 'notes', 'analytics'
        ];
        const idx = parseInt(e.key) - 1;
        if (tabs[idx]) {
          setActiveTab(tabs[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: '⌘ K / Ctrl K', description: 'Open Global Command Palette' },
    { key: '1', description: 'Jump to Task Command Matrix' },
    { key: '2', description: 'Jump to Systems & Stacks' },
    { key: '3', description: 'Jump to Habit Engine' },
    { key: '4', description: 'Jump to Interactive Time Blocker' },
    { key: '5', description: 'Jump to Deep Focus Sanctuary' },
    { key: '6', description: 'Jump to Knowledge Graph Notes' },
    { key: '7', description: 'Jump to Analytics & Momentum Score' },
    { key: 'ESC', description: 'Close any open modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#0d111a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">System Hotkeys</h2>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2.5">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1">
              <span className="text-gray-300 font-medium">{s.description}</span>
              <kbd className="bg-white/10 border border-white/15 px-2 py-1 rounded text-[11px] font-mono text-indigo-300">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => setShortcutsOpen(false)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Hotkeys
          </button>
        </div>
      </div>
    </div>
  );
};
