"use client";

import { ToggleRight, ToggleLeft } from "lucide-react";

export default function PermissionsForm({ data, update }: any) {
  const safeUpdate = (key: string, value: any) => update({ permissions: { ...(data.permissions || {}), [key]: value } });
  const perms = data.permissions || {};

  return (
    <div className="space-y-3 mt-2">
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Group Access & Content</label>
      
      <div className="flex flex-col gap-1.5 w-full">
        {/* Public / Private */}
        <button onClick={() => safeUpdate('isPublic', !perms.isPublic)} className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm">
          <div className="flex flex-col items-start text-left flex-1 pr-4">
            <span className="text-[12px] font-bold text-[#1c1917] leading-tight">{perms.isPublic ? "Public Group" : "Private Group"}</span>
            <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">{perms.isPublic ? "Anyone can join" : "Requires invite or approval"}</span>
          </div>
          <div className="shrink-0">
            {perms.isPublic ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-stone-300" />}
          </div>
        </button>

        {/* Allow Messages */}
        <button onClick={() => safeUpdate('allowMessages', !perms.allowMessages)} className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm">
          <div className="flex flex-col items-start text-left flex-1 pr-4">
            <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Allow Member Messaging</span>
            <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Members can post text messages</span>
          </div>
          <div className="shrink-0">
            {perms.allowMessages !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
          </div>
        </button>

        {/* Allow Media */}
        <button onClick={() => safeUpdate('allowMedia', !perms.allowMedia)} className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm">
          <div className="flex flex-col items-start text-left flex-1 pr-4">
            <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Allow Media & Links</span>
            <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Members can share images, video, and links</span>
          </div>
          <div className="shrink-0">
            {perms.allowMedia !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
          </div>
        </button>

        {/* Reachability Dropdown */}
        <div className="p-2.5 px-3 rounded-xl bg-[#F5F5F4] flex justify-between items-center border border-transparent hover:border-stone-300 transition-colors shadow-sm">
          <div className="flex flex-col items-start text-left flex-1 pr-4">
            <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Reachability</span>
            <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Where this group is promoted</span>
          </div>
          <select 
            value={perms.reachability || "Global"}
            onChange={(e) => safeUpdate('reachability', e.target.value)}
            className="shrink-0 bg-white border border-stone-200 text-[#1c1917] text-[11px] font-bold rounded-lg px-2 py-1 outline-none shadow-sm cursor-pointer hover:border-stone-300 transition-colors"
          >
            <option value="Global">Global</option>
            <option value="Country">My Country</option>
            <option value="Local">My Area</option>
          </select>
        </div>
      </div>
    </div>
  );
}