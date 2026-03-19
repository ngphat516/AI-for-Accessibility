import React, { useState, useEffect, useRef } from "react";
import { Note } from "../../types";
import { useSidebarNotesHotkeys } from "./useSidebarNotesHotkeys";

interface SidebarNotesProps {
  notes: Note[];
  onSaveNote: (noteData: Partial<Note>, editingId?: string) => void;
  onDeleteNote: (id: string) => void;
  isFocused?: boolean;
  focusedIndex?: number;
}

const SidebarNotes: React.FC<SidebarNotesProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  isFocused,
  focusedIndex,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState<string | "new" | null>(null);
  const [formData, setFormData] = useState<Partial<Note>>({});
  const editRef = useRef<HTMLInputElement>(null);
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeIdx =
    isFocused && !editId && filteredNotes.length > 0
      ? (focusedIndex ?? 0) % filteredNotes.length
      : -1;

  useEffect(() => {
    if (activeIdx !== -1) {
      noteRefs.current[activeIdx]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIdx]);

  const handleStartCreate = () => {
    setFormData({
      title: "",
      chatContext: "THUỘC VỀ ĐOẠN CHAT NÀO",
      summary: "",
      createdAt: new Date().toLocaleDateString("vi-VN"),
    });
    setEditId("new");
  };

  const handleStartEdit = (note: Note) => {
    setFormData(note);
    setEditId(note.id);
  };

  const handleSave = () => {
    if (!formData.title && !formData.summary) {
      setEditId(null);
      return;
    }
    onSaveNote(formData, editId === "new" ? undefined : (editId as string));
    setEditId(null);
  };

  useSidebarNotesHotkeys({
    isFocused,
    editId,
    handleStartCreate,
    setEditId,
  });

  useEffect(() => {
    if (editId) editRef.current?.focus();
  }, [editId]);

  return (
    <div
      className={`h-full p-6 flex flex-col gap-5 transition-colors duration-300 ${isFocused ? "bg-[#C8C8C8]" : "bg-[#D6D6D6]"}`}
    >
      <div className="space-y-4">
        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">
          GHI CHÚ
        </p>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="TÌM KIẾM"
          className="w-full bg-[#BDBDBD] border-none rounded-full py-3 px-8 text-[11px] font-bold uppercase outline-none placeholder-gray-600 focus:bg-white focus:ring-2 ring-gray-400 transition-all shadow-inner"
        />

        <div className="flex gap-2">
          <button className="bg-[#BDBDBD] px-6 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-gray-400 transition-all shadow-sm">
            LỌC
          </button>
          {!editId && (
            <button
              onClick={handleStartCreate}
              className="bg-gray-800 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-black ml-auto transition-all shadow-md active:scale-95"
            >
              + MỚI (ALT+N)
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {editId && (
          <div className="bg-[#AFAFAF] rounded-[40px] p-8 border-4 border-gray-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <input
              ref={editRef}
              className="bg-transparent border-none outline-none text-xs font-black uppercase w-full mb-1 placeholder-gray-700"
              placeholder="TIÊU ĐỀ..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              className="bg-transparent border-none outline-none text-[10px] uppercase font-bold text-gray-700 w-full mb-1"
              placeholder="THUỘC VỀ ĐOẠN CHAT NÀO..."
              value={formData.chatContext}
              onChange={(e) =>
                setFormData({ ...formData, chatContext: e.target.value })
              }
            />
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-4">
              {formData.createdAt}
            </p>

            <div className="h-[4px] w-full bg-gray-600/20 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-gray-800 w-1/2"></div>
            </div>

            <textarea
              className="bg-transparent border-none outline-none text-[11px] uppercase font-bold leading-relaxed w-full min-h-[150px] resize-none placeholder-gray-700"
              placeholder="• NHẬP NỘI DUNG GHI CHÚ..."
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gray-800 text-white text-[10px] font-bold py-3 rounded-full uppercase shadow-lg active:scale-95"
              >
                LƯU
              </button>
              <button
                onClick={() => setEditId(null)}
                className="flex-1 bg-white/20 border border-gray-600 text-[10px] font-bold py-3 rounded-full uppercase active:scale-95"
              >
                HỦY
              </button>
            </div>
          </div>
        )}

        {filteredNotes.length === 0 && !editId ? (
          <div className="text-center py-24 opacity-20">
            <p className="text-[11px] uppercase font-black tracking-widest">
              Trống
            </p>
          </div>
        ) : (
          filteredNotes.map(
            (note, idx) =>
              editId !== note.id && (
                <div
                  key={note.id}
                  ref={(el) => {
                    noteRefs.current[idx] = el;
                  }}
                  className={`rounded-[40px] p-8 transition-all duration-300 border-4 relative group
                  ${idx === activeIdx ? "bg-white border-gray-800 shadow-2xl scale-[1.03] z-10" : "bg-[#AFAFAF] border-transparent shadow-md hover:bg-[#B8B8B8]"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-black uppercase line-clamp-1 flex-1">
                      {note.title}
                    </h3>
                    <div className="flex gap-4 ml-4 shrink-0 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="text-[10px] font-black uppercase text-gray-700 hover:text-black hover:underline underline-offset-4"
                      >
                        CHỈNH SỬA
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-[10px] font-black uppercase text-gray-500 hover:text-red-700"
                      >
                        XÓA
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] uppercase font-bold text-gray-600 mb-1">
                    {note.chatContext}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-4">
                    {note.createdAt}
                  </p>

                  <button className="bg-[#D8D8D8] px-8 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 shadow-sm border border-black/5 hover:bg-white transition-all">
                    LINK
                  </button>

                  <div className="h-[4px] w-full bg-gray-400/30 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-gray-600 w-[45%]"></div>
                  </div>

                  <div className="space-y-3">
                    {note.summary
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, lIdx) => (
                        <div key={lIdx} className="flex gap-3 items-start">
                          <span className="text-[14px] mt-[-3px] text-gray-900">
                            •
                          </span>
                          <p className="text-[11px] uppercase font-bold leading-tight text-gray-800">
                            {line.replace(/^•\s*/, "")}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ),
          )
        )}
      </div>
    </div>
  );
};

export default SidebarNotes;
