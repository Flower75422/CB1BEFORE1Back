"use client";

import { ArrowLeft } from "lucide-react";

export default function CreateChannelTopBar({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center gap-4 mb-6 shrink-0">
      <button 
        onClick={onClose} 
        className="p-2 rounded-full hover:bg-stone-200 transition text-[#1c1917] bg-white border border-stone-200 shadow-sm active:scale-95"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
      </button>
      <h1 className="text-[19px] font-black text-[#1c1917] tracking-tight leading-none">
        Create Channel
      </h1>
    </div>
  );
}