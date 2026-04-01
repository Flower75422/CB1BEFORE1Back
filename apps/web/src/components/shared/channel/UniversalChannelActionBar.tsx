"use client";

import { useState } from "react";
import { BellRing, Check, SendHorizonal, Megaphone, UserPlus, Clock } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import type { ChannelData } from "./channel.types";

interface UniversalChannelActionBarProps {
  channel: ChannelData;
  isOwner: boolean;
}

export default function UniversalChannelActionBar({ channel, isOwner }: UniversalChannelActionBarProps) {
  const {
    subscribedChannelIds,
    pendingChannelSubscribeIds,
    subscribeChannel,
    unsubscribeChannel,
    requestSubscribeChannel,
    addBroadcast,
  } = useCommunitiesStore();

  const [value, setValue] = useState("");

  const id = channel.id;
  const isSubscribed = subscribedChannelIds.includes(id);
  const isPending = pendingChannelSubscribeIds.includes(id);

  const handleBroadcast = () => {
    if (!value.trim() || !id) return;
    addBroadcast(id, value.trim());
    setValue("");
  };

  // ── OWNER: broadcast input ──────────────────────────────────────
  if (isOwner) {
    return (
      <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center gap-3 shrink-0">
        <div className="h-9 w-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
          <Megaphone size={16} className="text-amber-600" />
        </div>
        <div className="flex-1 h-10 bg-stone-100 rounded-full flex items-center px-4 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-all">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleBroadcast(); }
            }}
            placeholder="Broadcast to your subscribers..."
            className="flex-1 bg-transparent text-[13px] font-bold outline-none text-[#1c1917] placeholder:text-stone-400"
          />
        </div>
        <button
          onClick={handleBroadcast}
          disabled={!value.trim()}
          className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <SendHorizonal size={18} className="-ml-0.5 mt-0.5" />
        </button>
      </div>
    );
  }

  // ── VIEWER: subscribe states ────────────────────────────────────
  return (
    <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center justify-center gap-3 shrink-0">
      {isSubscribed ? (
        <button
          onClick={() => unsubscribeChannel(id)}
          className="flex items-center gap-2 px-8 py-3 bg-green-50 text-green-700 border border-green-200 rounded-full text-[13px] font-black tracking-wide hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all"
        >
          <Check size={16} strokeWidth={3} /> Subscribed
        </button>
      ) : channel.isPrivate && isPending ? (
        <>
          <span className="text-[12px] font-semibold text-stone-400">Request sent — awaiting approval</span>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 text-stone-500 border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all">
            <Clock size={13} /> Pending
          </button>
        </>
      ) : channel.isPrivate ? (
        <>
          <span className="text-[12px] font-semibold text-stone-400">This is a private channel</span>
          <button
            onClick={() => requestSubscribeChannel(id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all"
          >
            <UserPlus size={13} /> Request to Subscribe
          </button>
        </>
      ) : (
        <button
          onClick={() => subscribeChannel(id)}
          className="flex items-center gap-2 px-8 py-3 bg-[#1c1917] text-white rounded-full text-[13px] font-black tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <BellRing size={16} /> Subscribe to Channel
        </button>
      )}
    </div>
  );
}
