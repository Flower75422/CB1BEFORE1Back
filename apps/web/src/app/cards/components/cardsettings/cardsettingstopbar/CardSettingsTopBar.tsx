"use client";

import { ArrowLeft } from "lucide-react";

export default function CardSettingsTopBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between mt-8 mb-6 px-1 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 transition text-[#1c1917] bg-white border border-stone-200 shadow-sm active:scale-95">
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <h1 className="text-[19px] font-black text-[#1c1917] tracking-tight leading-none">
          Card Deck Manager
        </h1>
      </div>
    </div>
  );
}