"use client";

import React, { useState, useEffect } from 'react';
import { useMomentumStore } from '../../../store/useMomentumStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Task } from '../../../types';
import { getUserDisplayName } from '../../../utils/personaHelpers';

export interface DialogState {
  type: 'none' | 'task' | 'plant' | 'risk' | 'deadline' | 'interview' | 'sparky' | 'mail' | 'search' | 'signout' | 'gauge';
  payload?: any;
}

interface DeskDialogsProps {
  dialog: DialogState;
  onClose: () => void;
  onNavigate: (room: string) => void;
  onToast: (msg: string) => void;
}

export const DeskDialogs: React.FC<DeskDialogsProps> = ({
  dialog,
  onClose,
  onNavigate,
  onToast,
}) => {
  const { currentUser, signOut } = useAuthStore();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    risks,
    resolveRisk,
    addRiskPrepTasks,
    habits,
    profile,
    addXP,
  } = useMomentumStore();

  const displayName = getUserDisplayName(currentUser?.name || profile.name);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskArea, setTaskArea] = useState<Task['category']>('Career');
  const [taskDue, setTaskDue] = useState('');

  // Sparky AI chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'cat' | 'user'; text: string }>>([
    {
      sender: 'cat',
      text: `Mrrp. Hello ${displayName}! Sparky here. Ask me what to do next, or about risks, focus, habits, or your scores.`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Reset fields when dialog changes
  useEffect(() => {
    if (dialog.type === 'task') {
      setTaskTitle('');
      setTaskDue('');
      if (dialog.payload?.area) {
        setTaskArea(dialog.payload.area);
      } else {
        setTaskArea('Career');
      }
    }
  }, [dialog]);

  if (dialog.type === 'none') return null;

  // AI Chat reply generator with cat mannerisms
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiThinking) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAiThinking(true);

    try {
      // Analyze current metrics for grounded response
      const openTasks = tasks.filter((t) => t.status !== 'completed');
      const openRisks = (risks || []).filter((r) => !r.isResolved && !r.resolved);
      const activeHabits = habits.length;

      let catPrefix = '*stretches* ';
      const prefixes = ['Mrrp. ', '*stretches* ', 'Purr… ', 'Mew. '];
      catPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

      const lower = userText.toLowerCase();
      let response = '';

      if (lower.includes('risk') || lower.includes('deadline') || lower.includes('hackathon')) {
        if (openRisks.length > 0) {
          const topRisk = openRisks[0];
          response = `${catPrefix}Top risk is "${topRisk.title}" (due: ${topRisk.dueDate || 'soon'}). Tap its note on the corkboard and choose "Plan It" so we stay on track!`;
        } else {
          response = `${catPrefix}Zero active deadline risks right now! We are coasting smooth.`;
        }
      } else if (lower.includes('focus') || lower.includes('clock') || lower.includes('timer')) {
        response = `${catPrefix}The blue focus clock on your desk is primed for 50 minutes. Tap START and let's get into deep flow.`;
      } else if (lower.includes('habit') || lower.includes('plant') || lower.includes('knit') || lower.includes('scarf')) {
        response = `${catPrefix}Every completed habit knits another stitch on your scarf and waters your windowsill plants! You have ${activeHabits} tracked habit(s).`;
      } else if (openTasks.length > 0) {
        const top = openTasks[0];
        response = `${catPrefix}Next best move: "${top.title}". Knock this one out to keep your momentum soaring!`;
      } else {
        response = `${catPrefix}Your to-do list is completely clear! Pick up the pencil or hit "+" to write a new mission.`;
      }

      setChatMessages((prev) => [...prev, { sender: 'cat', text: response }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'cat', text: 'Mrrp… I yawned and missed that. Ask me again!' },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="desk-dialog-backdrop" onClick={onClose}>
      <div className="desk-dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Title Bar */}
        <div className="desk-dialog-title">
          <h3>
            {dialog.type === 'task' && 'New Task'}
            {dialog.type === 'plant' && `${dialog.payload?.area || 'Life Area'} Plant`}
            {dialog.type === 'risk' && 'Deadline Risk'}
            {dialog.type === 'deadline' && 'Pinned Deadline'}
            {dialog.type === 'interview' && 'Interview Card'}
            {dialog.type === 'sparky' && 'Sparky the Cat'}
            {dialog.type === 'mail' && 'Mail & Notifications'}
            {dialog.type === 'search' && 'Search Momentum'}
            {dialog.type === 'signout' && 'Leave the Room?'}
            {dialog.type === 'gauge' && `${dialog.payload?.name || 'Momentum'} Gauge`}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white border-2 border-[#222] rounded-md font-bold text-lg flex items-center justify-center hover:bg-[#ee7a5a] hover:text-white transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-5 flex flex-col gap-4 font-bold text-lg text-[#222]">
          {/* 1. New Task Dialog */}
          {dialog.type === 'task' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!taskTitle.trim()) return;
                addTask({
                  title: taskTitle.trim(),
                  category: taskArea,
                  status: 'today',
                  priority: 'medium',
                  dueDate: taskDue || new Date().toISOString().split('T')[0],
                  estimatedMinutes: 30,
                  tags: [taskArea.toLowerCase()],
                });
                onToast('Written on the to-do pad!');
                onClose();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm uppercase tracking-wider mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="WHAT NEEDS DOING?"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full border-3 border-[#222] rounded-md p-2 bg-[#fbf3df] font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#f7d55c]"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider mb-1">Life Area</label>
                <select
                  value={taskArea}
                  onChange={(e) => setTaskArea(e.target.value as Task['category'])}
                  className="w-full border-3 border-[#222] rounded-md p-2 bg-white font-bold text-lg focus:outline-none"
                >
                  <option value="Career">Career</option>
                  <option value="Health">Health</option>
                  <option value="Academic">Academic</option>
                  <option value="Finance">Finance</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider mb-1">Deadline (Optional)</label>
                <input
                  type="date"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="w-full border-3 border-[#222] rounded-md p-2 bg-white font-bold text-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="submit" className="desk-rivet yellow justify-center">
                  Add Task
                </button>
                <button type="button" onClick={onClose} className="desk-rivet justify-center">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* 2. Plant Area Dialog */}
          {dialog.type === 'plant' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#fbf3df] border-2 border-[#222] rounded-lg">
                <p className="text-xl">
                  STATUS: <span className="text-[#ee7a5a] uppercase">{dialog.payload?.status || 'STEADY'}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {tasks.filter((t) => t.category === dialog.payload?.area && t.status !== 'completed').length} active task(s) in this life area.
                </p>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider mb-1">Set Status</label>
                <select
                  defaultValue={dialog.payload?.status || 'steady'}
                  onChange={(e) => {
                    if (dialog.payload?.onSetStatus) {
                      dialog.payload.onSetStatus(e.target.value);
                      onToast(`Updated ${dialog.payload.area} plant!`);
                    }
                  }}
                  className="w-full border-3 border-[#222] rounded-md p-2 bg-white font-bold text-lg"
                >
                  <option value="thriving">Thriving (Blooming Flower)</option>
                  <option value="steady">Steady (Budding)</option>
                  <option value="alert">Needs Attention (Wilted)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    // Open task modal pre-selected to this area
                    setTimeout(() => {
                      dialog.payload?.openTaskInArea?.();
                    }, 100);
                  }}
                  className="desk-rivet yellow justify-center"
                >
                  + Add Task
                </button>
                <button onClick={onClose} className="desk-rivet justify-center">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 3. Deadline Risk Dialog */}
          {dialog.type === 'risk' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#ffe3db] border-3 border-[#ee7a5a] rounded-lg">
                <p className="text-2xl text-[#222]">{dialog.payload?.title || 'Upcoming Deadline'}</p>
                <p className="text-sm text-[#ee7a5a] mt-1 font-mono uppercase">
                  {dialog.payload?.kind || 'Mission'} · Due: {dialog.payload?.due || 'Soon'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    if (dialog.payload?.id) {
                      addRiskPrepTasks(dialog.payload.id);
                      onToast('3 prep tasks pinned to your to-do pad!');
                      onClose();
                    }
                  }}
                  className="desk-rivet yellow justify-center"
                >
                  Plan It
                </button>
                <button
                  onClick={() => {
                    if (dialog.payload?.id) {
                      resolveRisk(dialog.payload.id);
                      addXP(20, 'Resolved deadline risk');
                      onToast('Risk resolved! +20 XP');
                      onClose();
                    }
                  }}
                  className="desk-rivet coral justify-center"
                >
                  Resolve (+20 XP)
                </button>
              </div>
            </div>
          )}

          {/* 4. Pinned Deadline Dialog */}
          {dialog.type === 'deadline' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#fbf3df] border-2 border-[#222] rounded-lg">
                <p className="text-2xl">{dialog.payload?.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Due: {dialog.payload?.due || 'Today'} · Area: {dialog.payload?.category || 'General'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    if (dialog.payload?.id) {
                      updateTask(dialog.payload.id, { status: 'completed' });
                      addXP(10, 'Completed pinned task');
                      onToast('Task completed! +10 XP');
                      onClose();
                    }
                  }}
                  className="desk-rivet yellow justify-center"
                >
                  Mark Done (+10 XP)
                </button>
                <button
                  onClick={() => {
                    if (dialog.payload?.id) {
                      deleteTask(dialog.payload.id);
                      onToast('Task unpinned & deleted');
                      onClose();
                    }
                  }}
                  className="desk-rivet justify-center text-red-600"
                >
                  Unpin & Delete
                </button>
              </div>
            </div>
          )}

          {/* 5. Interview Card Dialog */}
          {dialog.type === 'interview' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#cfe5f1] border-3 border-[#6fa8dc] rounded-lg">
                <p className="text-2xl">{dialog.payload?.role || 'Interview'}</p>
                <p className="text-base text-gray-700 mt-1">
                  {dialog.payload?.company || 'Target Organization'} · {dialog.payload?.stage || 'Upcoming Round'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('career');
                  }}
                  className="desk-rivet yellow justify-center"
                >
                  Open Career Hub
                </button>
                <button onClick={onClose} className="desk-rivet justify-center">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* 6. Sparky the Cat AI Chat Dialog */}
          {dialog.type === 'sparky' && (
            <div className="space-y-3">
              <div className="h-60 overflow-y-auto border-3 border-[#222] p-3 rounded-lg bg-[#fbf3df] space-y-2.5">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border-2 border-[#222] max-w-[85%] text-base ${
                      m.sender === 'cat'
                        ? 'bg-white self-start shadow-[2px_2px_0_#222]'
                        : 'bg-[#222] text-white self-end ml-auto shadow-[2px_2px_0_#f7d55c]'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {isAiThinking && (
                  <div className="text-sm italic text-gray-500 animate-pulse">
                    Sparky is stretching and thinking…
                  </div>
                )}
              </div>

              <form onSubmit={handleSendAiMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="ASK SPARKY ANYTHING…"
                  className="flex-1 border-3 border-[#222] rounded-md px-3 py-1.5 bg-white font-bold text-lg focus:outline-none"
                />
                <button type="submit" className="desk-rivet yellow px-4">
                  Send
                </button>
              </form>
            </div>
          )}

          {/* 7. Mail & Notifications Dialog */}
          {dialog.type === 'mail' && (
            <div className="space-y-3">
              <div className="border-3 border-[#222] p-3 rounded-lg bg-[#fbf3df] space-y-2">
                <div className="p-2 bg-white border-2 border-[#222] rounded flex items-center justify-between">
                  <span>⚑ Daily Morning Momentum Briefing</span>
                  <span className="text-xs font-mono text-[#ee7a5a]">TODAY</span>
                </div>
                <div className="p-2 bg-white border-2 border-[#222] rounded flex items-center justify-between">
                  <span>✉ Sparky Desk Check-in: 3 Focus sprints logged</span>
                  <span className="text-xs font-mono text-gray-500">YESTERDAY</span>
                </div>
              </div>
              <button onClick={onClose} className="desk-rivet yellow w-full justify-center">
                Close Mailbox
              </button>
            </div>
          )}

          {/* 8. Search Dialog (⌘K) */}
          {dialog.type === 'search' && (
            <div className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="FIND A ROOM OR MISSION…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-3 border-[#222] rounded-md p-2 bg-[#fbf3df] font-bold text-xl focus:outline-none"
              />

              <div className="max-h-60 overflow-y-auto space-y-1.5">
                {[
                  { id: 'dashboard', name: 'Desk Overview' },
                  { id: 'tasks', name: 'Tasks & Missions' },
                  { id: 'habits', name: 'Habits Engine' },
                  { id: 'calendar', name: 'Calendar Schedule' },
                  { id: 'focus', name: 'Focus Sanctuary' },
                  { id: 'brain', name: 'Second Brain Notes' },
                  { id: 'analytics', name: 'Analytics & Trends' },
                  { id: 'goals', name: 'Long Term Goals' },
                  { id: 'academic', name: 'Academic Coursework' },
                  { id: 'career', name: 'Career & Opportunities' },
                  { id: 'achievements', name: 'Awards & Badges' },
                  { id: 'settings', name: 'System Settings' },
                ]
                  .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onClose();
                        onNavigate(r.id);
                      }}
                      className="w-full text-left p-2 bg-white hover:bg-[#f7d55c] border-2 border-[#222] rounded-md transition-colors flex justify-between items-center cursor-pointer"
                    >
                      <span>ROOM · {r.name}</span>
                      <span className="text-xs font-mono">GO →</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* 9. Sign Out Dialog */}
          {dialog.type === 'signout' && (
            <div className="space-y-4">
              <p className="text-xl">Sign out of MomentumOS and lock the desk?</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="desk-rivet coral justify-center"
                >
                  Sign Out
                </button>
                <button onClick={onClose} className="desk-rivet justify-center">
                  Stay in Room
                </button>
              </div>
            </div>
          )}

          {/* 10. Gauge Info Dialog */}
          {dialog.type === 'gauge' && (
            <div className="space-y-4">
              <p className="text-4xl text-center text-[#222] font-black">{dialog.payload?.score}</p>
              <p className="text-base text-gray-700 text-center">{dialog.payload?.description}</p>
              <button onClick={onClose} className="desk-rivet yellow w-full justify-center">
                Got It
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
