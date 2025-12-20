
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../../types';
import { FocusSection } from '../../types';
import { useNotesHotkeys } from './useNotesHotkeys';

interface NotesViewProps {
  notes: Note[];
  onSaveNote: (noteData: Partial<Note>, editingId?: string) => void;
  onDeleteNote: (id: string) => void;
  focus: { section: FocusSection, index: number };
}

const NotesView: React.FC<NotesViewProps> = ({ notes, onDeleteNote, focus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeIdx = focus.section === 'center' && filteredNotes.length > 0 ? focus.index % filteredNotes.length : -1;

  useEffect(() => {
    if (activeIdx !== -1) {
      noteRefs.current[activeIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIdx]);

  useNotesHotkeys(searchRef);

  return (
    <div className="flex-1 bg-white overflow-y-auto p-10 flex flex-col items-center custom-scrollbar">
      <div className="w-full max-w-6xl mb-10">
        <div className="flex gap-4 items-center">
          <div className="flex-1 bg-gray-100 rounded-full py-4 px-10 border-2 border-gray-200 focus-within:border-gray-800 transition-all shadow-sm">
            <input ref={searchRef} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="TÌM KIẾM GHI CHÚ (/)" className="bg-transparent w-full text-xs font-bold uppercase outline-none" />
          </div>
          <button className="bg-gray-200 px-8 py-4 rounded-full text-xs font-bold uppercase hover:bg-gray-300 transition-all">LỌC</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl pb-20">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30 italic font-black uppercase tracking-tighter">Trống</div>
        ) : (
          filteredNotes.map((note, idx) => (
            <div key={note.id} ref={el => { noteRefs.current[idx] = el; }}
              className={`bg-[#A8A8A8] rounded-[40px] p-8 flex flex-col transition-all duration-300 border-2
                ${idx === activeIdx ? 'border-gray-800 bg-white shadow-2xl scale-[1.02]' : 'border-transparent opacity-100'}`}>
               <div className="flex justify-between items-start mb-1">
                 <h3 className="text-xs font-bold uppercase line-clamp-1">{note.title}</h3>
                 <button onClick={() => onDeleteNote(note.id)} className="text-[9px] font-bold uppercase text-gray-600 hover:text-red-600">XÓA</button>
               </div>
               <p className="text-[10px] uppercase font-bold text-gray-600 mb-1">{note.chatContext}</p>
               <p className="text-[10px] uppercase font-bold text-gray-500 mb-4">{note.createdAt}</p>
               <div className="h-[4px] w-full bg-gray-400/30 rounded-full mb-6 overflow-hidden">
                 <div className="h-full bg-gray-500 w-[60%]"></div>
               </div>
               <div className="space-y-3">
                  {note.summary.split('\n').filter(l => l.trim()).slice(0, 4).map((line, lIdx) => (
                    <div key={lIdx} className="flex gap-2 items-start">
                      <span className="text-sm mt-[-4px]">•</span>
                      <p className="text-[11px] uppercase font-bold leading-tight line-clamp-2">{line.replace(/^•\s*/, '')}</p>
                    </div>
                  ))}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesView;
