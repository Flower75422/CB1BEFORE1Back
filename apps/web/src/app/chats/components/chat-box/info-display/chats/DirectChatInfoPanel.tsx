"use client";
import React, { useState, useMemo, useEffect } from "react";
import { X, BellOff, Bell, Image as ImageIcon, ShieldAlert, UserMinus, User, ArrowLeft, CheckCircle, AlertTriangle, Paperclip, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePrivacyStore } from "@/store/privacy/privacy.store";
import { useChatsStore } from "@/store/chats/chats.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { useUsersStore } from "@/store/users/users.store";

const REPORT_REASONS = [
  "Spam or unwanted messages",
  "Harassment or bullying",
  "Inappropriate content",
  "Fake or impersonation account",
  "Violates community guidelines",
];

type ViewState = "main" | "media" | "report";

export default function DirectChatInfoPanel({ data, onClose }: any) {
  const name   = data?.name || "User";
  const chatId = String(data?.id ?? data?.name ?? "");

  const router = useRouter();
  const { addChannel } = usePrivacyStore();
  const { mutedChatIds, toggleMuteChat, messages: allMessages } = useChatsStore();
  const { user } = useAuthStore();
  const { getUser, getUserByName } = useUsersStore();

  // Resolve real user data (avatar + bio) from users.store
  const chatUser = data?.userId ? getUser(data.userId) : getUserByName(name);

  const isMuted = mutedChatIds.includes(chatId);

  const [currentView, setCurrentView]         = useState<ViewState>("main");
  const [reportSubmitted, setReportSubmitted]  = useState(false);

  // Reset sub-view when switching to a different chat while panel is open
  useEffect(() => { setCurrentView("main"); setReportSubmitted(false); }, [chatId]);

  // Shared media: DM messages containing 📎
  const sharedMedia = useMemo(() => {
    const msgs = allMessages[chatId] || [];
    return msgs
      .filter((m: any) => m.text?.includes("📎"))
      .map((m: any) => ({
        id: m.id,
        name: m.text.replace("📎 ", "").trim(),
        sender: m.isSender ? (user?.name || "You") : name,
        time: m.time || "",
      }));
  }, [allMessages, chatId, user?.name, name]);

  const handleBlock = () => {
    addChannel({
      id: chatId,
      title: name,
      handle: data?.handle,
      avatarUrl: data?.avatarUrl,
      action: "block",
    });
    onClose?.();
  };

  const handleMute = () => toggleMuteChat(chatId);

  const handleViewProfile = () => {
    if (chatUser?.id) {
      router.push(`/profile?userId=${chatUser.id}`);
    } else {
      router.push(`/profile?user=${encodeURIComponent(name)}`);
    }
  };

  const viewTitle =
    currentView === "main"   ? "Profile Details" :
    currentView === "media"  ? "Shared Media" :
    "Report User";

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
        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-[#1c1917] hover:bg-stone-200/50 rounded-xl transition-all active:scale-95"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">

        {/* ── MAIN VIEW ── */}
        {currentView === "main" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">
            {/* Hero */}
            <div className="p-6 flex flex-col items-center text-center border-b border-stone-200/50 bg-white w-full overflow-hidden">
              <div className="h-24 w-24 bg-stone-100 border border-stone-200/60 rounded-full flex items-center justify-center text-3xl font-black text-stone-400 mb-4 overflow-hidden shrink-0">
                {chatUser?.avatarUrl ? (
                  <img src={chatUser.avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0)
                )}
              </div>
              <h2 className="text-[17px] font-black text-[#1c1917] tracking-tight w-full truncate px-2">{name}</h2>
              {chatUser?.bio && (
                <p className="text-[12px] text-stone-500 mt-1.5 w-full leading-relaxed break-words px-2">{chatUser.bio}</p>
              )}
              <button
                onClick={handleViewProfile}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#1c1917] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black active:scale-95 shadow-md transition-all"
              >
                <User size={14} /> View Full Profile
              </button>
            </div>

            {/* Settings */}
            <div className="p-5 flex flex-col gap-2">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Settings</h4>

              {/* Mute toggle */}
              <button
                onClick={handleMute}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {isMuted
                    ? <Bell size={16} className="text-stone-400" />
                    : <BellOff size={16} className="text-stone-400" />
                  }
                  <span className="text-[13px] font-bold text-[#1c1917]">
                    {isMuted ? "Unmute Notifications" : "Mute Notifications"}
                  </span>
                </div>
                {isMuted && (
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-wide">Muted</span>
                )}
              </button>

              {/* Shared Media */}
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

              {/* Danger Zone */}
              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1.5 ml-1 mt-4">Danger Zone</h4>

              <button
                onClick={handleBlock}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-red-100 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 shadow-sm"
              >
                <UserMinus size={16} />
                <span className="text-[13px] font-bold">Block User</span>
              </button>

              <button
                onClick={() => setCurrentView("report")}
                className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-red-100 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 shadow-sm"
              >
                <ShieldAlert size={16} />
                <span className="text-[13px] font-bold">Report User</span>
              </button>
            </div>
          </div>
        )}

        {/* ── SHARED MEDIA VIEW ── */}
        {currentView === "media" && (
          <div className="p-5 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
            {sharedMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-300">
                <Paperclip size={28} strokeWidth={1.5} />
                <p className="text-[12px] font-medium text-stone-400">No shared files yet</p>
                <p className="text-[11px] text-stone-300">Files shared in this chat will appear here</p>
              </div>
            ) : (
              <>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
                  {sharedMedia.length} File{sharedMedia.length !== 1 ? "s" : ""}
                </h4>
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
                  We'll review this user and take appropriate action.
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
