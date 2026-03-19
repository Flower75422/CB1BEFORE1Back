"use client";

import { ArrowLeft, Users, Info, Search } from "lucide-react";

export default function GroupChatTop({ group, onClose, onToggleInfo, isInfoOpen }: any) {
  return (
    <div className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onClose}
          className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggleInfo}>
          <div className="h-10 w-10 bg-stone-100 rounded-xl flex items-center justify-center text-[#1c1917] font-black text-lg group-hover:bg-stone-200 transition-colors">
            {group.title.charAt(0)}
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] font-black text-[#1c1917] leading-none tracking-tight">
              {group.title}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-stone-400 text-[11px] font-bold">
              <Users size={12} /> {group.members} Members
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors">
          <Search size={18} />
        </button>
        <button 
          onClick={onToggleInfo}
          className={`p-2 rounded-full transition-colors ${isInfoOpen ? 'bg-black text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-black'}`}
        >
          <Info size={18} />
        </button>
      </div>

    </div>
  );
}