"use client";

import { Plus, Smile, SendHorizonal } from "lucide-react";

export default function GroupChatBottom() {
  return (
    <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center gap-3 shrink-0">
      
      <button className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-black hover:bg-stone-200 transition-colors shrink-0">
        <Plus size={20} />
      </button>

      <div className="flex-1 h-10 bg-stone-100 rounded-full flex items-center px-4 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-all">
        <input 
          type="text" 
          placeholder="Write a message..." 
          className="flex-1 bg-transparent text-[13px] font-bold outline-none text-[#1c1917] placeholder:text-stone-400"
        />
        <button className="text-stone-400 hover:text-[#1c1917] transition-colors ml-2">
          <Smile size={18} />
        </button>
      </div>

      <button className="h-10 w-10 rounded-full bg-[#1c1917] flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all shrink-0">
        <SendHorizonal size={18} className="-ml-0.5 mt-0.5" />
      </button>

    </div>
  );
}