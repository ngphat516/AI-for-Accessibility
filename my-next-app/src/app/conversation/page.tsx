
import React, { useRef, useState, useEffect, useMemo } from 'react';
import SidebarNotes from '../components/SideBarNotes';
import SidebarAI from '../components/SidebarAI';
import { Note } from '../../types';
import { FocusSection } from '../../types';
import { useChatHotkeys } from './useChatHotkeys';
import { createMessage, chatMessage, chatMessageId} from '../api/chatMessagesApi';
import { createConversation } from '../api/conversationApi';
import { createNote, getuserId, updateNote, deleteNote } from '../api/noteApi';
import { getNoteMessageSources, deleteNoteMessageSources, createNoteMessageSources } from '../api/noteMessageSourcesApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ChatViewProps {
  isSidebarOpen: boolean; 
  focus: { section: FocusSection, index: number };
  setFocus: React.Dispatch<React.SetStateAction<{ section: FocusSection, index: number }>>;
  isModalOpen?: boolean;
}

interface Source{
  id: string;
  title: string;
  snippet ?: string;
}

const SAMPLE_MESSAGES: Message[] = [
  { id: '1', role: 'user', content: 'NỘI DUNG ĐỂ TEST.', time: '14:20' },
  { id: '2', role: 'assistant', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et dapibus tortor. Quisque elementum ipsum enim, ut tincidunt lectus rhoncus sed. Duis vulputate non sapien quis fermentum. Aenean libero nunc, ultricies eget mi ut, sagittis luctus metus. Phasellus elit orci, mollis eget sapien ac, pellentesque ultricies dui. Curabitur in ipsum augue. Donec rutrum ante dolor, nec suscipit nulla pharetra in. Praesent et magna blandit, consequat metus ut, mattis metus. Fusce viverra malesuada lorem, vel dignissim eros varius sed. Nam efficitur, quam vel aliquam tincidunt, tellus ante tristique ipsum, a lacinia justo neque non tortor. Cras feugiat tortor eu tortor rutrum cursus. Aenean faucibus nibh purus, tempus commodo lorem ullamcorper quis. Aenean ac metus massa. Sed rutrum orci nec tortor molestie, commodo efficitur augue sagittis. Cras eget ornare massa. Cras sit amet libero nunc. Cras elementum dapibus consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eget commodo ligula, nec pulvinar tellus. Integer iaculis laoreet mauris, nec efficitur est porta at. Praesent fringilla tortor nisl, in sollicitudin risus vulputate vitae. Integer pulvinar eu est sit amet laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam consequat tempus metus, nec eleifend sapien consequat at. Sed rutrum vel nisl et lacinia. Integer scelerisque aliquam turpis vel luctus. Integer venenatis, est vel accumsan pulvinar, libero massa ullamcorper nulla, ac sodales ex nibh ac lorem. Morbi facilisis lacus urna. Duis condimentum blandit mi, eget pharetra orci dignissim non. Aenean in sollicitudin est. Etiam imperdiet ex vitae ipsum commodo, quis bibendum sem faucibus. Ut in ipsum id enim gravida fermentum. Suspendisse sodales orci non mattis rhoncus. Mauris sodales cursus odio, non auctor nibh eleifend sit amet. Cras sed nisi consequat, ultricies erat at, vestibulum odio. Sed viverra interdum eros, at tincidunt odio fringilla non. Nullam ut ligula vel urna dictum luctus. Nunc gravida, diam sit amet semper blandit, dui nibh pretium urna, sed fermentum tellus leo nec tellus. Maecenas cursus consequat dui, sed consectetur erat maximus ac. Sed dapibus dui at urna venenatis, vel porttitor eros viverra. Duis et enim dictum, maximus erat nec, ultricies nibh. Pellentesque eget elementum dui, in volutpat libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus lacinia efficitur lorem tincidunt sollicitudin. Aliquam erat volutpat. Cras eu est auctor, finibus risus quis, efficitur nibh. Praesent posuere, justo non euismod cursus, risus velit viverra lorem, at tempus sapien massa eget libero. Aliquam viverra lorem at sapien dapibus, a pretium purus volutpat. Morbi elementum in arcu sollicitudin vulputate. Curabitur auctor, est ut dictum vulputate, felis justo efficitur odio, nec consequat libero orci vel dolor. Donec egestas pretium feugiat. Integer feugiat augue libero, in euismod odio semper eget. Vivamus interdum condimentum turpis, quis accumsan enim fringilla ac.', time: '14:21' },
  { id: '3', role: 'user', content: 'NỘI DUNG ĐỂ TEST.', time: '14:20' },
  { id: '4', role: 'assistant', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et dapibus tortor. Quisque elementum ipsum enim, ut tincidunt lectus rhoncus sed. Duis vulputate non sapien quis fermentum. Aenean libero nunc, ultricies eget mi ut, sagittis luctus metus. Phasellus elit orci, mollis eget sapien ac, pellentesque ultricies dui. Curabitur in ipsum augue. Donec rutrum ante dolor, nec suscipit nulla pharetra in. Praesent et magna blandit, consequat metus ut, mattis metus. Fusce viverra malesuada lorem, vel dignissim eros varius sed. Nam efficitur, quam vel aliquam tincidunt, tellus ante tristique ipsum, a lacinia justo neque non tortor. Cras feugiat tortor eu tortor rutrum cursus. Aenean faucibus nibh purus, tempus commodo lorem ullamcorper quis. Aenean ac metus massa. Sed rutrum orci nec tortor molestie, commodo efficitur augue sagittis. Cras eget ornare massa. Cras sit amet libero nunc. Cras elementum dapibus consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eget commodo ligula, nec pulvinar tellus. Integer iaculis laoreet mauris, nec efficitur est porta at. Praesent fringilla tortor nisl, in sollicitudin risus vulputate vitae. Integer pulvinar eu est sit amet laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam consequat tempus metus, nec eleifend sapien consequat at. Sed rutrum vel nisl et lacinia. Integer scelerisque aliquam turpis vel luctus. Integer venenatis, est vel accumsan pulvinar, libero massa ullamcorper nulla, ac sodales ex nibh ac lorem. Morbi facilisis lacus urna. Duis condimentum blandit mi, eget pharetra orci dignissim non. Aenean in sollicitudin est. Etiam imperdiet ex vitae ipsum commodo, quis bibendum sem faucibus. Ut in ipsum id enim gravida fermentum. Suspendisse sodales orci non mattis rhoncus. Mauris sodales cursus odio, non auctor nibh eleifend sit amet. Cras sed nisi consequat, ultricies erat at, vestibulum odio. Sed viverra interdum eros, at tincidunt odio fringilla non. Nullam ut ligula vel urna dictum luctus. Nunc gravida, diam sit amet semper blandit, dui nibh pretium urna, sed fermentum tellus leo nec tellus. Maecenas cursus consequat dui, sed consectetur erat maximus ac. Sed dapibus dui at urna venenatis, vel porttitor eros viverra. Duis et enim dictum, maximus erat nec, ultricies nibh. Pellentesque eget elementum dui, in volutpat libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus lacinia efficitur lorem tincidunt sollicitudin. Aliquam erat volutpat. Cras eu est auctor, finibus risus quis, efficitur nibh. Praesent posuere, justo non euismod cursus, risus velit viverra lorem, at tempus sapien massa eget libero. Aliquam viverra lorem at sapien dapibus, a pretium purus volutpat. Morbi elementum in arcu sollicitudin vulputate. Curabitur auctor, est ut dictum vulputate, felis justo efficitur odio, nec consequat libero orci vel dolor. Donec egestas pretium feugiat. Integer feugiat augue libero, in euismod odio semper eget. Vivamus interdum condimentum turpis, quis accumsan enim fringilla ac.', time: '14:21' },
  { id: '5', role: 'user', content: 'NỘI DUNG ĐỂ TEST.', time: '14:20' },
  { id: '6', role: 'assistant', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et dapibus tortor. Quisque elementum ipsum enim, ut tincidunt lectus rhoncus sed. Duis vulputate non sapien quis fermentum. Aenean libero nunc, ultricies eget mi ut, sagittis luctus metus. Phasellus elit orci, mollis eget sapien ac, pellentesque ultricies dui. Curabitur in ipsum augue. Donec rutrum ante dolor, nec suscipit nulla pharetra in. Praesent et magna blandit, consequat metus ut, mattis metus. Fusce viverra malesuada lorem, vel dignissim eros varius sed. Nam efficitur, quam vel aliquam tincidunt, tellus ante tristique ipsum, a lacinia justo neque non tortor. Cras feugiat tortor eu tortor rutrum cursus. Aenean faucibus nibh purus, tempus commodo lorem ullamcorper quis. Aenean ac metus massa. Sed rutrum orci nec tortor molestie, commodo efficitur augue sagittis. Cras eget ornare massa. Cras sit amet libero nunc. Cras elementum dapibus consectetur. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed eget commodo ligula, nec pulvinar tellus. Integer iaculis laoreet mauris, nec efficitur est porta at. Praesent fringilla tortor nisl, in sollicitudin risus vulputate vitae. Integer pulvinar eu est sit amet laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam consequat tempus metus, nec eleifend sapien consequat at. Sed rutrum vel nisl et lacinia. Integer scelerisque aliquam turpis vel luctus. Integer venenatis, est vel accumsan pulvinar, libero massa ullamcorper nulla, ac sodales ex nibh ac lorem. Morbi facilisis lacus urna. Duis condimentum blandit mi, eget pharetra orci dignissim non. Aenean in sollicitudin est. Etiam imperdiet ex vitae ipsum commodo, quis bibendum sem faucibus. Ut in ipsum id enim gravida fermentum. Suspendisse sodales orci non mattis rhoncus. Mauris sodales cursus odio, non auctor nibh eleifend sit amet. Cras sed nisi consequat, ultricies erat at, vestibulum odio. Sed viverra interdum eros, at tincidunt odio fringilla non. Nullam ut ligula vel urna dictum luctus. Nunc gravida, diam sit amet semper blandit, dui nibh pretium urna, sed fermentum tellus leo nec tellus. Maecenas cursus consequat dui, sed consectetur erat maximus ac. Sed dapibus dui at urna venenatis, vel porttitor eros viverra. Duis et enim dictum, maximus erat nec, ultricies nibh. Pellentesque eget elementum dui, in volutpat libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus lacinia efficitur lorem tincidunt sollicitudin. Aliquam erat volutpat. Cras eu est auctor, finibus risus quis, efficitur nibh. Praesent posuere, justo non euismod cursus, risus velit viverra lorem, at tempus sapien massa eget libero. Aliquam viverra lorem at sapien dapibus, a pretium purus volutpat. Morbi elementum in arcu sollicitudin vulputate. Curabitur auctor, est ut dictum vulputate, felis justo efficitur odio, nec consequat libero orci vel dolor. Donec egestas pretium feugiat. Integer feugiat augue libero, in euismod odio semper eget. Vivamus interdum condimentum turpis, quis accumsan enim fringilla ac.', time: '14:21' },
];

const ChatView: React.FC<ChatViewProps> = ({ isSidebarOpen, focus, setFocus, isModalOpen }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timelineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const [globalWordIdx, setGlobalWordIdx] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [notes, setNotes] = useState<Note[]>([])
  const [sources, setSources] = useState<Source[]>([])

// chatmessages.ts
  useEffect(() => {
    const fetchChatHistory = async () => {
        try{
          const data = await chatMessage();
          const formattedMessages = data.map((msg: any) => ({
            id : msg.id.toString(),
            role: msg.role,
            content: msg.content || "",
            time: msg.create_at ? new Date(msg.create_at).toLocaleDateString([], { hour : '2-digit', minute: '2-digit'}) : "Vừa xong"
      }));
          setMessages(formattedMessages);
          } catch (error) {
          console.error("Lỗi khi tải lịch sử tin nhắn:", error)
        }
    }
    fetchChatHistory();
   }, [])

  const handleSendMessages = async (text: string) => {
    try {
      const data = await createMessage(1, text);  
      const newMsg: Message = {
        id: data.id ? data.id.toString() : Date.now().toString(),
        role: 'user', 
        content: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, newMsg]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  }


//noteApi.ts
  useEffect(() => {
      const fetchNotes = async () => {
        try {
          const data = await getuserId(1);

          const formattedNotes = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            summary: item.content || "", // Tùy backend bạn lưu nội dung ở trường nào
            createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString() : "",
            chatContext: ""
          }));
            setNotes(formattedNotes)
        }
        catch (error){
          console.error("Lỗi tải ghi chú:", error)
        }
      };
      fetchNotes();
  }, [])

  const handleSaveNote = async (noteData: Partial<Note>, editingId?: string) => {
    try {
      if (editingId) {
        await updateNote(Number(editingId), noteData.title || "");
        setNotes(notes.map(n => n.id === editingId ? { ...n, ...noteData } : n));
      } else {
        const newNote = await createNote(1, noteData.title || "Không có tiêu đề", noteData.summary || "");
        const formattedNewNote: Note = {
          id: newNote.id.toString(),
          title: newNote.title,
          summary: newNote.content || noteData.summary || "",
          createdAt: new Date().toLocaleDateString(),
          chatContext: ""
        };
        setNotes([...notes, formattedNewNote]);
      }
    } catch (error) {
      console.error("Lỗi khi lưu ghi chú:", error);
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(Number(id));
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa ghi chú:", error);
    }
  };

// noteMessageSourcesApi.ts
  useEffect(() => {
    const fetchSources = async () => {
      try{
        const data = await getNoteMessageSources(1);
        const formattedSources = data.map((item:any) => ({
          id:item.id.toString(),
          title: item.title || "Tài liệu tham khảo",
          snippet: item.content || "Nội dung trích xuất"
        }));
        setSources(formattedSources)
      }
      catch (error){
          console.error("Lỗi khi tải tài liệu nguồn:", error);
      } 
    }
    fetchSources();
  }, [])

  const handleAddSources = async (noteId:number, chatMessageId: number ) => {
      try{
        await createNoteMessageSources(noteId, chatMessageId); 
        console.log("Thêm tài liệu thành công!");
      }
      catch (error){
        console.error("Lỗi khi thêm tài liệu:", error)
      }
  }

  const handleDeleteSources = async (noteId: number, chatMessageId: number) => {
    try{
      await deleteNoteMessageSources(noteId, chatMessageId);
      setSources(sources.filter( x => x.id !== noteId.toString()));
      console.log("Xóa tài liệu thành công!");
    }
    catch (error){
      console.error("Lỗi khi xóa tài liệu:", error);
    }
  }

//end
  const flattenedWords = useMemo(() => {
    const words: { msgIdx: number; wordIdx: number; text: string }[] = [];
    SAMPLE_MESSAGES.forEach((msg, mIdx) => {
      msg.content.split(/\s+/).forEach((word, wIdx) => {
        words.push({ msgIdx: mIdx, wordIdx: wIdx, text: word });
      });
    });
    return words;
  }, [messages]);

  const isCenterFocused = focus.section === 'center';
  const userMessageIndices = useMemo(() => {
    return SAMPLE_MESSAGES.map((m, i) => m.role === 'user' ? i : -1).filter(i => i !== -1);
  }, [messages]);

  const getDotIdxFromWord = (wordIdx: number) => {
    const msgIdx = flattenedWords[wordIdx]?.msgIdx ?? 0;
    const latestUserIdx = [...userMessageIndices].reverse().find(idx => idx <= msgIdx);
    return latestUserIdx !== undefined ? userMessageIndices.indexOf(latestUserIdx) : 0;
  };

  useEffect(() => {
    if (isCenterFocused && !isInputFocused) {
      const targetUserMsgIdx = userMessageIndices[focus.index % userMessageIndices.length];
      const currentWordMsgIdx = flattenedWords[globalWordIdx].msgIdx;
      const ownerMsgIdx = [...userMessageIndices].reverse().find(idx => idx <= currentWordMsgIdx);
      if (ownerMsgIdx !== targetUserMsgIdx) {
        const firstWordIdx = flattenedWords.findIndex(w => w.msgIdx === targetUserMsgIdx);
        if (firstWordIdx !== -1) setGlobalWordIdx(firstWordIdx);
      }
    }
  }, [focus.index]);

  const moveWord = (nextIdx: number) => {
    setGlobalWordIdx(nextIdx);
    const targetDotIdx = getDotIdxFromWord(nextIdx);
    if (focus.index !== targetDotIdx) {
      setFocus(f => ({ ...f, index: targetDotIdx }));
    }
  };

  const canNav = isCenterFocused && !isInputFocused && !isModalOpen;

  useChatHotkeys({
    inputRef,
    isModalOpen,
    isInputFocused,
    canNav,
    globalWordIdx,
    messageCount: messages.length,
    moveWord,
    flattenedWords
  });

  useEffect(() => {
    if (isCenterFocused && !isModalOpen) {
      document.getElementById(`word-${globalWordIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timelineIdx = focus.index % userMessageIndices.length;
      timelineRefs.current[timelineIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [globalWordIdx, focus.index, isCenterFocused, isModalOpen]);

  return (
    <div className="flex-1 flex overflow-hidden w-full">
      <SidebarAI sources={sources} isFocused={!isModalOpen && focus.section === 'left'} focusedIndex={focus.index} />
      <div className={`flex-1 flex flex-col bg-white overflow-hidden transition-all relative ${isCenterFocused && !isModalOpen ? 'bg-gray-50' : ''}`}>
        <div className="flex-1 flex overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6 pb-32 pt-10">
              {messages.map((msg, mIdx) => {
                const isMsgFocused = flattenedWords[globalWordIdx]?.msgIdx === mIdx && isCenterFocused;
                const msgWords = msg.content.split(/\s+/);
                let wordBaseIdx = 0;
                for(let i=0; i<mIdx; i++) wordBaseIdx += messages[i].content.split(/\s+/).length;

                return (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[24px] border-2 transition-all duration-300 relative
                        ${msg.role === 'user' ? 'bg-gray-800 text-white border-transparent' : 'bg-white text-black border-gray-200 shadow-sm'}
                        ${isMsgFocused ? 'border-indigo-400 ring-2 ring-indigo-50/30' : 'border-transparent'}`}>
                      <div className="flex flex-wrap gap-x-1 gap-y-1">
                        {msgWords.map((word, wIdx) => {
                          const idx = wordBaseIdx + wIdx;
                          const active = globalWordIdx === idx && isCenterFocused;
                          return (
                            <span id={`word-${idx}`} key={wIdx} className={`text-[12px] font-bold uppercase tracking-tight transition-colors duration-200 px-0.5 rounded
                                ${active ? (msg.role === 'user' ? 'text-indigo-300 bg-white/10' : 'text-indigo-600 bg-indigo-50') : ''}`}>
                              {word}
                            </span>
                          );
                        })}
                      </div>
                      <div className={`text-[8px] mt-3 font-bold opacity-30 flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.role.toUpperCase()} • {msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-12 bg-white/40 border-l border-gray-100 flex flex-col items-center py-10 relative shrink-0">
            <div className="absolute top-0 bottom-0 w-[1px] bg-gray-200 left-1/2 -translate-x-1/2"></div>
            <div className="flex flex-col gap-4 relative z-10 overflow-y-auto no-scrollbar py-4 h-full">
              {userMessageIndices.map((msgIdx, uIdx) => {
                const active = isCenterFocused && (focus.index % userMessageIndices.length) === uIdx;
                return (
                  <button key={msgIdx} ref={el => { timelineRefs.current[uIdx] = el; }}
                    onClick={() => {
                      const first = flattenedWords.findIndex(w => w.msgIdx === msgIdx);
                      if (first !== -1) setGlobalWordIdx(first);
                      setFocus({ section: 'center', index: uIdx });
                    }}
                    className="group relative flex items-center justify-center outline-none">
                    <div className={`w-2.5 h-6 rounded-full transition-all duration-300
                        ${active ? 'bg-gray-900 scale-110 ring-2 ring-gray-200' : 'bg-gray-300 opacity-60'}`}></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <input ref={inputRef} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}
                type="text" placeholder="NHẬP NỘI DUNG..."
                className="w-full bg-gray-100 border-2 rounded-full py-4 px-8 text-[12px] font-bold uppercase outline-none focus:bg-white focus:border-gray-800 transition-all" 
                onKeyDown={
                  (e) => {
                    if (e.key == 'Enter'){
                      const text = e.currentTarget.value;
                      handleSendMessages(text);
                      e.currentTarget.value=''
                    }
                  }
                }
                />
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 border-l border-gray-200 overflow-hidden shrink-0 ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
        <div className="w-80 h-full">
           <SidebarNotes notes={notes} onSaveNote={handleSaveNote} onDeleteNote={handleDeleteNote} isFocused={!isModalOpen && focus.section === 'right'} focusedIndex={focus.index} />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
