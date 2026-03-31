"use client";

import { useState, useRef } from "react";
import {
  X, Users, ArrowLeft, AlertTriangle, CheckCircle, MoreVertical,
  Shield, UserX, Save, Globe, Lock, CalendarDays, MapPin, History,
  UserMinus, Ban, Info, ChevronDown, ChevronRight, LogOut,
  Bell, BellOff, Search, FileImage, ShieldAlert, Pencil, Check,
  Trash2, Share2, Copy, User, Clock,
} from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { getHandleCooldown, GROUP_HANDLE_COOLDOWN_DAYS } from "@/utils/communityHandle";

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
    ? [`${MONTHS[month]} ${id} Community`, `Group ${id} Original`]
    : id % 2 === 0 ? [`Early ${MONTHS[(id + 2) % 12]} Group`] : [];
  return { dateStr, location, prevNames };
}

interface Member { name: string; role: "Owner" | "Admin" | "Member"; }

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
  main: "Group Info",
  members: "Members",
  media: "Media & Links",
  report: "Report Group",
  edit: "Edit Group",
};

export default function GroupMoreFeature({ group, isOwner, isAdmin, isJoined, onLeave, onCloseInfo }: any) {
  const [currentView, setCurrentView] = useState<ViewState>("main");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restrictDone, setRestrictDone] = useState(false);
  const [blockDone, setBlockDone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [memberActionMenu, setMemberActionMenu] = useState<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ── Subscribe to live store data so privacy toggle reflects immediately ──
  const {
    myGroups, updateGroup, removeGroup,
    mutedGroupIds, muteGroup, unmuteGroup,
    groupJoinRequests, approveGroupJoinRequest, declineGroupJoinRequest,
  } = useCommunitiesStore();

  const pendingRequests = groupJoinRequests[String(group?.id)] || [];

  const storeGroup  = myGroups.find(g => g.id === String(group?.id));
  const liveIsPrivate = storeGroup?.isPrivate ?? group.isPrivate;
  const liveTitle     = storeGroup?.name     ?? group.title;
  const liveDesc      = storeGroup?.desc     ?? group.desc;
  const liveHandle    = storeGroup?.handle   ?? group.handle ?? null;
  const isMuted       = mutedGroupIds.includes(String(group?.id ?? ""));

  const [editName,     setEditName]     = useState(liveTitle   || "");
  const [editDesc,     setEditDesc]     = useState(liveDesc    || "");
  const [editHandle,   setEditHandle]   = useState(liveHandle  || "");
  const [editCategory, setEditCategory] = useState(group?.category || "Technology");

  const [members, setMembers] = useState<Member[]>([
    { name: group.owner || "Wasim Akram", role: "Owner" },
    { name: "Elena Rodriguez", role: "Admin" },
    { name: "Alex Rivera", role: "Member" },
    { name: "Dr. Aris", role: "Member" },
    { name: "Sarah Chen", role: "Member" },
    { name: "Marco Polo", role: "Member" },
  ]);

  const handlePromote = (idx: number) => {
    setMembers(prev => prev.map((m, i) => i === idx ? { ...m, role: "Admin" } : m));
    setMemberActionMenu(null);
  };
  const handleDemote = (idx: number) => {
    setMembers(prev => prev.map((m, i) => i === idx ? { ...m, role: "Member" } : m));
    setMemberActionMenu(null);
  };
  const handleRemove = (idx: number) => {
    setMembers(prev => prev.filter((_, i) => i !== idx));
    setMemberActionMenu(null);
  };

  const handleSaveEdit = () => {
    if (group?.id) {
      const cooldown = getHandleCooldown(storeGroup?.handleLastEditedAt, GROUP_HANDLE_COOLDOWN_DAYS, storeGroup?.handleEditCount ?? 0);
      const handleToSave = cooldown.canEdit ? (editHandle || undefined) : (storeGroup?.handle || undefined);
      updateGroup(String(group.id), { name: editName, desc: editDesc, handle: handleToSave, category: editCategory });
    }
    setCurrentView("main");
  };

  const handleDelete = () => {
    removeGroup(String(group.id));
    onCloseInfo();
  };

  const shareUrl = `${window.location.origin}/communities?group=${group.id}`;

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
    <div className="flex flex-col h-full bg-white overflow-hidden" onClick={() => setMemberActionMenu(null)}>

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
            <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center">
              <div className="h-[72px] w-[72px] bg-stone-100 border border-stone-200 rounded-[20px] flex items-center justify-center text-2xl font-black text-[#1c1917] shadow-sm overflow-hidden mb-3">
                {group.avatarUrl
                  ? <img src={group.avatarUrl} alt={liveTitle} className="w-full h-full object-cover" />
                  : liveTitle?.charAt(0)
                }
              </div>

              <h2 className="text-[16px] font-black text-[#1c1917] tracking-tight leading-tight">{liveTitle}</h2>
              {liveHandle && (
                <p className="text-[11px] font-semibold text-stone-400 mt-0.5 tracking-wide">{liveHandle}</p>
              )}
              <div className="flex items-center gap-1.5 mt-1.5">
                <User size={10} className="text-stone-400" />
                <span className="text-[11px] font-semibold text-stone-400">{group.owner}</span>
              </div>

              {/* Stat chips */}
              <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                <button
                  onClick={() => setCurrentView("members")}
                  className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                >
                  <Users size={12} className="text-stone-400" />
                  <span className="text-[11px] font-bold text-stone-500">{group.members} Members</span>
                </button>
                {isOwner ? (
                  <button
                    onClick={() => updateGroup(String(group.id), { isPrivate: !liveIsPrivate })}
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
            </div>

            {/* Description */}
            {liveDesc && (
              <div className="px-5 pb-4">
                <p className="text-[12px] font-medium text-stone-500 leading-relaxed">{liveDesc}</p>
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
                  <span className="text-[12px] font-bold text-stone-600">About this Group</span>
                </div>
                <ChevronDown size={13} className={`text-stone-400 transition-transform duration-200 ${isAboutExpanded ? "rotate-180" : ""}`} />
              </button>
              {isAboutExpanded && (() => {
                const { dateStr, location, prevNames } = getAboutInfo(group?.id ?? 1);
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

              {/* Preferences — only for members (owner, admin, joined) */}
              {(isOwner || isAdmin || isJoined) && <section>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Preferences</p>
                <div className="flex flex-col gap-1">

                  {/* Mute toggle */}
                  <button
                    onClick={() => isMuted ? unmuteGroup(String(group?.id ?? "")) : muteGroup(String(group?.id ?? ""))}
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
                      onClick={() => updateGroup(String(group.id), { isPrivate: !liveIsPrivate })}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                          {liveIsPrivate ? <Lock size={14} className="text-stone-500" /> : <Globe size={14} className="text-stone-500" />}
                        </div>
                        <div className="text-left">
                          <p className="text-[12px] font-bold text-[#1c1917]">{liveIsPrivate ? "Private" : "Public"} Group</p>
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
                  {(isOwner || isAdmin) && (
                    <SettingRow icon={<Pencil size={14} />} label="Edit Group" onClick={() => setCurrentView("edit")} hasArrow />
                  )}
                  <SettingRow
                    icon={<Search size={14} />}
                    label="Search in Group"
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
                  <SettingRow icon={<Share2 size={14} />} label="Share Group" onClick={handleShare} />
                  <SettingRow icon={<FileImage size={14} />} label="Shared Media & Links" badge="142" onClick={() => setCurrentView("media")} hasArrow />
                </div>
              </section>

              {/* Safety */}
              <section>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Safety</p>
                <div className="flex flex-col gap-1">
                  {isOwner ? (
                    /* ── Owner: Delete Group ── */
                    deleteConfirm ? (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                          <p className="text-[12px] font-bold text-red-600 leading-snug">
                            Delete this group permanently? All messages and data will be lost.
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
                      <SettingRow icon={<Trash2 size={14} />} label="Delete Group" isDanger onClick={() => setDeleteConfirm(true)} />
                    )
                  ) : isAdmin ? (
                    /* ── Admin: no delete, no report (they're insiders) ── */
                    null
                  ) : (
                    /* ── Viewer / Member: Report + Restrict + Block ── */
                    <>
                      <SettingRow icon={<ShieldAlert size={14} />} label="Report Group" isDanger onClick={() => setCurrentView("report")} hasArrow />
                      <SettingRow
                        icon={restrictDone ? <Check size={14} /> : <UserMinus size={14} />}
                        label={restrictDone ? "Group Restricted" : "Restrict Group"}
                        isDanger
                        onClick={() => !restrictDone && setRestrictDone(true)}
                        rightEl={restrictDone ? <span className="text-[10px] font-black text-red-400 uppercase tracking-wide">Done</span> : undefined}
                      />
                      <SettingRow
                        icon={blockDone ? <Check size={14} /> : <Ban size={14} />}
                        label={blockDone ? "Group Blocked" : "Block Group"}
                        isDanger
                        onClick={() => !blockDone && setBlockDone(true)}
                        rightEl={blockDone ? <span className="text-[10px] font-black text-red-400 uppercase tracking-wide">Done</span> : undefined}
                      />
                    </>
                  )}
                </div>
              </section>

              {/* Leave — non-owner + joined */}
              {!isOwner && isJoined && (
                <button
                  onClick={onLeave}
                  className="w-full py-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-100 hover:border-red-500 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <LogOut size={14} /> Leave Group
                </button>
              )}
            </div>
          </div>
        )}

        {/* ════ MEMBERS VIEW ════ */}
        {currentView === "members" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200" onClick={e => e.stopPropagation()}>

            {/* Pending join requests — owner only */}
            {isOwner && pendingRequests.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                  <Clock size={9} /> {pendingRequests.length} Pending Request{pendingRequests.length > 1 ? "s" : ""}
                </p>
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-amber-100 rounded-full flex items-center justify-center text-[12px] font-black text-amber-600 shrink-0">
                        {req.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#1c1917]">{req.name}</span>
                        <span className="text-[10px] text-stone-400 font-medium">Wants to join</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approveGroupJoinRequest(String(group.id), req.id)}
                        className="h-7 w-7 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center hover:bg-green-100 active:scale-95 transition-all"
                      >
                        <Check size={12} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => declineGroupJoinRequest(String(group.id), req.id)}
                        className="h-7 w-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 active:scale-95 transition-all"
                      >
                        <X size={12} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="h-px bg-stone-100 my-1" />
              </div>
            )}

            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">{members.length} Members</p>
            <div className="flex flex-col gap-1.5">
              {members.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl hover:border-stone-200 transition-colors relative">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-stone-100 rounded-full flex items-center justify-center text-[12px] font-black text-stone-600 shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-[#1c1917]">{member.name}</span>
                        {member.role !== "Member" && (
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${member.role === "Owner" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                            {member.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-stone-400">@{member.name.split(" ")[0].toLowerCase()}</span>
                    </div>
                  </div>
                  {(isOwner || (isAdmin && member.role === "Member")) && member.role !== "Owner" && (
                    <div className="relative">
                      <button
                        onClick={e => { e.stopPropagation(); setMemberActionMenu(memberActionMenu === i ? null : i); }}
                        className="p-1.5 text-stone-400 hover:text-[#1c1917] hover:bg-stone-100 rounded-full transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {memberActionMenu === i && (
                        <div className="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-xl border border-stone-200/60 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                          {member.role === "Member" ? (
                            <button onClick={() => handlePromote(i)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                              <Shield size={13} className="text-blue-500" /> Make Admin
                            </button>
                          ) : (
                            <button onClick={() => handleDemote(i)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[#1c1917] hover:bg-stone-50 transition-colors">
                              <Shield size={13} className="text-stone-400" /> Remove Admin
                            </button>
                          )}
                          <div className="h-px bg-stone-100 my-1 mx-2" />
                          <button onClick={() => handleRemove(i)} className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 transition-colors">
                            <UserX size={13} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                  Back to Group Info
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[12px] font-bold leading-snug">You are reporting this group for violating community guidelines.</p>
                </div>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Select a Reason</p>
                <div className="flex flex-col gap-1.5">
                  {REPORT_REASONS.map((reason, i) => (
                    <button key={i} onClick={() => setReportSubmitted(true)}
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
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Group Name</label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-[13px] font-bold text-[#1c1917] outline-none focus:border-stone-400 transition-colors"
                placeholder="Group name"
              />
            </div>
            {(() => {
              const cooldown = getHandleCooldown(storeGroup?.handleLastEditedAt, GROUP_HANDLE_COOLDOWN_DAYS, storeGroup?.handleEditCount ?? 0);
              return (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Handle</label>
                    {!cooldown.canEdit && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 uppercase tracking-wide">
                        <Clock size={9} /> {cooldown.daysLeft}d cooldown
                      </span>
                    )}
                    {cooldown.canEdit && storeGroup?.handleLastEditedAt && (
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wide">Available</span>
                    )}
                  </div>
                  {cooldown.canEdit ? (
                    <>
                      <input
                        value={editHandle}
                        onChange={e => setEditHandle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-[13px] font-semibold text-[#1c1917] outline-none focus:border-stone-400 transition-colors"
                        placeholder="@group_name/gr/owner_id"
                      />
                      <p className="text-[9px] text-stone-300 font-medium px-1">
                        Letters, numbers, underscores · First 2 edits free · {GROUP_HANDLE_COOLDOWN_DAYS}-day wait from 3rd edit
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
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Description</label>
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-[12px] font-medium text-[#1c1917] outline-none focus:border-stone-400 transition-colors resize-none"
                placeholder="Group description"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest px-1">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setEditCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all active:scale-95 ${editCategory === cat ? "bg-[#1c1917] text-white border-[#1c1917]" : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSaveEdit}
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
    <button onClick={onClick}
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
