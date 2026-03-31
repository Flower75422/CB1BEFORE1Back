"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Share, LogOut, ShieldCheck, UserPlus, EyeOff, Settings, Check, BellOff, Clock, Info, CalendarDays, MapPin, History, ChevronDown, Copy } from "lucide-react";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const LOCATIONS = ["San Francisco, CA","New York, NY","London, UK","Berlin, Germany","Tokyo, Japan","Sydney, Australia","Toronto, Canada"];

function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand("copy"); } catch {}
  document.body.removeChild(ta);
}

function getAboutInfo(id: number) {
  const year = 2022 + (id % 3);
  const month = (id * 3) % 12;
  const day = (id * 7) % 28 + 1;
  const date = new Date(year, month, day);
  const dateStr = `${DAYS[date.getDay()]}, ${MONTHS[month]} ${day}, ${year}`;
  const location = LOCATIONS[id % LOCATIONS.length];
  const prevNames = id % 3 === 0
    ? [`${id} Daily Insights`, `${MONTHS[month]} ${id} Hub`]
    : id % 2 === 0 ? [`Original ${MONTHS[(id+1)%12]} Channel`] : [];
  return { dateStr, location, prevNames };
}

interface ChannelTopProps {
  id?: number;
  title: string;
  subs: string;
  handle?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  isJoined?: boolean;
  isOwner?: boolean;
  isMuted?: boolean;
  isPending?: boolean;
  onManage?: () => void;
  onSubscribe?: () => void;
  onRequest?: () => void;
  onCancelRequest?: () => void;
  onUnsubscribe?: () => void;
  onHide?: () => void;
  onAbout?: () => void;
}

export default function ChannelTop({
  id, title, subs, avatarUrl, isPrivate, isJoined, isOwner, isMuted, isPending, handle,
  onManage, onSubscribe, onRequest, onCancelRequest, onUnsubscribe, onHide, onAbout,
}: ChannelTopProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareUrl = handle
    ? `${window.location.origin}/communities?h=${encodeURIComponent(handle)}`
    : `${window.location.href}?channel=${encodeURIComponent(title)}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title, url: shareUrl }).catch(() => {});
    } else {
      fallbackCopy(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setIsMenuOpen(false);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    fallbackCopy(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsMenuOpen(false);
  };

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
          <h3 className="text-[13px] font-bold text-[#1c1917] leading-tight tracking-tight flex items-center gap-1.5 min-w-0">
            <span className="truncate">{title}</span>
            {isPrivate && <ShieldCheck size={12} className="text-stone-400 shrink-0" />}
          </h3>
          <p className="text-[10px] text-stone-400 font-semibold tracking-wide flex items-center gap-1">
            {subs} Subscribers
            {isJoined && !isOwner && <span className="text-stone-400 font-black">· Follows</span>}
            {isMuted && <BellOff size={9} className="text-stone-300 shrink-0" />}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-0 shrink-0">
        {!isOwner && !isJoined && !isPending && (
          <button
            onClick={(e) => { e.stopPropagation(); isPrivate ? onRequest?.() : onSubscribe?.(); }}
            className="h-7 w-7 rounded-lg text-stone-400 border border-stone-200 flex items-center justify-center hover:bg-[#1c1917] hover:text-white hover:border-[#1c1917] active:scale-95 transition-all"
          >
            <UserPlus size={13} />
          </button>
        )}
        {!isOwner && isPending && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancelRequest?.(); }}
            className="h-7 w-7 rounded-lg text-amber-500 border border-amber-200 bg-amber-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all"
          >
            <Clock size={13} />
          </button>
        )}
        <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          className="p-1.5 -mr-1.5 text-stone-400 hover:text-[#1c1917] hover:bg-stone-100 rounded-full transition-colors active:scale-95"
        >
          <MoreVertical size={18} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-stone-200/60 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <button onClick={(e) => { e.stopPropagation(); setIsAboutOpen(!isAboutOpen); }} className="w-full flex items-center justify-between gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
              <span className="flex items-center gap-2"><Info size={14} className="text-stone-400" /> About</span>
              <ChevronDown size={12} className={`text-stone-400 transition-transform duration-150 ${isAboutOpen ? "rotate-180" : ""}`} />
            </button>
            {isAboutOpen && (() => {
              const { dateStr, location, prevNames } = getAboutInfo(id ?? 1);
              return (
                <div className="bg-stone-50 border-t border-b border-stone-100 px-3 py-2 flex flex-col gap-1.5 mx-1 rounded-lg mb-1">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={11} className="text-stone-400 shrink-0" />
                    <span className="text-[10px] font-semibold text-stone-500 leading-tight">{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={11} className="text-stone-400 shrink-0" />
                    <span className="text-[10px] font-semibold text-stone-500">{location}</span>
                  </div>
                  {prevNames.length > 0 && (
                    <div className="flex items-start gap-2">
                      <History size={11} className="text-stone-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        {prevNames.map((n, i) => (
                          <span key={i} className="text-[10px] font-semibold text-stone-400">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            <button onClick={handleShare} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
              <Share size={14} className="text-stone-400" /> Share
            </button>
            {isOwner ? (
              <button onClick={(e) => { e.stopPropagation(); onManage?.(); setIsMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                <Settings size={14} className="text-stone-400" /> Manage Channel
              </button>
            ) : (
              <>
                <button onClick={(e) => { e.stopPropagation(); onHide?.(); setIsMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                  <EyeOff size={14} className="text-stone-400" /> Hide
                </button>
                <div className="h-px bg-stone-100 my-1 mx-2" />
                {isJoined ? (
                  <button onClick={(e) => { e.stopPropagation(); onUnsubscribe?.(); setIsMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                    <LogOut size={14} className="text-stone-400" /> Leave Channel
                  </button>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); onSubscribe?.(); setIsMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                    <UserPlus size={14} className="text-stone-400" /> Subscribe
                  </button>
                )}
              </>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
