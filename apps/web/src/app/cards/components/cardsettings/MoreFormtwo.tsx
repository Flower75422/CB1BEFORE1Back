"use client";

import { Trash2 } from "lucide-react";

export default function MoreFormtwo({ onDelete }: any) {
  return (
    <div className="space-y-2 mt-1">
      <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Danger Zone</label>
      <div className="p-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between shadow-sm hover:border-stone-300 transition-colors group">
        <div className="flex flex-col items-start text-left"><span className="text-[12px] font-bold text-[#1c1917] leading-tight">Delete Card</span><span className="text-[9px] font-medium text-stone-500 uppercase tracking-tight mt-0.5">Permanently remove this identity</span></div>
        <button onClick={onDelete} className="px-3 py-1.5 bg-white text-stone-500 font-bold text-[10px] uppercase tracking-wider hover:bg-[#1c1917] hover:text-white rounded-lg shadow-sm transition-colors border border-stone-200 group-hover:border-[#1c1917] active:scale-95"><Trash2 size={14} strokeWidth={2.5} /></button>
      </div>
    </div>
  );
}