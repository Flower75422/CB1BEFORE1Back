"use client";

import { useState, useRef } from "react";
import {
  X, Users, ArrowLeft, AlertTriangle, CheckCircle, User, Save,
  Globe, Lock, CalendarDays, MapPin, History, UserMinus, Ban,
  Info, ChevronDown, ChevronRight, LogOut, Bell, BellOff,
  Search, FileImage, ShieldAlert, Pencil, Check, Trash2, Share2, Copy,
  Clock, Twitter, Linkedin, Instagram, Youtube, Github, Link2, Plus, ExternalLink, UserPlus,
} from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { getHandleCooldown, CHANNEL_HANDLE_COOLDOWN_DAYS } from "@/utils/communityHandle";

const PLATFORM_META: Record<string, { icon: React.ElementType; color: string }> = {
  website:   { icon: Globe,      color: "text-stone-500" },
  twitter:   { icon: Twitter,    color: "text-sky-500"   },
  linkedin:  { icon: Linkedin,   color: "text-blue-600"  },
  instagram: { icon: Instagram,  color: "text-pink-500"  },
  youtube:   { icon: Youtube,    color: "text-red-500"   },
  github:    { icon: Github,     color: "text-stone-700" },
  custom:    { icon: Link2,      color: "text-stone-400" },
};

const PLATFORM_LABELS = [
  { key: "website", label: "Website" },
  { key: "twitter", label: "X" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "github", label: "GitHub" },
];

type ViewState = "main" | "members" | "media" | "report" | "edit";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const LOCATIONS = ["San Francisco, CA","New York, NY","London, UK","Berlin, Germany","Tokyo, Japan","Sydney, Australia","Toronto, Canada"];

function getAboutInfo(id: number) {
  const year = 2022 + (id % 3);
  const month = (id * 3) % 12;
  const day = (id * 7) % 28 + 1;
  const date = new Date(year, month, day);
  const dateStr = `${DAYS[date.getDay()]}, ${MONTHS[month]} ${day}, ${year}`;
  const location = LOCATIONS[id % LOCATIONS.length];
  const prevNames = id % 3 === 0
    ? [`${id} Daily Insights`, `${MONTHS[month]} ${id} Hub`]
    : id % 2 === 0 ? [`Original ${MONTHS[(id + 1) % 12]} Channel`] : [];
  return { dateStr, location, prevNames };
}

const DUMMY_MEMBERS = [
  { name: "Sarah Chen", role: "Subscriber" },
  { name: "Marco Polo", role: "Subscriber" },
  { name: "Wasim Akram", role: "Subscriber" },
  { name: "Elena R.", role: "Subscriber" },
  { name: "Alex Rivera", role: "Subscriber" },
];

const DUMMY_MEDIA = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=300&fit=crop&q=60",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=300&fit=crop&q=60",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&q=60",
  "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=300&fit=crop&q=60",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop&q=60",
];

const REPORT_REASONS = [
  "Spam or misleading content",
  "Harassment or bullying",
  "Inappropriate content",
  "Intellectual property violation",
  "False information",
];

const CATEGORIES = ["Technology","Design","Business","Marketing","Education","Health","Web3","Finance","Art","Gaming"];

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
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

const VIEW_TITLES: Record<string, string> = {
  main: "Channel Info",
  members: "Subscribers",
  media: "Media & Links",
  report: "Report Channel",
  edit: "Edit Channel",
};

export default function ChannelMoreFeature({ channel, isOwner, isSubscribed, onSubscribe, onLeave, onCloseInfo, onClose }: any) {
  const [currentView, setCurrentView] = useState<ViewState>("main");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restrictDone, setRestrictDone] = useState(false);
  const [blockDone, setBlockDone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Subscribe to live store data so privacy toggle reflects immediately ──
  const {
    myChannels, updateChannel, removeChannel,
    mutedChannelIds, muteChannel, unmuteChannel,
  } = useCommunitiesStore();

  const storeChannel = myChannels.find(c => c.id === String(channel?.id));
  // Live fields — falls back to prop for non-owned (discovered) channels
  const liveIsPrivate       = storeChannel?.isPrivate            ?? channel.isPrivate;
  const liveTitle           = storeChannel?.name                 ?? channel.title;
  const liveDesc            = storeChannel?.desc                 ?? channel.desc;
  const liveHandle          = storeChannel?.handle               ?? channel.handle ?? null;
  const liveLinks           = storeChannel?.links                ?? channel.links  ?? [];
  const liveShowSubs        = storeChannel?.showSubscriberCount  ?? true;
  const liveMAV             = storeChannel?.monthlyActiveViewers ?? channel.monthlyActiveViewers ?? 0;
  const isMuted             = mutedChannelIds.includes(String(channel?.id ?? ""));

  const [editName,     setEditName]     = useState(liveTitle   || "");
  const [editDesc,     setEditDesc]     = useState(liveDesc    || "");
  const [editHandle,   setEditHandle]   = useState(liveHandle  || "");
  const [editLinks,    setEditLinks]    = useState<any[]>(liveLinks);
  const [editShowSubs, setEditShowSubs] = useState(liveShowSubs);
  const [editCategory, setEditCategory] = useState(channel?.category || "Technology");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl,   setNewLinkUrl]   = useState("");

  const members = [
    { name: channel.owner || "Dr. Aris", role: "Owner" },
    ...DUMMY_MEMBERS,
  ];

  const handleSaveEdit = () => {
    if (channel?.id) {
      const cooldown = getHandleCooldown(storeChannel?.handleLastEditedAt, CHANNEL_HANDLE_COOLDOWN_DAYS, storeChannel?.handleEditCount ?? 0);
      const handleToSave = cooldown.canEdit ? (editHandle || undefined) : (storeChannel?.handle || undefined);
      updateChannel(String(channel.id), {
        name: editName,
        desc: editDesc,
        handle: handleToSave,
        links: editLinks,
        showSubscriberCount: editShowSubs,
        category: editCategory,
      });
    }
    setCurrentView("main");
  };

  const fmtMAV = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return `${n}`;
  };

  const handleDelete = () => {
    removeChannel(String(channel.id));
    onCloseInfo();
    onClose?.();
  };

  const shareUrl = `${window.location.origin}/communities?channel=${channel.id}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: liveTitle, url: shareUrl }).catch(() => {});
    } else {
      copyToClipboard(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">

      {/* ── HEADER ── */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-stone-100 shrink-0 bg-white z-10">
        <div className="flex items-center gap-2.5">
          {currentView !== "main" && (
            <button
              onClick={() => { setCurrentView("main"); setReportSubmitted(false); setDeleteConfirm(false); }}
              className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
            </button>
          )}
          <h3 className="text-[13px] font-black text-[#1c1917] uppercase tracking-widest">
            {VIEW_TITLES[currentView] ?? currentView}
          </h3>
        </div>
        <button onClick={onCloseInfo} className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95">
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* ════ MAIN VIEW ════ */}
        {currentView === "main" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">

            {/* Hero */}
            <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center w-full overflow-hidden">
              <div className="h-[72px] w-[72px] bg-stone-100 border border-stone-200 rounded-[20px] flex items-center justify-center text-2xl font-black text-[#1c1917] shadow-sm overflow-hidden mb-3 shrink-0">
                {channel.avatarUrl
                  ? <img src={channel.avatarUrl} alt={liveTitle} className="w-full h-full object-cover" />
                  : liveTitle?.charAt(0)
                }
              </div>

              <h2 className="text-[16px] font-black text-[#1c1917] tracking-tight leading-tight w-full truncate px-2">{liveTitle}</h2>
              {liveHandle && (
                <p className="text-[11px] font-semibold text-stone-400 mt-0.5 tracking-wide w-full truncate px-2">{liveHandle}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1.5">
                <User size={10} className="text-stone-400" />
                <span className="text-[11px] font-semibold text-stone-400">{channel.owner}</span>
              </div>

              {/* Stat chips */}
              <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">

                {/* Subscribers — hidden if owner toggled off */}
                {liveShowSubs && (
                  <button
                    onClick={() => setCurrentView("members")}
                    className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                  >
                    <Users size={12} className="text-stone-400" />
                    <span className="text-[11px] font-bold text-stone-500">{channel.subs} Subscribers</span>
                  </button>
                )}

                {/* Privacy chip */}
                {isOwner ? (
                  <button
                    onClick={() => updateChannel(String(channel.id), { isPrivate: !liveIsPrivate })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 ${liveIsPrivate ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"}`}
                  >
                    {liveIsPrivate ? <Lock size={11} /> : <Globe size={11} />}
                    {liveIsPrivate ? "Private" : "Public"}
                  </button>
                ) : (
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold ${liveIsPrivate ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                    {liveIsPrivate ? <Lock size={11} /> : <Globe size={11} />}
                    {liveIsPrivate ? "Private" : "Public"}
                  </span>
                )}
              </div>

              {/* Monthly Active Viewers — alternative design */}
              {liveMAV > 0 && (
                <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
                  <span className="text-[12px] font-black text-violet-600">{fmtMAV(liveMAV)}</span>
                  <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">monthly active</span>
                </div>
              )}
            </div>

            {/* Description */}
            {liveDesc && (
              <div className="px-5 pb-4 w-full overflow-hidden">
                <p className="text-[12px] font-medium text-stone-500 leading-relaxed break-words">{liveDesc}</p>
              </div>
            )}

            {/* Links — only show if links exist, or owner (so they know to add some) */}
            {(liveLinks.filter((l: any) => l.url).length > 0 || isOwner) && (
              <div className="px-5 pb-4">
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2 px-0.5">Links</p>
                {liveLinks.filter((l: any) => l.url).length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {liveLinks.filter((l: any) => l.url).map((link: any, i: number) => {
                      const meta = PLATFORM_META[link.platform] || PLATFORM_META.custom;
                      const Icon = meta.icon;
                      return (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.label}
                          className={`w-8 h-8 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center hover:border-stone-300 hover:bg-white active:scale-95 transition-all ${meta.color}`}
                        >
                          <Icon size={15} />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-3.5 py-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl">
                    <Link2 size={13} className="text-stone-300 shrink-0" />
                    <p className="text-[11px] font-medium text-stone-300">No links yet — add them via Edit Channel</p>
                  </div>
                )}
              </div>
            )}

            {/* About accordion */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FDFBF7] rounded-xl border border-stone-100 hover:border-stone-200 transition-colors active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <Info size={13} className="text-stone-400" />
                  <span className="text-[12px] font-bold text-stone-600">About this Channel</span>
                </div>
                <ChevronDown size={13} className={`text-stone-400 transition-transform duration-200 ${isAboutExpanded ? "rotate-180" : ""}`} />
              </button>
              {isAboutExpanded && (() => {
                const { dateStr, location, prevNames } = getAboutInfo(channel?.id ?? 1);
                return (
                  <div className="mt-2 flex flex-col divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-3.5 py-3 bg-white">
                      <CalendarDays size={13} className="text-stone-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Created</p>
                        <p className="text-[12px] font-bold text-[#1c1917]">{dateStr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-3.5 py-3 bg-white">
                      <MapPin size={13} className="text-stone-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Owner Location</p>
                        <p className="text-[12px] font-bold text-[#1c1917]">{location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 px-3.5 py-3 bg-white">
                      <History size={13} className="text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Previous Names</p>
                        {prevNames.length > 0
                          ? prevNames.map((n, i) => <p key={i} className="text-[12px] font-semibold text-stone-500">{n}</p>)
                          : <p className="text-[12px] font-medium text-stone-300">No previous names</p>
                        }
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="h-px bg-stone-100 mx-5 mb-4" />

            {/* ── Settings ── */}
            <div className="px-5 pb-8 flex flex-col gap-5">

              {/* Preferences — only for subscribers + owner */}
              {(isOwner || isSubscribed) && <section>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Preferences</p>
                <div className="flex flex-col gap-1">

                  {/* Mute toggle */}
                  <button
                    onClick={() => isMuted ? unmuteChannel(String(channel?.id ?? "")) : muteChannel(String(channel?.id ?? ""))}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98] ${isMuted ? "bg-amber-50 border-amber-100 hover:bg-amber-100/60" : "bg-stone-50 border-stone-100 hover:border-stone-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isMuted ? "bg-amber-100" : "bg-white border border-stone-200"}`}>
                        {isMuted ? <BellOff size={14} className="text-amber-500" /> : <Bell size={14} className="text-stone-500" />}
                      </div>
                      <div className="text-left">
                        <p className="text-[12px] font-bold text-[#1c1917]">{isMuted ? "Muted" : "Notifications On"}</p>
                        <p className="text-[10px] text-stone-400 font-medium">{isMuted ? "Tap to unmute" : "Tap to mute"}</p>
                      </div>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 shrink-0 ${isMuted ? "bg-amber-400" : "bg-stone-200"}`}>
                      <div className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? "translate-x-[17px]" : "translate-x-[3px]"}`} />
                    </div>
                  </button>

                  {/* Privacy toggle — owner only, reads live store value */}
                  {isOwner && (
                    <button
                      onClick={() => updateChannel(String(channel.id), { isPrivate: !liveIsPrivate })}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                          {liveIsPrivate ? <Lock size={14} className="text-stone-500" /> : <Globe size={14} className="text-stone-500" />}
                        </div>
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#1c1917]">{liveIsPrivate ? "Private" : "Public"} Channel</p>
                          <p className="text-[10px] text-stone-400 font-medium">Tap to toggle visibility</p>
                        </div>
                      </div>
                      <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 shrink-0 ${!liveIsPrivate ? "bg-blue-500" : "bg-stone-200"}`}>
                        <div className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${!liveIsPrivate ? "translate-x-[17px]" : "translate-x-[3px]"}`} />
                      </div>
                    </button>
                  )}
                </div>
              </section>}

              {/* Content */}
              <section>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Content</p>
                <div className="flex flex-col gap-1">
                  {isOwner && (
                    <SettingRow icon={<Pencil size={14} />} label="Edit Channel" onClick={() => setCurrentView("edit")} hasArrow />
                  )}
                  <SettingRow
                    icon={<Search size={14} />}
                    label="Search in Channel"
                    onClick={() => { setShowSearch(v => !v); setTimeout(() => searchRef.current?.focus(), 60); }}
                    rightEl={<ChevronDown size={13} className={`text-stone-400 transition-transform duration-200 ${showSearch ? "rotate-180" : ""}`} />}
                  />
                  {showSearch && (
                    <div className="px-1 pb-1">
                      <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search messages…"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[12px] font-medium text-[#1c1917] placeholder:text-stone-300 outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                  )}
                  <SettingRow icon={<Share2 size={14} />} label="Share Channel" onClick={handleShare} />
                  <SettingRow icon={<FileImage size={14} />} label="Shared Media & Links" badge="89" onClick={() => setCurrentView("media")} hasArrow />
                </div>
              </section>

              {/* Safety */}
              <section>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Safety</p>
                <div className="flex flex-col gap-1">
                  {isOwner ? (
                    /* Owner sees Delete instead of Report */
                    deleteConfirm ? (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[12px] font-bold text-red-600 leading-snug">
                            Delete this channel permanently? All messages and data will be lost.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleDelete}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wide transition-colors active:scale-95"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(false)}
                            className="flex-1 py-2 bg-white border border-stone-200 text-stone-600 rounded-xl text-[11px] font-bold hover:bg-stone-50 transition-colors active:scale-95"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <SettingRow icon={<Trash2 size={14} />} label="Delete Channel" isDanger onClick={() => setDeleteConfirm(true)} />
                    )
                  ) : (
                    /* Non-owners see Report */
                    <>
                      <SettingRow icon={<ShieldAlert size={14} />} label="Report Channel" isDanger onClick={() => setCurrentView("report")} hasArrow />
                      <SettingRow
                        icon={restrictDone ? <Check size={14} /> : <UserMinus size={14} />}
                        label={restrictDone ? "Channel Restricted" : "Restrict Channel"}
                        isDanger
                        onClick={() => !restrictDone && setRestrictDone(true)}
                        rightEl={restrictDone ? <span className="text-[10px] font-black text-red-400 uppercase tracking-wide">Done</span> : undefined}
                      />
                      <SettingRow
                        icon={blockDone ? <Check size={14} /> : <Ban size={14} />}
                        label={blockDone ? "Channel Blocked" : "Block Channel"}
                        isDanger
                        onClick={() => !blockDone && setBlockDone(true)}
                        rightEl={blockDone ? <span className="text-[10px] font-black text-red-400 uppercase tracking-wide">Done</span> : undefined}
                      />
                    </>
                  )}
                </div>
              </section>

              {/* Subscribe — viewer (non-owner, not yet subscribed) */}
              {!isOwner && !isSubscribed && (
                <button
                  onClick={onSubscribe}
                  className="w-full py-3 bg-[#1c1917] hover:bg-black text-white rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <UserPlus size={14} /> Subscribe to Channel
                </button>
              )}

              {/* Leave — subscriber (non-owner, subscribed) */}
              {!isOwner && isSubscribed && (
                <button
                  onClick={onLeave}
                  className="w-full py-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-100 hover:border-red-500 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <LogOut size={14} /> Leave Channel
                </button>
              )}
            </div>
          </div>
        )}

        {/* ════ MEMBERS VIEW ════ */}
        {currentView === "members" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">{channel.subs} Subscribers</p>
            <div className="flex flex-col gap-1.5">
              {members.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-xl hover:border-stone-200 transition-colors">
                  <div className="h-9 w-9 bg-stone-100 rounded-full flex items-center justify-center text-[12px] font-black text-stone-600 shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-[#1c1917] truncate">{member.name}</span>
                      {member.role === "Owner" && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">Owner</span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-stone-400">@{member.name.split(" ")[0].toLowerCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ MEDIA VIEW ════ */}
        {currentView === "media" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Shared Photos & Videos</p>
            <div className="grid grid-cols-2 gap-2">
              {DUMMY_MEDIA.map((url, i) => (
                <div key={i} className="aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-100 cursor-pointer hover:opacity-80 hover:scale-[0.98] transition-all">
                  <img src={url} alt="media" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ REPORT VIEW ════ */}
        {currentView === "report" && (
          <div className="p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            {reportSubmitted ? (
              <div className="flex flex-col items-center gap-4 py-10">
                <div className="w-14 h-14 bg-green-50 border border-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <div className="text-center">
                  <h4 className="text-[15px] font-black text-[#1c1917]">Report Submitted</h4>
                  <p className="text-[12px] text-stone-400 font-medium mt-1 leading-relaxed max-w-[200px] mx-auto">We'll review this and take action if needed.</p>
                </div>
                <button onClick={() => { setReportSubmitted(false); setCurrentView("main"); }} className="text-[11px] font-bold text-stone-400 hover:text-[#1c1917] transition-colors">
                  Back to Channel Info
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[12px] font-bold leading-snug">You are reporting this channel for violating community guidelines.</p>
                </div>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Select a Reason</p>
                <div className="flex flex-col gap-1.5">
                  {REPORT_REASONS.map((reason, i) => (
                    <button
                      key={i}
                      onClick={() => setReportSubmitted(true)}
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-[12px] font-bold text-[#1c1917] text-left hover:border-stone-400 hover:bg-stone-50 transition-colors active:scale-[0.98]"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ════ EDIT VIEW ════ */}
        {currentView === "edit" && (
          <div className="p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Channel Name</label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-[13px] font-bold text-[#1c1917] outline-none focus:border-stone-400 transition-colors"
                placeholder="Channel name"
              />
            </div>

            {/* Subscriber count visibility toggle */}
            <button
              onClick={() => setEditShowSubs(v => !v)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                  <Users size={14} className="text-stone-500" />
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-bold text-[#1c1917]">Subscriber Count</p>
                  <p className="text-[10px] text-stone-400 font-medium">{editShowSubs ? "Visible to everyone" : "Hidden from viewers"}</p>
                </div>
              </div>
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 shrink-0 ${editShowSubs ? "bg-blue-500" : "bg-stone-200"}`}>
                <div className={`absolute top-[3px] w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${editShowSubs ? "translate-x-[17px]" : "translate-x-[3px]"}`} />
              </div>
            </button>
            {(() => {
              const cooldown = getHandleCooldown(storeChannel?.handleLastEditedAt, CHANNEL_HANDLE_COOLDOWN_DAYS, storeChannel?.handleEditCount ?? 0);
              return (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Handle</label>
                    {!cooldown.canEdit && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-wide">
                        <Clock size={9} /> {cooldown.daysLeft}d cooldown
                      </span>
                    )}
                    {cooldown.canEdit && storeChannel?.handleLastEditedAt && (
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wide">Available</span>
                    )}
                  </div>
                  {cooldown.canEdit ? (
                    <>
                      <input
                        value={editHandle}
                        onChange={e => setEditHandle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-[13px] font-semibold text-[#1c1917] outline-none focus:border-stone-400 transition-colors"
                        placeholder="@channel_name/ch/owner_id"
                      />
                      <p className="text-[9px] text-stone-300 font-medium px-1">
                        Letters, numbers, underscores · First 2 edits free · {CHANNEL_HANDLE_COOLDOWN_DAYS}-day wait from 3rd edit
                      </p>
                    </>
                  ) : (
                    <div className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-stone-400 truncate">{editHandle}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Lock size={11} className="text-amber-400" />
                        <span className="text-[10px] font-black text-amber-500">
                          {cooldown.daysLeft} day{cooldown.daysLeft !== 1 ? "s" : ""} left
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            {/* Links edit */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Links</label>
              {/* Existing links */}
              {editLinks.filter((l: any) => l.url).map((link: any, i: number) => {
                const meta = PLATFORM_META[link.platform] || PLATFORM_META.custom;
                const Icon = meta.icon;
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl">
                    <Icon size={13} className={`shrink-0 ${meta.color}`} />
                    <span className="text-[11px] font-bold text-stone-500 w-[60px] shrink-0">{link.label}</span>
                    <span className="text-[11px] text-stone-400 truncate flex-1">{link.url}</span>
                    <button onClick={() => setEditLinks(editLinks.filter((_: any, j: number) => j !== i))} className="text-stone-300 hover:text-red-400 transition-colors shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
              {/* Platform quick-add */}
              <div className="flex flex-wrap gap-1.5">
                {PLATFORM_LABELS.map(({ key, label }) => {
                  const meta = PLATFORM_META[key];
                  const Icon = meta.icon;
                  const added = editLinks.some((l: any) => l.platform === key);
                  return (
                    <button key={key} disabled={added} onClick={() => setEditLinks([...editLinks, { platform: key, label, url: "" }])}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${added ? "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400"}`}>
                      <Icon size={10} /> {label}
                    </button>
                  );
                })}
              </div>
              {/* Update URL for platform links with empty url */}
              {editLinks.filter((l: any) => !l.url && l.platform !== "custom").map((link: any, idx: number) => {
                const globalIdx = editLinks.indexOf(link);
                const meta = PLATFORM_META[link.platform] || PLATFORM_META.custom;
                const Icon = meta.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl">
                    <Icon size={13} className={`shrink-0 ${meta.color}`} />
                    <input
                      type="url"
                      placeholder={`${link.label} URL`}
                      className="flex-1 bg-transparent text-[11px] text-[#1c1917] placeholder-stone-300 outline-none font-medium"
                      onChange={e => setEditLinks(editLinks.map((l: any, i: number) => i === globalIdx ? { ...l, url: e.target.value } : l))}
                    />
                    <button onClick={() => setEditLinks(editLinks.filter((_: any, i: number) => i !== globalIdx))} className="text-stone-300 hover:text-red-400 shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
              {/* Custom link */}
              <div className="flex gap-2">
                <input value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder="Label"
                  className="w-[90px] px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-medium text-[#1c1917] outline-none focus:border-stone-400 transition-colors shrink-0" />
                <input value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="https://"
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-medium text-[#1c1917] outline-none focus:border-stone-400 transition-colors" />
                <button
                  disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                  onClick={() => { setEditLinks([...editLinks, { platform: "custom", label: newLinkLabel.trim(), url: newLinkUrl.trim() }]); setNewLinkLabel(""); setNewLinkUrl(""); }}
                  className="px-3 py-2 rounded-xl bg-[#1c1917] text-white disabled:opacity-30 hover:bg-stone-800 transition-colors shrink-0">
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Description</label>
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-[12px] font-medium text-[#1c1917] outline-none focus:border-stone-400 transition-colors resize-none"
                placeholder="Channel description"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setEditCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all active:scale-95 ${editCategory === cat ? "bg-[#1c1917] text-white border-[#1c1917]" : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSaveEdit}
              className="mt-2 w-full py-3.5 bg-[#1c1917] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black active:scale-95 transition-all"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingRow({
  icon, label, badge, isDanger, hasArrow, onClick, rightEl,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isDanger?: boolean;
  hasArrow?: boolean;
  onClick?: () => void;
  rightEl?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl border border-transparent transition-all active:scale-[0.98] ${isDanger ? "hover:bg-red-50" : "hover:bg-stone-50 hover:border-stone-100"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDanger ? "bg-red-100 text-red-500" : "bg-stone-100 text-stone-500"}`}>
          {icon}
        </div>
        <span className={`text-[12px] font-bold ${isDanger ? "text-red-500" : "text-[#1c1917]"}`}>{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {badge && <span className="text-[10px] font-black text-stone-400">{badge}</span>}
        {rightEl ?? (hasArrow && <ChevronRight size={13} className="text-stone-300" />)}
      </div>
    </button>
  );
}
