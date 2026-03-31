"use client";

import { useState } from "react";
import { Plus, Smile, SendHorizonal, UserPlus, Clock } from "lucide-react";

interface GroupChatBottomProps {
  onSend: (text: string) => void;
  isJoined?: boolean;
  isPrivate?: boolean;
  isPending?: boolean;
  onJoin?: () => void;
  onRequest?: () => void;
  onCancelRequest?: () => void;
}

export default function GroupChatBottom({ onSend, isJoined, isPrivate, isPending, onJoin, onRequest, onCancelRequest }: GroupChatBottomProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Non-members see a prompt instead of input
  if (!isJoined) {
    if (isPrivate && isPending) {
      return (
        <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center justify-center gap-3 shrink-0">
          <span className="text-[12px] font-semibold text-stone-400">Request sent — awaiting approval</span>
          <button
            onClick={onCancelRequest}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 text-stone-500 border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all"
          >
            <Clock size={13} /> Pending
          </button>
        </div>
      );
    }
    if (isPrivate) {
      return (
        <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center justify-center gap-3 shrink-0">
          <span className="text-[12px] font-semibold text-stone-400">This is a private group</span>
          <button
            onClick={onRequest}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all"
          >
            <UserPlus size={13} /> Request to Join
          </button>
        </div>
      );
    }
    return (
      <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center justify-center gap-3 shrink-0">
        <span className="text-[12px] font-semibold text-stone-400">Join the group to send messages</span>
        <button
          onClick={onJoin}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all"
        >
          <UserPlus size={13} /> Join
        </button>
      </div>
    );
  }

  return (
    <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center gap-3 shrink-0">
      <button className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-black hover:bg-stone-200 transition-colors shrink-0">
        <Plus size={20} />
      </button>

      <div className="flex-1 h-10 bg-stone-100 rounded-full flex items-center px-4 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="flex-1 bg-transparent text-[13px] font-bold outline-none text-[#1c1917] placeholder:text-stone-400"
        />
        <button className="text-stone-400 hover:text-[#1c1917] transition-colors ml-2">
          <Smile size={18} />
        </button>
      </div>

      <button
        onClick={handleSend}
        disabled={!value.trim()}
        className="h-10 w-10 rounded-full bg-[#1c1917] flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <SendHorizonal size={18} className="-ml-0.5 mt-0.5" />
      </button>
    </div>
  );
}
