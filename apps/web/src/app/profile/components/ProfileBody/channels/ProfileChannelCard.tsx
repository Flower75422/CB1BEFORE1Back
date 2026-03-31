"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Share, Flag, LogOut, ShieldCheck, UserPlus, Settings, Trash2, TrendingUp } from "lucide-react";

export interface Channel {
  id: number | string;
  title: string;
  subs: string;
  owner: string;
  desc: string;
  trending?: boolean;
  isPrivate?: boolean;
  topics?: string[];
  avatarUrl?: string;
  isJoined?: boolean;
}

interface Props {
  channel: Channel;
  isOwner?: boolean;   // true = logged-in user owns this channel
  onOpenChat?: (channel: Channel) => void;
}

export default function ProfileChannelCard({ channel, isOwner = false, onOpenChat }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenChat = () => {
    if (!channel.isPrivate) {
      if (onOpenChat) onOpenChat(channel);
    } else {
      alert("This is a private channel. You must request access to join.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-stone-100 hover:shadow-lg hover:shadow-stone-200/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">

      {/* TOP — Avatar + Title + Menu */}
      <div className="flex justify-between items-start">
        <div
          onClick={handleOpenChat}
          className={`flex gap-3 min-w-0 flex-1 ${!channel.isPrivate ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100/60 overflow-hidden">
            {channel.avatarUrl
              ? <img src={channel.avatarUrl} alt={channel.title} className="w-full h-full object-cover" />
              : <span className="text-[16px] font-semibold text-blue-600">{channel.title.charAt(0)}</span>
            }
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="text-[13px] font-medium text-stone-700 truncate leading-tight flex items-center gap-1.5">
              {channel.title}
              {channel.isPrivate && <ShieldCheck size={12} className="text-stone-400 shrink-0" />}
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">{channel.subs} Subscribers</p>
          </div>
        </div>

        {/* ── 3-DOT MENU ── */}
        <div className="shrink-0 relative" ref={menuRef}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors active:scale-95"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-stone-200/60 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

              {isOwner ? (
                // ── OWNER MENU ──────────────────────────────────────────
                <>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <Settings size={13} className="text-stone-400" /> Manage Channel
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <Share size={13} className="text-stone-400" /> Share
                  </button>
                  <div className="h-px bg-stone-100 my-1 mx-2" />
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} className="text-red-400" /> Delete Channel
                  </button>
                </>
              ) : (
                // ── VISITOR MENU ────────────────────────────────────────
                <>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Share size={13} className="text-stone-400" /> Share
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Flag size={13} className="text-stone-400" /> Report
                  </button>
                  <div className="h-px bg-stone-100 my-1 mx-2" />
                  {channel.isJoined
                    ? <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors"><LogOut size={13} className="text-red-400" /> Leave</button>
                    : <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"><UserPlus size={13} className="text-stone-400" /> Subscribe</button>
                  }
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BODY — Description + Trending Badge */}
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-stone-500 leading-relaxed line-clamp-2">{channel.desc}</p>
        {channel.trending && (
          <div className="flex items-center gap-1 w-fit bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-100/60">
            <TrendingUp size={10} />
            <span className="text-[9px] font-medium uppercase tracking-wide">Trending</span>
          </div>
        )}
      </div>

      {/* BOTTOM — Owner label + Primary Action */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-50">
        <div className="flex flex-col">
          <span className="text-[9px] text-stone-300 uppercase tracking-widest leading-none mb-0.5">
            {isOwner ? "You own this" : "Owned by"}
          </span>
          <span className="text-[11px] font-medium text-stone-500 truncate max-w-[120px]">
            {isOwner ? "You" : channel.owner}
          </span>
        </div>

        {isOwner ? (
          // Owner sees Manage button
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-medium bg-stone-800 text-white hover:bg-stone-900 shadow-sm active:scale-95 transition-all">
            <Settings size={11} /> Manage
          </button>
        ) : (
          // Visitor sees Follow / Request button
          <button className={`px-5 py-1.5 rounded-xl text-[11px] font-medium shadow-sm active:scale-95 transition-all ${channel.isPrivate ? "bg-stone-800 text-white hover:bg-stone-900" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
            {channel.isPrivate ? "Request" : "Follow"}
          </button>
        )}
      </div>

    </div>
  );
}
