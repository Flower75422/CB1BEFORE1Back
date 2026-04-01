"use client";
import { useState, useMemo, useEffect } from "react";
import { X, BellOff, Image as ImageIcon, Users, LogOut, ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle, Crown, Link2, Copy, Check, Paperclip, FileText } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

const REPORT_REASONS = [
  "Spam or harmful content",
  "Harassment or bullying",
  "Inappropriate content",
  "False information",
  "Violates community guidelines",
];

type ViewState = "main" | "members" | "report" | "media";

export default function GroupInfoPanel({ data, onClose }: any) {
  const name   = data?.name || "Group";
  const groupId = data?.id;

  const {
    myGroups,
    mutedGroupIds,
    muteGroup,
    unmuteGroup,
    leaveGroup,
    joinedGroupIds,
    groupMessages,
    groupMemberDeltas,
  } = useCommunitiesStore();
  const { user } = useAuthStore();

  const [currentView, setCurrentView]       = useState<ViewState>("main");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [linkCopied, setLinkCopied]           = useState(false);

  // Reset sub-view when switching to a different group while panel is open
  useEffect(() => { setCurrentView("main"); setReportSubmitted(false); }, [groupId]);

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/join?group=${groupId}`
    : `/join?group=${groupId}`;

  const handleCopyInvite = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).catch(() => {});
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const groupData   = myGroups.find((g) => String(g.id) === String(groupId));
  const isMuted     = mutedGroupIds.map(String).includes(String(groupId));
  const isJoined    = joinedGroupIds.map(String).includes(String(groupId));
  const isOwner     = groupData?.ownerId === user?.id;
  const delta       = groupMemberDeltas[groupId] ?? 0;
  const memberCount = (groupData?.members ?? 0) + delta;

  // Build member list from store or derive from message history
  const members = useMemo(() => {
    const stored = groupData?.groupMembers;
    if (stored && stored.length > 0) return stored;
    const msgs = groupMessages[groupId] || [];
    const senderMap = new Map<string, string>();
    msgs.forEach((m) => {
      if (!m.isMe && m.sender) senderMap.set(m.sender, "Member");
    });
    if (user?.name) senderMap.set(user.name, isOwner ? "Owner" : "Member");
    return Array.from(senderMap.entries()).map(([name, role]) => ({ name, role }));
  }, [groupData, groupMessages, groupId, user?.name, isOwner]);

  // Shared media: messages containing 📎 (file attachments)
  const sharedMedia = useMemo(() => {
    const msgs = groupMessages[groupId] || [];
    return msgs.filter((m: any) => m.text?.includes("📎")).map((m: any) => ({
      id: m.id,
      name: m.text.replace("📎 ", "").trim(),
      sender: m.isMe ? (user?.name || "You") : (m.sender || "Member"),
      time: m.time || "",
    }));
  }, [groupMessages, groupId, user?.name]);

  const handleLeave = () => {
    if (groupId) leaveGroup(groupId);
    onClose();
  };

  const viewTitle =
    currentView === "main"    ? "Group Details" :
    currentView === "members" ? "Members" :
    currentView === "media"   ? "Shared Media" :
    "Report Group";

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-stone-50 border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-3">
          {currentView !== "main" && (
            <button
              onClick={() => { setCurrentView("main"); setReportSubmitted(false); }}
              className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
          )}
          <h3 className="text-[14px] font-black text-[#1c1917] uppercase tracking-wide">{viewTitle}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-[#1c1917] hover:bg-stone-200/50 rounded-xl transition-all active:scale-95">
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">

        {/* ── MAIN VIEW ── */}
        {currentView === "main" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">
            {/* Hero */}
            <div className="p-6 flex flex-col items-center text-center border-b border-stone-200/50 bg-white w-full overflow-hidden">
              <div className="h-24 w-24 bg-stone-100 border border-stone-200/60 rounded-[24px] flex items-center justify-center text-3xl font-black text-stone-400 mb-4 overflow-hidden shrink-0">
                {groupData?.avatarUrl ? (
                  <img src={groupData.avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0)
                )}
              </div>
              <h2 className="text-[17px] font-black text-[#1c1917] tracking-tight w-full truncate px-2">{name}</h2>
              {(data?.desc ?? groupData?.desc) && (
                <p className="text-[12px] text-stone-500 mt-2 w-full leading-relaxed break-words px-2">{data?.desc ?? groupData?.desc}</p>
              )}
              <button
                onClick={() => setCurrentView("members")}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-widest text-stone-600 hover:bg-stone-100 transition-colors active:scale-95"
              >
                <Users size={13} /> {memberCount} Members
              </button>
              {groupData?.activity && (
                <span className={`mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  groupData.activity === "Very Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {groupData.activity}
                </span>
              )}
            </div>

            {/* Settings */}
            <div className="p-5 flex flex-col gap-2">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Settings</h4>

              {/* Mute toggle */}
              <button
                onClick={() => groupId && (isMuted ? unmuteGroup(groupId) : muteGroup(groupId))}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <BellOff size={16} className="text-stone-400" />
                  <span className="text-[13px] font-bold text-[#1c1917]">Mute Group</span>
                </div>
                <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isMuted ? "bg-stone-300" : "bg-green-500"}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? "left-1" : "translate-x-5"}`} />
                </div>
              </button>

              <button
                onClick={() => setCurrentView("members")}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex items-center gap-3 shadow-sm"
              >
                <Users size={16} className="text-stone-400" />
                <span className="text-[13px] font-bold text-[#1c1917]">View Members</span>
              </button>

              {/* Shared Media — navigates to media view */}
              <button
                onClick={() => setCurrentView("media")}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon size={16} className="text-stone-400" />
                  <span className="text-[13px] font-bold text-[#1c1917]">Shared Media</span>
                </div>
                {sharedMedia.length > 0 && (
                  <span className="text-[10px] font-black text-stone-400">{sharedMedia.length}</span>
                )}
              </button>

              {/* Invite link */}
              <button
                onClick={handleCopyInvite}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Link2 size={16} className="text-stone-400" />
                  <span className="text-[13px] font-bold text-[#1c1917]">Invite Link</span>
                </div>
                <span className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${linkCopied ? "text-green-500" : "text-stone-400"}`}>
                  {linkCopied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </span>
              </button>

              {/* Report — non-owners only */}
              {!isOwner && (
                <button
                  onClick={() => setCurrentView("report")}
                  className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-red-100 hover:bg-red-50 text-red-500 transition-colors flex items-center gap-3 shadow-sm mt-1"
                >
                  <ShieldAlert size={16} />
                  <span className="text-[13px] font-bold">Report Group</span>
                </button>
              )}

              {/* Leave — only for joined non-owners */}
              {!isOwner && isJoined && (
                <button
                  onClick={handleLeave}
                  className="mt-4 w-full p-3.5 rounded-2xl bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white text-red-600 transition-all flex items-center justify-center gap-2 shadow-sm font-black text-[11px] uppercase tracking-widest active:scale-95"
                >
                  <LogOut size={16} /> Leave Group
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── MEMBERS VIEW ── */}
        {currentView === "members" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">{memberCount} Members</h4>
            {members.length > 0 ? (
              members.map((m: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:border-stone-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-stone-100 rounded-full flex items-center justify-center text-[12px] font-black text-stone-500">
                      {m.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#1c1917]">{m.name || "Member"}</span>
                        {(m.role === "Owner" || m.role === "Admin") && (
                          <span className={`flex items-center gap-0.5 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                            m.role === "Owner" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {m.role === "Owner" && <Crown size={8} />} {m.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">{m.handle || m.role || "Member"}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[12px] text-stone-400">No member data yet</div>
            )}
          </div>
        )}

        {/* ── SHARED MEDIA VIEW ── */}
        {currentView === "media" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
            {sharedMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-300">
                <Paperclip size={28} strokeWidth={1.5} />
                <p className="text-[12px] font-medium text-stone-400">No shared files yet</p>
                <p className="text-[11px] text-stone-300">Files shared in the group will appear here</p>
              </div>
            ) : (
              <>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">{sharedMedia.length} File{sharedMedia.length !== 1 ? "s" : ""}</h4>
                {sharedMedia.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:border-stone-200 transition-colors">
                    <div className="h-10 w-10 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-stone-400" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-[#1c1917] truncate">{file.name}</span>
                      <span className="text-[10px] text-stone-400">{file.sender} · {file.time}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── REPORT VIEW ── */}
        {currentView === "report" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
            {reportSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-[16px] font-black text-[#1c1917]">Report Submitted</h3>
                <p className="text-[12px] font-medium text-stone-500 max-w-[200px] leading-relaxed">
                  We'll review this group and take appropriate action.
                </p>
                <button
                  onClick={() => { setCurrentView("main"); setReportSubmitted(false); }}
                  className="mt-2 px-6 py-2.5 bg-[#1c1917] text-white rounded-full text-[11px] font-black uppercase tracking-widest active:scale-95"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                  <AlertTriangle size={18} />
                  <span className="text-[12px] font-bold leading-tight">Reporting <strong>{name}</strong> for violating guidelines.</span>
                </div>
                {REPORT_REASONS.map((reason, i) => (
                  <button
                    key={i}
                    onClick={() => setReportSubmitted(true)}
                    className="w-full p-4 bg-white border border-stone-200 rounded-xl text-[13px] font-bold text-left hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
