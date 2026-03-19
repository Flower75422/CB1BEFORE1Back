"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Share, Flag, LogOut, ShieldCheck, UserPlus } from "lucide-react";

interface ChannelTopProps {
  title: string;
  subs: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  isJoined?: boolean; // 🔴 NEW
}

export default function ChannelTop({ title, subs, avatarUrl, isPrivate, isJoined }: ChannelTopProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-start relative z-20">
      <div className="flex gap-3 min-w-0">
        <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100/50 overflow-hidden relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[16px] font-black uppercase text-blue-600">{title.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-[13px] font-bold text-[#1c1917] truncate leading-tight tracking-tight flex items-center gap-1.5">
            {title}
            {isPrivate && <ShieldCheck size={12} className="text-stone-400 shrink-0" />}
          </h3>
          <p className="text-[10px] text-stone-400 font-semibold tracking-wide">{subs} Subscribers</p>
        </div>
      </div>

      <div className="shrink-0 relative" ref={menuRef}>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          className="p-1.5 -mr-1.5 text-stone-400 hover:text-[#1c1917] hover:bg-stone-100 rounded-full transition-colors active:scale-95"
        >
          <MoreVertical size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-xl border border-stone-200/60 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
              <Share size={14} className="text-stone-400" /> Share
            </button>
            <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
              <Flag size={14} className="text-stone-400" /> Report
            </button>
            <div className="h-px bg-stone-100 my-1 mx-2"></div>
            
            {/* 🔴 DYNAMIC BUTTON: Subscribe vs Leave */}
            {isJoined ? (
              <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={14} className="text-red-400" /> Leave Channel
              </button>
            ) : (
              <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                <UserPlus size={14} className="text-stone-400" /> Subscribe
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}