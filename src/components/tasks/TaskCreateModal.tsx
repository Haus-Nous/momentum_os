import React, { useState } from 'react';
import { X, CheckSquare, Plus, Clock, Tag, Flag, Layers, AlertCircle, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Task, Priority, EnergyLevel, TaskStatus } from '../../types';
import { useMomentumStore } from '../../store/useMomentumStore';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { GroqAIProvider } from '../../utils/aiAssistantEngine';
import { VoiceRecorderButton } from '../notes/VoiceRecorderButton';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task;
}

export const TaskCreateModal: React.FC<TaskCreateModalProps> = ({ isOpen, onClose, initialTask }) => {
  const { addTask, updateTask, projects, tasks } = useMomentumStore();

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || 'todo');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'high');
  const [urgency, setUrgency] = useState<number>(initialTask?.urgency || 3);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(initialTask?.energyLevel || 'medium');
  const [category, setCategory] = useState<string>(initialTask?.category || 'Engineering');
  const [timeEstimateMinutes, setTimeEstimateMinutes] = useState<number>(initialTask?.timeEstimateMinutes || 45);
  const [dueDate, setDueDate] = useState<string>(initialTask?.dueDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState<string>(initialTask?.dueTime || '17:00');
  const [projectId, setProjectId] = useState<string>(initialTask?.projectId || projects[0]?.id || '');
  const [tagInput, setTagInput] = useState<string>(initialTask?.tags?.join(', ') || '');
  const [subtaskInput, setSubtaskInput] = useState<string>('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>(
    initialTask?.subtasks || []
  );
  const [notes, setNotes] = useState<string>(initialTask?.notes || '');

  // AI Quick-Add State
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInput.trim() || isParsing) return;
    setIsParsing(true);
    setAiSuccessMessage(null);
    try {
      const provider = new GroqAIProvider();
      const parsed: any = await provider.parseNaturalLanguageCommand(aiInput);
      if (parsed.title) setTitle(parsed.title);
      setDescription(parsed.description || '');
      if (parsed.priority) setPriority(parsed.priority);
      if (parsed.dueDate) setDueDate(parsed.dueDate);
      if (parsed.dueTime) setDueTime(parsed.dueTime);
      if (parsed.energyLevel) setEnergyLevel(parsed.energyLevel);
      setCategory(parsed.category || 'Engineering');
      if (parsed.timeEstimateMinutes) setTimeEstimateMinutes(parsed.timeEstimateMinutes);

      setAiSuccessMessage('Pre-filled by AI — review & edit fields below before saving.');
    } catch (err: any) {
      console.error('AI Task parse error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, { id: 'st_' + Date.now(), title: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (initialTask) {
      updateTask(initialTask.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        urgency,
        energyLevel,
        category,
        timeEstimateMinutes: Number(timeEstimateMinutes) || 30,
        dueDate,
        dueTime,
        projectId,
        tags,
        subtasks,
        notes,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        urgency,
        energyLevel,
        category,
        timeEstimateMinutes: Number(timeEstimateMinutes) || 30,
        timeSpentMinutes: 0,
        dueDate,
        dueTime,
        projectId,
        tags,
        subtasks,
        dependencies: [],
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] rounded-2xl shadow-xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-[#D85A2A] dark:text-[#E56B3A]" />
            <span>{initialTask ? 'Edit Task' : 'Create New Task'}</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prominent AI Quick-Add Natural Language Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#D85A2A]/10 dark:bg-[#E56B3A]/10 border border-[#D85A2A]/20 dark:border-[#E56B3A]/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#D85A2A] dark:text-[#E56B3A] flex items-center space-x-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Describe task in plain language (Groq AI Auto-Fill)</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiParse(); } }}
                placeholder="e.g. Fix vector index sharding bug by tomorrow 5pm high priority..."
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <VoiceRecorderButton
                  compact
                  onTranscribeComplete={(text) => setAiInput((prev) => (prev ? `${prev} ${text}` : text))}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={() => handleAiParse()}
              disabled={isParsing || !aiInput.trim()}
              size="sm"
              className="shrink-0 bg-[#D85A2A] hover:bg-[#C44E20] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1"
            >
              {isParsing ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>Auto-Fill</span>
                </>
              )}
            </Button>
          </div>
          {aiSuccessMessage && (
            <p className="text-[11px] font-semibold text-[#8A9A86] dark:text-[#9DB098] flex items-center space-x-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <Input
            required
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Architect Vector Index Sharding for RAG Pipeline"
          />

          <Textarea
            rows={2}
            label="Task Description & Context"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specify technical constraints, target output..."
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="todo" className="dark:bg-[#1C1A18]">Todo ⏹️</option>
                <option value="doing" className="dark:bg-[#1C1A18]">Doing ⏳</option>
                <option value="blocked" className="dark:bg-[#1C1A18]">Blocked ⛔</option>
                <option value="waiting" className="dark:bg-[#1C1A18]">Waiting ⏸️</option>
                <option value="completed" className="dark:bg-[#1C1A18]">Completed ✅</option>
                <option value="cancelled" className="dark:bg-[#1C1A18]">Cancelled ❌</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="urgent" className="dark:bg-[#1C1A18]">P1 - Urgent</option>
                <option value="high" className="dark:bg-[#1C1A18]">P2 - High</option>
                <option value="medium" className="dark:bg-[#1C1A18]">P3 - Medium</option>
                <option value="low" className="dark:bg-[#1C1A18]">P4 - Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Energy Required</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="high" className="dark:bg-[#1C1A18]">⚡ High Energy</option>
                <option value="medium" className="dark:bg-[#1C1A18]">⚙️ Medium Energy</option>
                <option value="low" className="dark:bg-[#1C1A18]">🌿 Low Energy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Input
              type="time"
              label="Due Time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />

            <Input
              type="number"
              label="Est. Mins"
              value={timeEstimateMinutes}
              onChange={(e) => setTimeEstimateMinutes(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Linked Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="dark:bg-[#1C1A18]">{p.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Engineering, Systems..."
            />
          </div>

          <Input
            label="Tags (Comma separated)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Architecture, RAG, Deep Work"
          />

          {/* Subtasks Checklist Builder */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Subtasks Checklist</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                placeholder="Add subtask step..."
                className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
              />
              <Button type="button" onClick={handleAddSubtask} variant="secondary" size="sm">Add</Button>
            </div>
            <div className="space-y-1">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg text-xs">
                  <span>{st.title}</span>
                  <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="text-gray-400 hover:text-[#D93829] dark:hover:text-[#ED4B3B]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Textarea
            rows={2}
            label="Execution Notes & Attachments"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Links, docs, terminal commands..."
          />

          <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="primary" size="sm">{initialTask ? 'Update Task' : 'Create Task'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
