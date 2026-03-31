"use client";

import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import TypeToggle from "./components/top-bar/TypeToggle";
import SearchBar from "./components/top-bar/SearchBar";
import TopicPool from "./components/filter-bar/TopicPool";
import GroupGrid from "./components/display/groups/GroupGrid";
import ChannelGrid from "./components/display/channels/ChannelGrid";

import CreateChannelController from "./components/create/channels";
import CreateGroupController from "./components/create/groups";

import GroupChatContainer from "./components/display/groups/group-chat/GroupChatContainer";
import ChannelChatContainer from "./components/display/channels/channel-chat/ChannelChatContainer";

export default function CommunitiesPage() {
  const [activeType, setActiveType] = useState<"Groups" | "Channels">("Channels");
  const [activeTopic, setActiveTopic] = useState("Feed");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTypeChange = (type: "Groups" | "Channels") => {
    setActiveType(type);
    setActiveTopic("Feed");
    setSearchQuery("");
  };
  
  const [activeGroupChat, setActiveGroupChat] = useState<any>(null);
  const [activeChannelChat, setActiveChannelChat] = useState<any>(null);


  const [createMode, setCreateMode] = useState<"Channel" | "Group" | null>(null);

  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const savedScrollRef = useRef<number>(0); // remembers scroll position before opening a chat

  // Scroll to top only on type/create switches — NOT when closing chats
  useEffect(() => {
    const el = document.querySelector("main");
    if (el) el.scrollTop = 0;
  }, [activeType, createMode]);

  // ── Open chat: save current scroll position ──────────────────────
  const openGroupChat = (group: any) => {
    const el = document.querySelector("main");
    savedScrollRef.current = el?.scrollTop ?? 0;
    setActiveGroupChat(group);
  };

  const openChannelChat = (channel: any) => {
    const el = document.querySelector("main");
    savedScrollRef.current = el?.scrollTop ?? 0;
    setActiveChannelChat(channel);
  };

  // ── Close chat: restore saved scroll position ─────────────────────
  const closeGroupChat = () => {
    setActiveGroupChat(null);
    setActiveTopic("Feed");
    requestAnimationFrame(() => {
      const el = document.querySelector("main");
      if (el) el.scrollTop = savedScrollRef.current;
    });
  };

  const closeChannelChat = () => {
    setActiveChannelChat(null);
    setActiveTopic("Feed");
    requestAnimationFrame(() => {
      const el = document.querySelector("main");
      if (el) el.scrollTop = savedScrollRef.current;
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isChatActive = activeGroupChat || activeChannelChat;

  return (
    <main className="relative w-full bg-[#FDFBF7] flex flex-col pt-2 text-[#1c1917] transition-colors duration-200">
      
      {/* 🔴 THE FIX: If createMode is active, we completely hide the feed and ONLY render the creator. No absolute positioning needed! */}
      {!createMode ? (
        <div className="flex flex-col flex-1 w-full">
          
          {!isChatActive && (
            <>
              {/* --- TOP BAR --- */}
              <div className="w-full px-6 h-16 -mt-6 flex items-center justify-between bg-transparent mb-2 z-50 relative">
                <div className="flex items-center h-full">
                  <TypeToggle active={activeType} onTypeChange={handleTypeChange} />
                </div>

                <div className="flex items-center gap-3 relative">
                  <SearchBar placeholder={`Search ${activeType.toLowerCase()}...`} width="w-60" value={searchQuery} onChange={setSearchQuery} />
                  <div className="h-5 w-[1px] bg-stone-200/50 mx-1" />

                  <div className="relative" ref={menuRef}>
                    <button 
                      onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-stone-200"
                    >
                      <Plus size={14} strokeWidth={3} /> Create
                    </button>

                    {isCreateMenuOpen && (
                      <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.10)] border border-stone-200/60 z-[100] p-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">

                        {/* New Channel */}
                        <button
                          onClick={() => { setCreateMode("Channel"); setIsCreateMenuOpen(false); }}
                          className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] text-left"
                        >
                          <div className="w-9 h-9 bg-blue-50 rounded-xl group-hover:bg-blue-500 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-blue-200 transition-all duration-200 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="4" y1="7" x2="16" y2="7" className="stroke-blue-400 group-hover:stroke-white transition-colors duration-200" strokeWidth="2" />
                              <line x1="4" y1="13" x2="16" y2="13" className="stroke-blue-400 group-hover:stroke-white transition-colors duration-200" strokeWidth="2" />
                              <line x1="7.5" y1="3.5" x2="6" y2="16.5" className="stroke-blue-400 group-hover:stroke-white transition-colors duration-200" strokeWidth="2" />
                              <line x1="14" y1="3.5" x2="12.5" y2="16.5" className="stroke-blue-400 group-hover:stroke-white transition-colors duration-200" strokeWidth="2" />
                            </svg>
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[12px] font-black text-[#1c1917] group-hover:text-blue-700 transition-colors leading-none">New Channel</span>
                            <span className="text-[9px] font-medium text-stone-400 group-hover:text-blue-400 transition-colors leading-none">Broadcast to subscribers</span>
                          </div>
                        </button>

                        <div className="h-px bg-stone-100 mx-2 my-1" />

                        {/* New Group */}
                        <button
                          onClick={() => { setCreateMode("Group"); setIsCreateMenuOpen(false); }}
                          className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-stone-50 active:scale-[0.98] text-left"
                        >
                          <div className="w-9 h-9 bg-stone-100 rounded-xl group-hover:bg-[#1c1917] group-hover:scale-110 group-hover:shadow-md group-hover:shadow-stone-300 transition-all duration-200 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 20 20" fill="none" className="w-[18px] h-[18px]" strokeLinecap="round" strokeLinejoin="round">
                              {/* back person */}
                              <circle cx="13.5" cy="6.5" r="2.5" className="stroke-stone-400 group-hover:stroke-stone-300 transition-colors duration-200" strokeWidth="1.6" />
                              <path d="M10 15.5c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5" className="stroke-stone-400 group-hover:stroke-stone-300 transition-colors duration-200" strokeWidth="1.6" />
                              {/* front person */}
                              <circle cx="7.5" cy="7.5" r="2.8" className="stroke-stone-600 group-hover:stroke-white transition-colors duration-200" strokeWidth="1.8" fill="none" />
                              <path d="M2.5 17c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" className="stroke-stone-600 group-hover:stroke-white transition-colors duration-200" strokeWidth="1.8" />
                            </svg>
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[12px] font-black text-[#1c1917] group-hover:text-[#1c1917] transition-colors leading-none">New Group</span>
                            <span className="text-[9px] font-medium text-stone-400 group-hover:text-stone-500 transition-colors leading-none">Chat with members</span>
                          </div>
                        </button>

                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* --- FILTER BAR --- */}
              <div className="w-full px-6 py-2.5 flex items-center bg-transparent">
                <TopicPool activeTopic={activeTopic} setActiveTopic={setActiveTopic} activeType={activeType} />
              </div>
            </>
          )}

          {/* --- CHAT AREA (fixed overlay aligned to layout content area) --- */}
          {isChatActive && (
            <div className="fixed top-8 right-8 bottom-8 left-[288px] z-[60] flex items-center justify-center">
              {activeGroupChat ? (
                <GroupChatContainer group={activeGroupChat} onClose={closeGroupChat} />
              ) : (
                <ChannelChatContainer channel={activeChannelChat} onClose={closeChannelChat} />
              )}
            </div>
          )}

          {/* --- CONTENT AREA --- */}
          {!isChatActive && (
            <div className="w-full px-6 py-6 pb-20">
              {activeType === "Groups" ? (
                <GroupGrid
                  activeTopic={activeTopic}
                  searchQuery={searchQuery}
                  onOpenChat={openGroupChat}
                  onManage={openGroupChat}
                  onCreateRequest={() => setCreateMode("Group")}
                />
              ) : (
                <ChannelGrid
                  activeTopic={activeTopic}
                  searchQuery={searchQuery}
                  onOpenChat={openChannelChat}
                  onManage={openChannelChat}
                  onCreateRequest={() => setCreateMode("Channel")}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        /* --- 🔴 THE CREATE VIEWS: Placed directly in the normal flex flow! --- */
        <div className="flex-1 w-full px-6 flex justify-center">
          {createMode === "Channel" && (
            <CreateChannelController onClose={() => setCreateMode(null)} />
          )}
          {createMode === "Group" && (
            <CreateGroupController onClose={() => setCreateMode(null)} />
          )}
        </div>
      )}

      <style jsx global>{`
        html::-webkit-scrollbar, body::-webkit-scrollbar, main::-webkit-scrollbar { display: none; }
        html, body, main { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}