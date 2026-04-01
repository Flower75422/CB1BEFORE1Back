"use client";

import { useState, useMemo } from "react";
import {
  X, Users, ArrowLeft, AlertTriangle, CheckCircle, User,
  BellOff, Search, FileImage, ShieldAlert, LogOut,
  Globe, Lock, Share2, Copy, Check, Trash2,
  Link2, Twitter, Linkedin, Instagram, Youtube, Github,
} from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import type { ChannelData } from "./channel.types";

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtNum(v: number): string {
  if (!v) return "0";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return String(v);
}

const VIEW_TITLES: Record<string, string> = {
  main:    "Channel Info",
  members: "Subscribers",
  media:   "Media & Links",
  report:  "Report Channel",
};

/** Stable handle from a name — no Math.random(), deterministic hash */
function stableHandle(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return `@${name.split(" ")[0].toLowerCase()}${h % 100}`;
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  website:   Globe,
  twitter:   Twitter,
  linkedin:  Linkedin,
  instagram: Instagram,
  youtube:   Youtube,
  github:    Github,
  custom:    Link2,
};

const REPORT_REASONS = [
  "Spam or misleading content",
  "Harassment or bullying",
  "Inappropriate content",
  "Intellectual property violation",
  "False information",
];

type ViewState = "main" | "members" | "media" | "report";

// ── Component ──────────────────────────────────────────────────────────────
interface UniversalChannelInfoPanelProps {
  channel: ChannelData;
  isOwner: boolean;
  onCloseInfo: () => void;
  onLeave?: () => void;           // called after unsubscribe + close
  onSearchOpen?: () => void;      // opens the search bar in the parent container
}

export default function UniversalChannelInfoPanel({
  channel,
  isOwner,
  onCloseInfo,
  onLeave,
  onSearchOpen,
}: UniversalChannelInfoPanelProps) {
  const [currentView, setCurrentView] = useState<ViewState>("main");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const {
    mutedChannelIds,
    muteChannel,
    unmuteChannel,
    unsubscribeChannel,
    channelBroadcasts,
    subscribedChannelIds,
  } = useCommunitiesStore();

  const id = channel.id;
  const isMuted      = mutedChannelIds.includes(id);
  const isSubscribed = subscribedChannelIds.includes(id);

  // ── Stable members list ────────────────────────────────────────
  const members = useMemo(() => [
    { name: channel.owner || "Owner", role: "Owner" },
    { name: "Sarah Chen",   role: "Subscriber" },
    { name: "Marco Polo",   role: "Subscriber" },
    { name: "Wasim Akram",  role: "Subscriber" },
    { name: "Elena Rivera", role: "Subscriber" },
  ], [channel.owner]);

  // ── Shared media from real channel broadcasts ──────────────────
  const sharedMedia = useMemo(() => {
    const broadcasts = channelBroadcasts[id] || [];
    // filter for broadcasts that carry a media url (future-proof)
    return broadcasts
      .filter((b: any) => b.mediaUrl)
      .map((b: any) => b.mediaUrl as string);
  }, [channelBroadcasts, id]);

  // ── Share / copy link ──────────────────────────────────────────
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/cards?channel=${id}`
    : "";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: channel.name, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  // ── Leave channel ──────────────────────────────────────────────
  const handleLeave = () => {
    if (id) unsubscribeChannel(id);
    onLeave?.();
    onCloseInfo();
  };

  // ── Report submit ──────────────────────────────────────────────
  const handleReport = (reason: string) => {
    // TODO: wire to backend report endpoint
    console.log("Reported:", channel.name, "Reason:", reason);
    setReportSubmitted(true);
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-100 shrink-0 bg-white z-20">
        <div className="flex items-center gap-3">
          {currentView !== "main" && (
            <button
              onClick={() => { setCurrentView("main"); setReportSubmitted(false); }}
              className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
          )}
          <h3 className="text-[14px] font-black text-[#1c1917] uppercase tracking-wide">
            {VIEW_TITLES[currentView] ?? currentView}
          </h3>
        </div>
        <button
          onClick={onCloseInfo}
          className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── SCROLLABLE CONTENT ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">

        {/* ════ VIEW: MAIN ════ */}
        {currentView === "main" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">

            {/* Hero — avatar, name, owner, bio, stats */}
            <div className="p-6 flex flex-col items-center text-center border-b border-stone-100 w-full overflow-hidden">
              <div className="h-24 w-24 bg-stone-100 border border-stone-200 rounded-[28px] flex items-center justify-center text-3xl font-black text-[#1c1917] mb-4 shadow-sm overflow-hidden shrink-0">
                {channel.avatarUrl ? (
                  <img src={channel.avatarUrl} alt={channel.name} className="w-full h-full object-cover" />
                ) : (
                  (channel.name || "C").charAt(0).toUpperCase()
                )}
              </div>

              <h2 className="text-[18px] font-black text-[#1c1917] tracking-tight w-full truncate px-2">{channel.name || "Channel"}</h2>
              {channel.handle && (
                <span className="text-[11px] font-semibold text-stone-400 mt-0.5 w-full truncate px-2 block">{channel.handle}</span>
              )}

              {/* Owner badge */}
              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100 max-w-full overflow-hidden">
                <User size={10} className="text-stone-400 shrink-0" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide truncate">
                  Owner: <span className="text-[#1c1917]">{channel.owner || "Unknown"}</span>
                </span>
              </div>

              {/* Bio */}
              {channel.bio && (
                <p className="text-[12px] font-medium text-stone-500 mt-4 w-full leading-relaxed break-words px-2">
                  {channel.bio}
                </p>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setCurrentView("members")}
                  className="flex items-center gap-1.5 hover:text-[#1c1917] transition-colors bg-stone-50 px-3 py-1.5 rounded-lg active:scale-95 border border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-widest"
                >
                  <Users size={14} /> {fmtNum(channel.subs ?? 0)} Subscribers
                </button>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#1c1917] transition-colors bg-stone-50 px-3 py-1.5 rounded-lg active:scale-95 border border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-widest"
                >
                  {linkCopied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                  {linkCopied ? "Copied!" : "Share"}
                </button>
              </div>

              {/* Social links (if any) */}
              {channel.links && channel.links.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {channel.links.map((link, i) => {
                    const Icon = PLATFORM_ICONS[link.platform] ?? Link2;
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-[10px] font-bold text-stone-600 hover:border-stone-300 hover:text-[#1c1917] transition-colors"
                      >
                        <Icon size={11} /> {link.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settings & actions */}
            <div className="p-6 pb-20 flex flex-col gap-2">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Settings</h4>

              {/* Mute — only shown when subscribed */}
              {isSubscribed && (
                <button
                  onClick={() => id && (isMuted ? unmuteChannel(id) : muteChannel(id))}
                  className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors flex justify-between items-center group"
                >
                  <div className="flex items-center gap-3">
                    <BellOff size={16} className="text-stone-500 group-hover:text-black" />
                    <span className="text-[13px] font-bold text-[#1c1917]">{isMuted ? "Unmute Notifications" : "Mute Notifications"}</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isMuted ? "bg-stone-300" : "bg-green-500"}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? "left-1" : "translate-x-5"}`} />
                  </div>
                </button>
              )}

              {/* Privacy status — read-only indicator (only owner can change) */}
              <div className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-stone-100 flex justify-between items-center opacity-80">
                <div className="flex items-center gap-3">
                  {channel.isPrivate
                    ? <Lock size={16} className="text-stone-400" />
                    : <Globe size={16} className="text-stone-400" />
                  }
                  <span className="text-[13px] font-bold text-stone-500">
                    {channel.isPrivate ? "Private Channel" : "Public Channel"}
                  </span>
                </div>
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Read Only</span>
              </div>

              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-4 mb-2 px-1">Browse</h4>

              {/* Search in channel — triggers parent search bar */}
              <button
                onClick={() => { onSearchOpen?.(); onCloseInfo(); }}
                className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-white hover:border-stone-200 shadow-sm text-[#1c1917]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-stone-100 text-stone-500"><Search size={16} /></div>
                  <span className="text-[12px] font-bold">Search in Channel</span>
                </div>
              </button>

              {/* Shared media */}
              <button
                onClick={() => setCurrentView("media")}
                className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-white hover:border-stone-200 shadow-sm text-[#1c1917]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-stone-100 text-stone-500"><FileImage size={16} /></div>
                  <span className="text-[12px] font-bold">Shared Media & Links</span>
                </div>
              </button>

              {/* Report — only for non-owners */}
              {!isOwner && (
                <button
                  onClick={() => setCurrentView("report")}
                  className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-red-50 hover:border-stone-200 shadow-sm text-red-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-red-100 text-red-500"><ShieldAlert size={16} /></div>
                    <span className="text-[12px] font-bold">Report Channel</span>
                  </div>
                </button>
              )}

              {/* ── OWNER ZONE ────────────────────────────────── */}
              {isOwner && (
                <div className="mt-4 flex flex-col gap-2">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Owner Controls</h4>
                  <button className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-stone-50 hover:border-stone-200 shadow-sm text-[#1c1917]">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-stone-100 text-stone-500"><Copy size={16} /></div>
                      <span className="text-[12px] font-bold">Copy Channel Link</span>
                    </div>
                  </button>
                </div>
              )}

              {/* ── LEAVE CHANNEL — only for subscribed non-owners ── */}
              {!isOwner && isSubscribed && (
                <div className="mt-6">
                  <button
                    onClick={handleLeave}
                    className="w-full py-3.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                  >
                    <LogOut size={16} /> Leave Channel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ VIEW: SUBSCRIBERS ════ */}
        {currentView === "members" && (
          <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
              {fmtNum(channel.subs ?? 0)} Subscribers
            </h4>
            <div className="flex flex-col gap-2">
              {members.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:border-stone-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#F5F5F4] rounded-full flex items-center justify-center text-[12px] font-black text-stone-500 group-hover:bg-stone-200 transition-colors">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#1c1917]">{member.name}</span>
                        {member.role === "Owner" && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700">
                            {member.role}
                          </span>
                        )}
                      </div>
                      {/* Stable handle — no Math.random() */}
                      <span className="text-[10px] font-semibold text-stone-400">
                        {stableHandle(member.name)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ VIEW: SHARED MEDIA ════ */}
        {currentView === "media" && (
          <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
              Shared Photos & Videos
            </h4>
            {sharedMedia.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {sharedMedia.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-stone-100 rounded-xl overflow-hidden border border-stone-200 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img src={url} alt="Shared media" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-300">
                <FileImage size={28} strokeWidth={1.5} />
                <span className="text-[11px] font-black uppercase tracking-widest">No media yet</span>
                <span className="text-[10px] font-medium text-stone-400 text-center max-w-[160px] leading-relaxed">
                  Media shared in broadcasts will appear here.
                </span>
              </div>
            )}
          </div>
        )}

        {/* ════ VIEW: REPORT ════ */}
        {currentView === "report" && (
          <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            {reportSubmitted ? (
              /* Confirmation screen */
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-[16px] font-black text-[#1c1917]">Report Submitted</h3>
                <p className="text-[12px] font-medium text-stone-500 max-w-[200px] leading-relaxed">
                  Thanks for letting us know. We'll review this channel and take appropriate action.
                </p>
                <button
                  onClick={() => { setCurrentView("main"); setReportSubmitted(false); }}
                  className="mt-2 px-6 py-2.5 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                  <AlertTriangle size={20} />
                  <span className="text-[12px] font-bold leading-tight">
                    You are reporting <strong>{channel.name}</strong> for violating community guidelines.
                  </span>
                </div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                  Select a Reason
                </h4>
                <div className="flex flex-col gap-2">
                  {REPORT_REASONS.map((reason, i) => (
                    <button
                      key={i}
                      onClick={() => handleReport(reason)}
                      className="w-full p-4 bg-white border border-stone-200 rounded-xl text-[13px] font-bold text-left hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
