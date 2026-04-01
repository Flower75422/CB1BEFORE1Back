"use client";

import { ArrowLeft, Info, Search } from "lucide-react";
import type { ChannelData } from "./channel.types";

function fmtNum(v: number): string {
  if (!v) return "0";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return String(v);
}

interface UniversalChannelHeaderProps {
  channel: ChannelData;
  onBack: () => void;
  onToggleInfo: () => void;
  isInfoOpen: boolean;
  onToggleSearch: () => void;
  isSearchOpen: boolean;
}

export default function UniversalChannelHeader({
  channel,
  onBack,
  onToggleInfo,
  isInfoOpen,
  onToggleSearch,
  isSearchOpen,
}: UniversalChannelHeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">

      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggleInfo}>
          {/* Avatar */}
          <div className="h-10 w-10 bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden border border-stone-200 group-hover:border-stone-300 transition-colors shrink-0">
            {channel.avatarUrl ? (
              <img src={channel.avatarUrl} alt={channel.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[15px] font-black text-stone-500">
                {(channel.name || "C").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name + subs */}
          <div className="flex flex-col">
            <h2 className="text-[15px] font-black text-[#1c1917] leading-none tracking-tight">
              {channel.name || "Channel"}
            </h2>
            <span className="text-[11px] font-bold text-stone-400 mt-1">
              {fmtNum(channel.subs ?? 0)} Subscribers
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSearch}
          className={`p-2 rounded-full transition-colors ${
            isSearchOpen ? "bg-black text-white" : "text-stone-400 hover:bg-stone-100 hover:text-black"
          }`}
          title="Search broadcasts"
        >
          <Search size={18} />
        </button>
        <button
          onClick={onToggleInfo}
          className={`p-2 rounded-full transition-colors ${
            isInfoOpen ? "bg-black text-white" : "text-stone-400 hover:bg-stone-100 hover:text-black"
          }`}
          title="Channel info"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
}
