"use client";

import { Plus, Send, Smile } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ onSend }: { onSend?: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText("");
  };

  return (
    <div className="h-[76px] bg-white border-t border-stone-100 px-4 flex items-center shrink-0 gap-3">

      <button className="h-10 w-10 flex shrink-0 items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors">
        <Plus size={20} />
      </button>

      <div className="flex-1 h-11 bg-stone-100 rounded-full flex items-center px-4 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-colors shadow-inner">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message..."
          className="flex-1 bg-transparent text-[13px] font-bold text-[#1c1917] outline-none placeholder:text-stone-400"
        />
        <button className="text-stone-400 hover:text-stone-600 ml-2 transition-colors">
          <Smile size={18} />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="h-10 w-10 flex shrink-0 items-center justify-center bg-[#1c1917] hover:bg-black text-white rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md"
      >
        <Send size={16} className="ml-0.5" />
      </button>

    </div>
  );
}
