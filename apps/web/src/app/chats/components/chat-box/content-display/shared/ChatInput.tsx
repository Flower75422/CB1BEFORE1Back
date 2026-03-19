"use client";
import { Send, Paperclip, Smile } from "lucide-react";
import { useState } from "react";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  return (
    <div className="min-h-[80px] w-full px-4 py-4 bg-transparent flex items-end shrink-0 z-20">
      <div className="flex-1 flex items-end bg-stone-100/80 rounded-3xl px-4 py-2.5 border border-stone-200/50 focus-within:border-stone-300 focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
        <button className="text-stone-400 hover:text-[#1c1917] mb-0.5 transition-colors"><Paperclip size={18} strokeWidth={2.5} /></button>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." rows={1} className="flex-1 bg-transparent text-[13px] font-bold outline-none px-4 py-1 text-[#1c1917] placeholder:text-stone-400 resize-none overflow-hidden" />
        <div className="flex items-center gap-2 mb-0.5">
          <button className="text-stone-400 hover:text-[#1c1917] transition-colors"><Smile size={18} strokeWidth={2.5} /></button>
          <button disabled={!message.trim()} className="p-2 bg-[#1c1917] text-white rounded-full hover:bg-black transition-all active:scale-95 shadow-md disabled:opacity-30 disabled:scale-100"><Send size={14} strokeWidth={2.5} className="ml-0.5" /></button>
        </div>
      </div>
    </div>
  );
}