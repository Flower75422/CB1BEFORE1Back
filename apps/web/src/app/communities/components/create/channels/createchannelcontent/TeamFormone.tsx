"use client";

import { Info, ToggleRight, ToggleLeft, Ghost, PenTool, ShieldAlert } from "lucide-react";

export default function TeamFormone({ data, update }: any) {
  const postAsChannel = data.postAsChannel ?? true;

  return (
    <div className="space-y-6 mt-1">
      
      {/* IDENTITY TOGGLE */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Team Identity</label>
        
        <button 
          onClick={() => update({ postAsChannel: !postAsChannel })} 
          className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm group"
        >
          <div className="flex gap-3 items-center text-left flex-1 pr-4">
            <div className={`p-2 rounded-lg transition-colors ${postAsChannel ? 'bg-[#1c1917] text-white' : 'bg-white border border-stone-200 text-stone-400'}`}>
              <Ghost size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Post as Channel</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">
                {postAsChannel ? "Admin profiles are hidden from subscribers" : "Subscribers see which admin is posting"}
              </span>
            </div>
          </div>
          <div className="shrink-0">
            {postAsChannel ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
          </div>
        </button>
      </div>

      {/* ROLE GUIDE */}
      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
          <Info size={10} strokeWidth={3} /> Role Capabilities
        </label>
        
        <div className="flex flex-col gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl shadow-sm">
          <div className="flex gap-2.5 items-start">
            <PenTool size={14} className="text-blue-500 shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1c1917] leading-none">Editors</span>
              <span className="text-[9px] font-medium text-stone-500 mt-1 leading-tight">Can create posts, view analytics, and manage broadcasts.</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-stone-200/60 my-1" />

          <div className="flex gap-2.5 items-start">
            <ShieldAlert size={14} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1c1917] leading-none">Moderators</span>
              <span className="text-[9px] font-medium text-stone-500 mt-1 leading-tight">Cannot post. Can only delete comments and ban unruly users.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}