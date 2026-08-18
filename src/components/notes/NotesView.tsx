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
      title: 'Untitled Note',
      content: `# Untitled Note\n\nWrite markdown notes or thesis here...\nUse [[Systems Over Motivation Thesis]] for bi-directional links.`,
      tags: ['general'],
      linkedNoteIds: [],
      folder: 'general' as const,
    };
    addNote(newNote);
  };

  const [mobileTab, setMobileTab] = useState<'list' | 'editor' | 'graph'>('list');

  const handleSelectNoteMobile = (id: string) => {
    setSelectedNoteId(id);
    setMobileTab('editor');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Mobile Tab Switcher (< 1024px) */}
      <div className="flex lg:hidden items-center space-x-1.5 p-1 rounded-xl bg-[#F3EFE6] dark:bg-[#1C1A18] border border-[#E2DACD] dark:border-[#332F2B] text-xs font-semibold">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors cursor-pointer ${
            mobileTab === 'list'
              ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          📝 Notes ({notes.length})
        </button>
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors cursor-pointer truncate ${
            mobileTab === 'editor'
              ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          ✏️ {selectedNote ? selectedNote.title : 'Editor'}
        </button>
        <button
          onClick={() => setMobileTab('graph')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-colors cursor-pointer ${
            mobileTab === 'graph'
              ? 'bg-[#D85A2A] dark:bg-[#E56B3A] text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          🕸️ Graph
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[720px]">
        {/* Left Column: Note List (Visible on desktop OR mobile 'list' / 'graph' tabs) */}
        <div className={`lg:col-span-4 rounded-2xl p-4 border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex flex-col justify-between space-y-4 ${
          mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
        }`}>
          {mobileTab !== 'graph' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-900 dark:text-white">
                  <BookOpen className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
                  <span>Notes & Second Brain</span>
                </div>

                <button
                  onClick={handleCreateNote}
                  className="p-1.5 rounded-lg bg-[#D85A2A] hover:bg-[#C44E20] dark:bg-[#E56B3A] dark:hover:bg-[#D85A2A] text-white transition-colors cursor-pointer"
                  title="Create Note"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes or #tags..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Note Item List */}
              <div className="space-y-1 overflow-y-auto max-h-[380px] lg:max-h-[520px] pr-1">
                {filteredNotes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNoteMobile(n.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      n.id === selectedNote?.id
                        ? 'bg-[#D85A2A]/10 border-[#D85A2A]/40 text-[#D85A2A] dark:text-[#E56B3A] font-bold shadow-sm'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold truncate">{n.title}</div>
                    <div className="flex items-center space-x-1 mt-1 text-[10px] text-gray-500">
                      <Tag className="w-2.5 h-2.5" />
                      <span>{n.tags.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bi-Directional Backlinks Graph */}
          <div className={`${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
            <BacklinksGraph notes={notes} selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId} />
          </div>
        </div>

        {/* Right Column: Note Editor (Visible on desktop OR mobile 'editor' tab) */}
        <div className={`lg:col-span-8 h-[600px] lg:h-full ${
          mobileTab !== 'editor' ? 'hidden lg:block' : 'block'
        }`}>
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={(updates) => updateNote(selectedNote.id, updates)}
              onDelete={() => deleteNote(selectedNote.id)}
            />
          ) : (
            <div className="h-full rounded-2xl border border-[#E2DACD] dark:border-[#332F2B] bg-[#F3EFE6] dark:bg-[#1C1A18] flex items-center justify-center text-xs text-gray-500">
              Select or create a note to edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
