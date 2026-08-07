"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { defaultAIProvider, ParsedCommand } from '../../utils/aiAssistantEngine';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  commandPreview?: ParsedCommand;
}

export const AIAssistantDrawer: React.FC = () => {
  const { isAIAssistantOpen, setAIAssistantOpen, addTask, tasks, assignments, hackathons, habits } = useMomentumStore();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: "Hello! I am your AI Productivity Assistant. Try typing a natural language command like:\n\n• \"Remind me to submit my AI assignment next Tuesday at 8 PM\"\n• \"What deadlines do I have this week?\"",
    },
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAIAssistantOpen(!isAIAssistantOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAIAssistantOpen, setAIAssistantOpen]);

  if (!isAIAssistantOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: 'msg_' + Date.now(), sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    // Check if input is a natural language command or conversational query
    if (currentInput.toLowerCase().includes('remind me') || currentInput.toLowerCase().includes('create') || currentInput.toLowerCase().includes('task')) {
      const parsed = defaultAIProvider.parseNaturalLanguageCommand(currentInput);
      const aiResponse: Message = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai',
        text: `I parsed your command into a structured ${parsed.type.toUpperCase()} draft. Check the preview below:`,
        commandPreview: parsed,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } else {
      const answer = defaultAIProvider.answerConversationalQuery(currentInput, { tasks, assignments, hackathons, habits });
      const aiResponse: Message = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai',
        text: answer,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }
  };

  const handleConfirmCommand = (command: ParsedCommand) => {
    addTask({
      title: command.title,
      status: 'todo',
      priority: command.priority,
      energyLevel: command.energyLevel,
      timeEstimateMinutes: command.timeEstimateMinutes || 45,
      timeSpentMinutes: 0,
      dueDate: command.dueDate,
      dueTime: command.dueTime,
      tags: ['AI-Generated', command.category || 'General'],
      subtasks: [],
      dependencies: [],
    });

    const confirmMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'ai',
      text: `✅ Task "${command.title}" has been successfully added to your workspace for ${command.dueDate} at ${command.dueTime}!`,
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0d111a] border-l border-indigo-500/30 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>AI Productivity Assistant</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono">v2.4</span>
            </h3>
            <p className="text-[11px] text-gray-400">Natural Language Tasking & Context Search</p>
          </div>
        </div>

        <button onClick={() => setAIAssistantOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className="space-y-2 max-w-[80%]">
              <div className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                {msg.text}
              </div>

              {/* Natural Language Command Draft Preview Card */}
              {msg.commandPreview && (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Parsed Task Draft</div>
                  <div className="text-xs font-bold text-white">{msg.commandPreview.title}</div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-400 font-mono">
                    <div>Date: <span className="text-emerald-400">{msg.commandPreview.dueDate}</span></div>
                    <div>Time: <span className="text-emerald-400">{msg.commandPreview.dueTime}</span></div>
                    <div>Priority: <span className="text-rose-400">{msg.commandPreview.priority.toUpperCase()}</span></div>
                    <div>Energy: <span className="text-amber-400">{msg.commandPreview.energyLevel.toUpperCase()}</span></div>
                  </div>

                  <Button
                    onClick={() => handleConfirmCommand(msg.commandPreview!)}
                    variant="emerald"
                    size="sm"
                    className="w-full justify-center mt-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirm & Add Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-black/10 dark:border-white/10 bg-black/30">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type 'Remind me to...' or ask a question..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
