"use client";

import { BellRing } from "lucide-react";

export default function ChannelBottomBar() {
  return (
    <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center justify-center shrink-0">
      <button className="flex items-center gap-2 px-8 py-3 bg-[#1c1917] text-white rounded-full text-[13px] font-black tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all">
        <BellRing size={16} /> Subscribe to Channel
      </button>
    </div>
  );
}