import React from 'react';
import { Save, Trash2, Tag, BookOpen, Link2 } from 'lucide-react';
import { Note } from '../../types';
import { VoiceRecorderButton } from './VoiceRecorderButton';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onDelete: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate, onDelete }) => {
  // Parse bi-directional [[Note Title]] wiki links
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\[\[.*?\]\])/g);
    return parts.map((part, idx) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkTitle = part.slice(2, -2);
        return (
          <span
            key={idx}
            className="text-[#D85A2A] dark:text-[#E56B3A] font-bold underline bg-[#D85A2A]/10 px-1 py-0.5 rounded cursor-pointer"
          >
            {linkTitle}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col h-full space-y-4 w-full max-w-full min-w-0 overflow-hidden">
      {/* Note Header Title */}
      <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Note Title..."
          className="bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:outline-none flex-1 mr-4"
        />

        <div className="flex items-center space-x-2">
          <VoiceRecorderButton
            onTranscribeComplete={(text) => {
              const updatedContent = `${note.content}\n\n### 🎙️ Voice Transcription (${new Date().toLocaleTimeString()})\n${text}`;
              onUpdate({ content: updatedContent });
            }}
          />

          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#D93829] dark:hover:text-[#ED4B3B] transition-colors cursor-pointer"
            title="Delete Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tags Input */}
      <div className="flex items-center space-x-2 text-xs">
        <Tag className="w-3.5 h-3.5 text-[#D85A2A] dark:text-[#E56B3A]" />
        <input
          type="text"
          value={note.tags.join(', ')}
          onChange={(e) =>
            onUpdate({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
          }
          placeholder="tags: #mindset, #systems..."
          className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg px-2.5 py-1 text-gray-800 dark:text-gray-200 focus:outline-none flex-1 font-mono text-[11px]"
        />
      </div>

      {/* Main Markdown Textarea */}
      <textarea
        rows={14}
        value={note.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Write markdown thesis or log notes... Use [[Note Title]] for bi-directional links."
        className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white text-xs font-mono leading-relaxed focus:outline-none resize-none flex-1"
      />

      <div className="text-[10px] text-gray-500 text-right">
        Last modified: {new Date(note.updatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
};
