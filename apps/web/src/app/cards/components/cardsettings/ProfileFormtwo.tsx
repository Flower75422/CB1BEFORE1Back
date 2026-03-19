"use client";

import { Crown } from "lucide-react";

export default function ProfileFormtwo({ card }: any) {
  const team = card?.team || [{ name: "You", handle: "@user", role: "Owner" }];
  const owner = team.find((m: any) => m.role === 'Owner') || team[0];

  return (
    <div className="pb-4">
      <div className="space-y-2 mt-1">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Owner</label>
        <div className="flex items-center justify-between p-2 px-3 bg-stone-50 border border-stone-200 rounded-xl shadow-sm hover:border-stone-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-[11px] font-black text-[#1c1917] shadow-sm">{owner.name.charAt(0).toUpperCase()}</div>
            <div className="flex flex-col"><span className="text-[12px] font-bold text-[#1c1917] leading-none">{owner.name}</span><span className="text-[9px] font-semibold text-stone-400 mt-0.5">{owner.handle}</span></div>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 shadow-sm"><Crown size={10} strokeWidth={3} /> Owner</span>
        </div>
      </div>
    </div>
  );
}