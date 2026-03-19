"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Users, Hash } from "lucide-react"; 
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
  const [activeType, setActiveType] = useState<"Groups" | "Channels">("Groups");
  const [activeTopic, setActiveTopic] = useState("Feed");
  
  const [activeGroupChat, setActiveGroupChat] = useState<any>(null);
  const [activeChannelChat, setActiveChannelChat] = useState<any>(null);

  const [createMode, setCreateMode] = useState<"Channel" | "Group" | null>(null);
  
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeType, activeGroupChat, activeChannelChat, createMode]);

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
    <main className="relative min-h-screen w-full bg-[#FDFBF7] flex flex-col pt-2 text-[#1c1917]">
      
      {/* 🔴 THE FIX: If createMode is active, we completely hide the feed and ONLY render the creator. No absolute positioning needed! */}
      {!createMode ? (
        <div className="flex flex-col flex-1 w-full">
          
          {!isChatActive && (
            <>
              {/* --- TOP BAR --- */}
              <div className="w-full px-6 h-16 -mt-6 flex items-center justify-between bg-transparent mb-2 z-50 relative">
                <div className="flex items-center h-full">
                  <TypeToggle active={activeType} onTypeChange={setActiveType} />
                </div>

                <div className="flex items-center gap-3 relative">
                  <SearchBar placeholder={`Search ${activeType.toLowerCase()}...`} width="w-60" />
                  <div className="h-5 w-[1px] bg-stone-200/50 mx-1" />
                  
                  <div className="relative" ref={menuRef}>
                    <button 
                      onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-stone-200"
                    >
                      <Plus size={14} strokeWidth={3} /> Create
                    </button>

                    {isCreateMenuOpen && (
                      <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-200/60 z-[100] p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        
                        <button 
                          onClick={() => { setCreateMode("Group"); setIsCreateMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] font-bold text-[#1c1917] hover:bg-stone-50 rounded-xl transition-colors text-left"
                        >
                          <div className="p-1.5 bg-stone-100 text-stone-600 rounded-lg">
                            <Users size={14} />
                          </div>
                          New Group
                        </button>

                        <button 
                          onClick={() => { setCreateMode("Channel"); setIsCreateMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] font-bold text-[#1c1917] hover:bg-stone-50 rounded-xl transition-colors text-left mt-0.5"
                        >
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <Hash size={14} />
                          </div>
                          New Channel
                        </button>

                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* --- FILTER BAR --- */}
              <div className="w-full px-6 py-2.5 flex items-center bg-transparent">
                <TopicPool activeTopic={activeTopic} setActiveTopic={setActiveTopic} />
              </div>
            </>
          )}

          {/* --- CONTENT AREA --- */}
          <div className={`w-full px-6 ${isChatActive ? 'py-4' : 'py-6 pb-20'}`}>
            {activeGroupChat ? (
              <div className="w-full flex justify-center">
                 <GroupChatContainer group={activeGroupChat} onClose={() => setActiveGroupChat(null)} />
              </div>
            ) : activeChannelChat ? (
              <div className="w-full flex justify-center">
                 <ChannelChatContainer channel={activeChannelChat} onClose={() => setActiveChannelChat(null)} />
              </div>
            ) : (
              <div>
                {activeType === "Groups" ? (
                  <GroupGrid activeTopic={activeTopic} onOpenChat={setActiveGroupChat} />
                ) : (
                  <ChannelGrid activeTopic={activeTopic} onOpenChat={setActiveChannelChat} />
                )}
              </div>
            )}
          </div>
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