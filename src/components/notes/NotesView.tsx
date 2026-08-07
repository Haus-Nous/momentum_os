import React, { useState } from 'react';
import { BookOpen, Plus, FileText, Search, Tag } from 'lucide-react';
import { useMomentumStore } from '../../store/useMomentumStore';
import { NoteEditor } from './NoteEditor';
import { BacklinksGraph } from './BacklinksGraph';

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useMomentumStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = () => {
    const newNote = {
      title: 'Untitled Note Protocol',
      content: `# Untitled Note\n\nWrite markdown notes or thesis here...\nUse [[Systems Over Motivation Thesis]] for bi-directional links.`,
      tags: ['general'],
      linkedNoteIds: [],
      folder: 'general' as const,
    };
    addNote(newNote);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Column: Note List */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Knowledge Graph</span>
              </div>

              <button
                onClick={handleCreateNote}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                title="Create Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes or #tags..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            {/* Note List */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500/50 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="truncate flex-1">{note.title}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-gray-400">
                      <Tag className="w-3 h-3 text-purple-400" />
                      <span className="truncate">{note.tags.join(', ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bi-Directional Backlinks Graph */}
          <BacklinksGraph notes={notes} selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId} />
        </div>

        {/* Right Column: Note Editor */}
        <div className="lg:col-span-8 h-full">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={(updates) => updateNote(selectedNote.id, updates)}
              onDelete={() => deleteNote(selectedNote.id)}
            />
          ) : (
            <div className="h-full glass-card rounded-2xl flex items-center justify-center text-xs text-gray-500">
              Select or create a note to edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
