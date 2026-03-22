"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { AppTab, Note, FocusSection } from "../types";
import Header from "./components/Navbar";
import Footer from "./components/footer";
import ChatView from "./conversation/page";
import NotesView from "./note-page/page";
import HistoryView from "./history/page";
import GuideModal from "./components/GuideModal";
import { useAppHotkeys } from "../hook/useAppHotkeys";
import { getuserId, createNote, updateNote, deleteNote } from "./api/noteApi";

const USER_QUESTIONS_COUNT = 5;

export default function Home() {
  const tabsArr = Object.values(AppTab);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const micStreamRef = useRef<MediaStream | null>(null);
  const isAnyModalOpen = isGuideOpen;

  const [focus, setFocus] = useState<{ section: FocusSection; index: number }>({
    section: "center",
    index: 0,
  });

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const data = await getuserId(1);

        const formattedNotes = data.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          summary: item.content || "",
          createdAt: item.created_at
            ? new Date(item.created_at).toLocaleDateString("vi-VN")
            : new Date().toLocaleDateString("vi-VN"),
          chatContext: "",
        }));
        setNotes(formattedNotes);
      } catch (error) {
        console.error("Lỗi tải ghi chú từ Database:", error);
      }
    };
    fetchAllNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("app_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const navigationSequence = useMemo(() => {
    const seq: { section: FocusSection; index: number }[] = [];
    tabsArr.forEach((_, i) => seq.push({ section: "header", index: i }));

    if (activeTab === AppTab.CHAT) {
      for (let i = 0; i < 3; i++) seq.push({ section: "left", index: i });
    }

    let centerCount = 1;
    if (activeTab === AppTab.CHAT) centerCount = USER_QUESTIONS_COUNT;
    else if (activeTab === AppTab.NOTES)
      centerCount = Math.max(1, notes.length);
    else if (activeTab === AppTab.HISTORY) centerCount = 6;
    for (let i = 0; i < centerCount; i++)
      seq.push({ section: "center", index: i });

    if (isSidebarOpen) {
      const noteCount = Math.max(1, notes.length);
      for (let i = 0; i < noteCount; i++)
        seq.push({ section: "right", index: i });
    }

    for (let i = 0; i < 4; i++) seq.push({ section: "footer", index: i });
    return seq;
  }, [activeTab, isSidebarOpen, notes.length, tabsArr]);

  const currentIndex = navigationSequence.findIndex(
    (s) => s.section === focus.section && s.index === focus.index,
  );

  const moveNext = () => {
    const nextIdx = (currentIndex + 1) % navigationSequence.length;
    setFocus(navigationSequence[nextIdx]);
  };

  const movePrev = () => {
    const prevIdx =
      (currentIndex - 1 + navigationSequence.length) %
      navigationSequence.length;
    setFocus(navigationSequence[prevIdx]);
  };

  const toggleMic = async () => {
    if (isMicActive) {
      micStreamRef.current?.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
      setIsMicActive(false);
    } else {
      if (confirm("BẠN CÓ ĐỒNG Ý BẬT MICROPHONE?")) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          micStreamRef.current = stream;
          setIsMicActive(true);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useAppHotkeys({
    isAnyModalOpen,
    moveNext,
    movePrev,
    toggleSidebar,
    toggleMic,
    setIsGuideOpen,
    setActiveTab,
    focus,
  });

  const handleSaveNote = async (
    noteData: Partial<Note>,
    editingId?: string,
  ) => {
    try {
      if (editingId) {
        await updateNote(Number(editingId), noteData.title || "");
        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingId ? ({ ...n, ...noteData } as Note) : n,
          ),
        );
      } else {
        const newDatabaseNote = await createNote(
          1,
          noteData.title || " GHI CHÚ MỚI ",
          noteData.summary || "",
        );
        const newNote: Note = {
          id: newDatabaseNote.id.toString(),
          title: newDatabaseNote.title || noteData.title || "GHI CHÚ MỚI",
          chatContext: noteData.chatContext || "TRÒ CHUYỆN HIỆN TẠI",
          createdAt: new Date().toLocaleDateString("vi-VN"),
          summary: newDatabaseNote.content || noteData.summary || "",
        };
        setNotes((prev) => [newNote, ...prev]);
      }
    } catch (error) {
      console.error("Lỗi khi lưu ghi chú vào database", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA GHI CHÚ NÀY?")) {
      try {
        await deleteNote(Number(id));
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa ghi chú:", error);
      }
    }
  };

  const renderContent = () => {
    const commonProps = {
      notes,
      onSaveNote: handleSaveNote,
      onDeleteNote: handleDeleteNote,
      isSidebarOpen,
      focus,
      setFocus,
    };

    switch (activeTab) {
      case AppTab.CHAT:
        return <ChatView {...commonProps} isModalOpen={isAnyModalOpen} />;
      case AppTab.NOTES:
        return <NotesView {...commonProps} />;
      case AppTab.HISTORY:
        return <HistoryView {...commonProps} />;
      default:
        return <div className="flex-1 bg-white" />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-black font-sans antialiased relative">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFocused={!isAnyModalOpen && focus.section === "header"}
        focusedIndex={focus.index}
      />

      <div className="border-b border-gray-200 py-4 px-8 flex justify-between items-center shrink-0 bg-[#F9F9F9]">
        <h1 className="text-[12px] font-black uppercase text-gray-800">
          {activeTab}
        </h1>
        <div className="flex gap-6 items-center"></div>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
        {renderContent()}
      </main>

      <Footer
        isMicActive={isMicActive}
        onToggleMic={toggleMic}
        onToggleNotes={toggleSidebar}
        onShowGuide={() => setIsGuideOpen(true)}
        isFocused={!isAnyModalOpen && focus.section === "footer"}
        focusedIndex={focus.index}
      />
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
    </div>
  );
}
