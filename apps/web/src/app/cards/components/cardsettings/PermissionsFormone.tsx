"use client";

import { ToggleRight, ToggleLeft } from "lucide-react";

export default function PermissionsFormone({ card, updateCard }: any) {
  const safeUpdate = (key: string, value: any) => updateCard({ permissions: { ...(card?.permissions || {}), [key]: value } });
  const perms = card?.permissions || {};

  return (
    <div className="space-y-3 mt-2">
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Access</label>
      <div className="flex flex-col gap-1.5 w-full">
        <button onClick={() => safeUpdate('allowChat', !perms.allowChat)} className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm">
          <div className="flex flex-col items-start text-left flex-1 pr-4"><span className="text-[12px] font-bold text-[#1c1917] leading-tight">Allow 1-on-1 Chat</span><span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Show chat button on card front</span></div>
          <div className="shrink-0">{perms.allowChat !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}</div>
        </button>
        <button onClick={() => safeUpdate('allowFullProfile', !perms.allowFullProfile)} className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm">
          <div className="flex flex-col items-start text-left flex-1 pr-4"><span className="text-[12px] font-bold text-[#1c1917] leading-tight">Full Profile View</span><span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Allow users to see full account</span></div>
          <div className="shrink-0">{perms.allowFullProfile !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}</div>
        </button>
      </div>
    </div>
  );
}