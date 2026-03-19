"use client";
import { Phone, Video, MoreHorizontal, Info } from "lucide-react";
import ChatBubble from "../shared/ChatBubble";

export default function DirectChatFeed({ data, onToggleInfo, isInfoOpen, onStartCall }: any) {
  const name = data?.name || "Select a chat";
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFA]">
      <div className="h-16 px-6 bg-stone-50 flex justify-between items-center shrink-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggleInfo}>
          <div className="h-10 w-10 rounded-full bg-white border border-stone-200 overflow-hidden flex items-center justify-center text-stone-500 font-black">{name.charAt(0)}</div>
          <div className="flex flex-col"><h2 className="text-[15px] font-black text-[#1c1917] group-hover:text-black">{name}</h2><p className="text-[11px] text-stone-400 font-bold">Active now</p></div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onStartCall} className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-[#1c1917] rounded-xl transition-all active:scale-95"><Phone size={18} strokeWidth={2.5} /></button>
          <button onClick={onStartCall} className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-[#1c1917] rounded-xl transition-all active:scale-95"><Video size={18} strokeWidth={2.5} /></button>
          <button onClick={onToggleInfo} className={`p-2.5 rounded-xl transition-all active:scale-95 ${isInfoOpen ? 'bg-[#1c1917] text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-[#1c1917]'}`}><Info size={18} strokeWidth={2.5} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <ChatBubble message="Hey! Let's build something awesome." time="10:30 AM" isSender={false} />
        <ChatBubble message="Absolutely. The new architecture is ready." time="10:32 AM" isSender={true} />
      </div>
    </div>
  );
}