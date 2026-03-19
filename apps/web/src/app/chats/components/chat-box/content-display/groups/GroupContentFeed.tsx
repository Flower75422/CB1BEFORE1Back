"use client";
import { Phone, Video, Info, Users } from "lucide-react";
import ChatBubble from "../shared/ChatBubble";

export default function GroupContentFeed({ data, onToggleInfo, isInfoOpen, onStartCall }: any) {
  const name = data?.name || "Group Chat";
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFA]">
      <div className="h-16 px-6 bg-stone-50 flex justify-between items-center shrink-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggleInfo}>
          <div className="h-10 w-10 rounded-[14px] bg-white border border-stone-200 overflow-hidden flex items-center justify-center text-stone-500 font-black"><Users size={16} /></div>
          <div className="flex flex-col"><h2 className="text-[15px] font-black text-[#1c1917] group-hover:text-black">{name}</h2><p className="text-[11px] text-stone-400 font-bold">14 Members</p></div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onStartCall} className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-[#1c1917] rounded-xl transition-all active:scale-95"><Phone size={18} strokeWidth={2.5} /></button>
          <button onClick={onToggleInfo} className={`p-2.5 rounded-xl transition-all active:scale-95 ${isInfoOpen ? 'bg-[#1c1917] text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-[#1c1917]'}`}><Info size={18} strokeWidth={2.5} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <ChatBubble message="Group project is due tomorrow!" time="10:30 AM" isSender={false} />
        <ChatBubble message="I'll push the final commits tonight." time="10:32 AM" isSender={true} />
      </div>
    </div>
  );
}