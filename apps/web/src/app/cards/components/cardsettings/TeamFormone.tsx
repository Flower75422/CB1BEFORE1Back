"use client";

import { ToggleRight, ToggleLeft, Ghost } from "lucide-react";

export default function TeamFormone({ card, updateCard }: any) {
  const postAsChannel = card?.postAsChannel ?? true;

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Identity</label>
        <button onClick={() => updateCard({ postAsChannel: !postAsChannel })} className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm group">
          <div className="flex gap-3 items-center text-left flex-1 pr-4">
            <div className={`p-2 rounded-lg transition-colors ${postAsChannel ? 'bg-[#1c1917] text-white' : 'bg-white border border-stone-200 text-stone-400'}`}><Ghost size={16} strokeWidth={2.5} /></div>
            <div className="flex flex-col"><span className="text-[12px] font-bold text-[#1c1917] leading-tight">Post as Card Identity</span><span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">{postAsChannel ? "Hide personal profile from viewers" : "Viewers see your personal profile"}</span></div>
          </div>
          <div className="shrink-0">{postAsChannel ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}</div>
        </button>
      </div>
    </div>
  );
}