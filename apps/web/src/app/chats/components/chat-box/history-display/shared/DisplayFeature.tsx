"use client";
import { Edit, X } from "lucide-react";
import { useChatsStore } from "@/store/chats/chats.store";
import { useState } from "react";

export default function DisplayFeature() {
  const { activeTab, setActiveTab, isComposing, setIsComposing, addDirectChat } = useChatsStore();
  const [composeName, setComposeName] = useState("");

  const handleComposeSubmit = () => {
    if (!composeName.trim()) return;
    addDirectChat(composeName.trim());
    setComposeName("");
  };

  return (
    <div className={`flex flex-col shrink-0 bg-[#FDFBF7] transition-all duration-200 ${isComposing ? "h-36" : "h-28"}`}>

      {/* Title row */}
      <div className="h-16 px-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-stone-700">Messages</h2>
        <button
          onClick={() => { setIsComposing(!isComposing); setComposeName(""); }}
          title="New message"
          className={`p-2 rounded-xl transition-all active:scale-95 ${isComposing ? "bg-stone-900 text-white" : "text-stone-400 hover:text-stone-600 hover:bg-stone-200/50"}`}
        >
          {isComposing ? <X size={16} strokeWidth={2} /> : <Edit size={16} strokeWidth={1.8} />}
        </button>
      </div>

      {/* Compose new DM input */}
      {isComposing && (
        <div className="px-3 pb-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2 border border-stone-200 focus-within:border-stone-400 focus-within:bg-white transition-all">
            <input
              autoFocus
              type="text"
              value={composeName}
              onChange={(e) => setComposeName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleComposeSubmit(); if (e.key === "Escape") { setIsComposing(false); setComposeName(""); } }}
              placeholder="Enter name to start chat..."
              className="flex-1 bg-transparent text-[12px] font-medium text-[#1c1917] placeholder:text-stone-400 outline-none"
            />
            <button
              onClick={handleComposeSubmit}
              disabled={!composeName.trim()}
              className="text-[10px] font-black uppercase tracking-wider text-stone-500 hover:text-[#1c1917] disabled:opacity-30 transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="h-12 px-4 flex items-center gap-6 border-b border-stone-200/50">
        <TabButton label="Chats"    active={activeTab === "chats"}    onClick={() => setActiveTab("chats")} />
        <TabButton label="Channels" active={activeTab === "channels"} onClick={() => setActiveTab("channels")} />
        <TabButton label="Groups"   active={activeTab === "groups"}   onClick={() => setActiveTab("groups")} />
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative h-full flex items-center text-[13px] font-medium transition-colors ${active ? "text-stone-800" : "text-stone-400 hover:text-stone-600"}`}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-800 rounded-t-sm" />}
    </button>
  );
}
