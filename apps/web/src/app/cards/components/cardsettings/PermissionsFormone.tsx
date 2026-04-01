"use client";

import { ToggleRight, ToggleLeft } from "lucide-react";

export default function PermissionsFormone({ card, updateCard }: any) {
  const safeUpdate = (key: string, value: any) =>
    updateCard({ permissions: { ...(card?.permissions || {}), [key]: value } });
  const perms = card?.permissions || {};

  return (
    <div className="space-y-3">

      {/* ── Channel Visibility ──────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Channel Visibility</label>
        <div className="flex flex-col gap-1.5 w-full">

          <button
            onClick={() => updateCard({ channel: { ...(card?.channel || {}), isPublic: !(card?.channel?.isPublic ?? true) } })}
            className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Public Channel</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Anyone can find and subscribe to this channel</span>
            </div>
            <div className="shrink-0">
              {(card?.channel?.isPublic ?? true) ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-stone-300" />}
            </div>
          </button>

        </div>
      </div>

      {/* ── Card Access ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Access</label>
        <div className="flex flex-col gap-1.5 w-full">

          <button
            onClick={() => safeUpdate('allowChat', !perms.allowChat)}
            className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Allow 1-on-1 Chat</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Show chat button on card front</span>
            </div>
            <div className="shrink-0">
              {perms.allowChat !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
            </div>
          </button>

          <button
            onClick={() => safeUpdate('allowFullProfile', !perms.allowFullProfile)}
            className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Full Profile View</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Allow users to see full account</span>
            </div>
            <div className="shrink-0">
              {perms.allowFullProfile !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
            </div>
          </button>

        </div>
      </div>

      {/* ── Engagement & Access ─────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Engagement & Access</label>
        <div className="flex flex-col gap-1.5 w-full">

          <button
            onClick={() => safeUpdate('allowComments', !perms.allowComments)}
            className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Subscriber Comments</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Allow subscribers to reply to your posts</span>
            </div>
            <div className="shrink-0">
              {perms.allowComments !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
            </div>
          </button>

          <button
            onClick={() => safeUpdate('allowReactions', !perms.allowReactions)}
            className="w-full p-2.5 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
          >
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Content Reactions</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Allow thumbs up, hearts, and emojis on posts</span>
            </div>
            <div className="shrink-0">
              {perms.allowReactions !== false ? <ToggleRight size={22} className="text-[#1c1917]" /> : <ToggleLeft size={22} className="text-stone-300" />}
            </div>
          </button>

          <div className="p-2.5 px-3 rounded-xl bg-[#F5F5F4] flex justify-between items-center border border-transparent hover:border-stone-300 transition-colors shadow-sm">
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Monetization Tier</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Is this a free or paid card?</span>
            </div>
            <select
              value={perms.tier || "Free"}
              onChange={(e) => safeUpdate('tier', e.target.value)}
              className="shrink-0 bg-white border border-stone-200 text-[#1c1917] text-[11px] font-bold rounded-lg px-2 py-1 outline-none shadow-sm cursor-pointer hover:border-stone-300 transition-colors"
            >
              <option value="Free">Free</option>
              <option value="Paid">Premium (Paid)</option>
            </select>
          </div>

          <div className="p-2.5 px-3 rounded-xl bg-[#F5F5F4] flex justify-between items-center border border-transparent hover:border-stone-300 transition-colors shadow-sm">
            <div className="flex flex-col items-start text-left flex-1 pr-4">
              <span className="text-[12px] font-bold text-[#1c1917] leading-tight">Reachability</span>
              <span className="text-[9px] font-medium text-[#78716c] mt-0.5 uppercase tracking-tight line-clamp-1">Where this card is promoted</span>
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

    </div>
  );
}
