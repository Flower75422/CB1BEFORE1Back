"use client";
import { useState } from "react";
import { Edit } from "lucide-react";

export default function DisplayFeature({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState("chats");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="h-28 flex flex-col shrink-0 bg-[#FDFBF7]">
      <div className="h-16 px-4 flex items-center justify-between">
        <h2 className="text-[16px] font-black text-[#1c1917] tracking-tight">Messages</h2>
        <button className="p-2 text-stone-400 hover:text-[#1c1917] hover:bg-stone-200/50 rounded-xl transition-all active:scale-95"><Edit size={18} strokeWidth={2.5} /></button>
      </div>
      <div className="h-12 px-4 flex items-center gap-6 border-b border-stone-200/50">
        <TabButton label="Chats" active={activeTab === "chats"} onClick={() => handleTabClick("chats")} />
        <TabButton label="Channels" active={activeTab === "channels"} onClick={() => handleTabClick("channels")} />
        <TabButton label="Groups" active={activeTab === "groups"} onClick={() => handleTabClick("groups")} />
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`relative h-full flex items-center text-[12px] font-black uppercase tracking-wider transition-colors ${active ? "text-[#1c1917]" : "text-stone-400"}`}>
      {label}
      {active && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1c1917] rounded-t-md" />}
    </button>
  );
}