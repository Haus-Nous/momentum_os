import React from 'react';
import { Save, Trash2, Tag, BookOpen, Link2 } from 'lucide-react';
import { Note } from '../../types';

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
            className="text-indigo-400 font-bold underline bg-indigo-500/10 px-1 py-0.5 rounded cursor-pointer hover:text-indigo-300"
          >
            {linkTitle}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col h-full space-y-4">
      {/* Note Header Title */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Note Title..."
          className="bg-transparent text-lg font-bold text-white focus:outline-none flex-1 mr-4"
        />

        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-white/10 transition-colors"
          title="Delete Note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tags Input */}
      <div className="flex items-center space-x-2 text-xs">
        <Tag className="w-3.5 h-3.5 text-purple-400" />
        <input
          type="text"
          value={note.tags.join(', ')}
          onChange={(e) =>
            onUpdate({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
          }
          placeholder="tags: #mindset, #systems..."
          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-gray-300 focus:outline-none flex-1 font-mono text-[11px]"
        />
      </div>

      {/* Main Markdown Textarea */}
      <textarea
        rows={14}
        value={note.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        placeholder="Write markdown thesis or log notes... Use [[Note Title]] for bi-directional links."
        className="w-full bg-white/2 border border-white/5 rounded-xl p-4 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500/40 resize-none flex-1"
      />

      <div className="text-[10px] text-gray-500 text-right">
        Last modified: {new Date(note.updatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
};
