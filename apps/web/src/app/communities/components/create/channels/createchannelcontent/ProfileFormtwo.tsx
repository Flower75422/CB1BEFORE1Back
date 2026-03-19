"use client";

import { Crown } from "lucide-react";

export default function ProfileFormtwo({ data }: any) {
  // Pull team data or default to the current user as Owner
  const team = data?.team || [{ name: "You", handle: "@wasim", role: "Owner" }];
  const owner = team.find((m: any) => m.role === 'Owner') || team[0];

  return (
    // 🔴 Added pb-4 to ensure it never crushes against the bottom edge
    <div className="pb-4">
      
      {/* 🔴 Reduced gap to space-y-2 for a tighter, connected look */}
      <div className="space-y-2 mt-1">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
          Channel Owner
        </label>
        
        {/* 🔴 Tighter vertical padding (p-2 px-3) */}
        <div className="flex items-center justify-between p-2 px-3 bg-stone-50 border border-stone-200 rounded-xl shadow-sm hover:border-stone-300 transition-colors">
          
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-[11px] font-black text-[#1c1917] shadow-sm">
              {owner.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#1c1917] leading-none">{owner.name}</span>
              <span className="text-[9px] font-semibold text-stone-400 mt-0.5">{owner.handle}</span>
            </div>
          </div>
          
          {/* 🔴 Tighter badge padding (py-0.5) to keep it perfectly proportioned */}
          <span className="flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 shadow-sm">
            <Crown size={10} strokeWidth={3} /> Owner
          </span>

        </div>
      </div>

    </div>
  );
}