import React, { useState } from 'react';
import { X, CheckCircle2, RotateCcw, Star, Award, Sparkles } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import confetti from 'canvas-confetti';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyReviewModal: React.FC<DailyReviewModalProps> = ({ isOpen, onClose }) => {
  const { tasks, awardXP, updateTask, addNote } = useMomentumStore();
  const [rating, setRating] = useState(5);
  const [reflectionText, setReflectionText] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const todayTasks = tasks.filter((t) => t.status === 'today');
  const completedToday = todayTasks.filter((t) => t.status === 'completed');
  const uncompletedToday = todayTasks.filter((t) => t.status !== 'completed');

  const handleFinishShutdown = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    awardXP(150);

    // Save Daily Reflection in Notes
    if (reflectionText.trim()) {
      addNote({
        title: `Daily Shutdown Log - ${new Date().toISOString().split('T')[0]}`,
        content: `# Daily Shutdown & Reflection Log\n\n- **Focus Rating**: ${rating}/5 Stars\n- **Completed Tasks**: ${completedToday.length}\n- **Rollover Items**: ${uncompletedToday.length}\n\n### Daily Reflection & Gratitude\n${reflectionText}`,
        tags: ['journal', 'shutdown', 'reflection'],
        linkedNoteIds: [],
        folder: 'journal',
      });
    }

    // Rollover uncompleted items to upcoming
    uncompletedToday.forEach((t) => {
      updateTask(t.id, { status: 'upcoming' });
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-[#0d111a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">Daily Evening Shutdown Ritual</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 1 ? (
          <div className="py-6 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-white">Audit Execution Ground</h3>
              <p className="text-xs text-gray-400">Clear cognitive buffer before closing your operating system.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="text-2xl font-black text-emerald-400">{completedToday.length}</div>
                <div className="text-xs font-bold text-emerald-300 mt-0.5">Completed Tasks</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                <div className="text-2xl font-black text-amber-400">{uncompletedToday.length}</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">Tasks to Rollover</div>
              </div>
            </div>

            {uncompletedToday.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-400">Rollover Uncompleted Items to Tomorrow:</div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {uncompletedToday.map((t) => (
                    <div key={t.id} className="p-2 rounded-xl bg-white/5 text-xs text-gray-300 flex items-center justify-between">
                      <span className="truncate">{t.title}</span>
                      <span className="text-[10px] text-amber-400 font-mono">Rollover →</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/30"
            >
              Next: Rate Focus & Log Reflection →
            </button>
          </div>
        ) : (
          <div className="py-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2">Rate Today's System Execution State:</label>
              <div className="flex items-center space-x-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Daily Gratitude & Friction Notes:</label>
              <textarea
                rows={4}
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="What went well? What system friction broke focus? What is tomorrow's Priority 1 anchor?"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleFinishShutdown}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-black text-xs rounded-xl transition-all shadow-xl shadow-emerald-600/30"
            >
              Complete Daily Shutdown (+150 XP)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
