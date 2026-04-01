"use client";
import { Phone, Video, Info, Search, X, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import ChatBubble from "../shared/ChatBubble";
import CallOverlay from "../shared/CallOverlay";
import ForwardModal from "../shared/ForwardModal";
import ScrollToBottomFab from "../shared/ScrollToBottomFab";
import { useChatsStore } from "@/store/chats/chats.store";
import { useUsersStore, formatLastSeen } from "@/store/users/users.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { useEffect, useRef, useState, useMemo } from "react";

/** Returns a human-readable date label from an ISO string */
function getDateLabel(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yest  = new Date(today); yest.setDate(yest.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === yest.getTime())  return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DirectChatFeed({ data, onToggleInfo, isInfoOpen, onStartCall }: any) {
  const name    = data?.name || "Select a chat";
  const chatId  = data?.id;

  const { addReaction, deleteMessage, editMessage, forwardMessage, setReplyingTo, clearChatHistory } = useChatsStore();
  const [forwardingMsgId, setForwardingMsgId] = useState<string | null>(null);
  const [newMsgCount, setNewMsgCount] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const { getUserByName, getUser } = useUsersStore();
  const { user: authUser } = useAuthStore();

  // Look up the other person from users.store for avatarUrl + online status
  const chatUser = data?.userId ? getUser(data.userId) : getUserByName(name);
  const statusLabel = chatUser ? formatLastSeen(chatUser) : "Active now";
  const isOnline    = chatUser?.isOnline ?? false;

  const messages   = useChatsStore((state) => state.messages[chatId]) || [];
  const prevLenRef = useRef(messages.length);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const [callOpen, setCallOpen]     = useState(false);
  const [callType, setCallType]     = useState<"voice" | "video">("voice");
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);

  // Clear search + typing indicator when switching chats
  useEffect(() => {
    setShowSearch(false);
    setSearchQuery("");
    setIsTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    prevLenRef.current = messages.length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Auto-scroll if near bottom, otherwise show new message count
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distFromBottom < 200) {
      el.scrollTop = el.scrollHeight;
      setNewMsgCount(0);
    } else if (messages.length > prevLenRef.current) {
      setNewMsgCount((c) => c + 1);
    }
  }, [messages, isTyping]);

  // Show "typing…" for 1.8s after the user sends
  useEffect(() => {
    const newLen = messages.length;
    const lastMsg = messages[newLen - 1];
    if (newLen > prevLenRef.current && lastMsg?.isSender) {
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setIsTyping(false), 1800);
    }
    prevLenRef.current = newLen;
  }, [messages]);

  useEffect(() => () => { if (typingTimerRef.current) clearTimeout(typingTimerRef.current); }, []);

  // Close more menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
        setShowClearConfirm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClearHistory = () => {
    if (!chatId) return;
    clearChatHistory(chatId);
    setShowMoreMenu(false);
    setShowClearConfirm(false);
  };

  const displayMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter((m: any) => m.text?.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  // Group messages by date for separators
  const messageGroups = useMemo(() => {
    const groups: { label: string; msgs: any[] }[] = [];
    let currentLabel = "";
    displayMessages.forEach((msg: any) => {
      const label = getDateLabel(msg.createdAt) || "Earlier";
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, msgs: [msg] });
      } else {
        groups[groups.length - 1].msgs.push(msg);
      }
    });
    return groups;
  }, [displayMessages]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFA] relative">

      {/* Call overlay */}
      <CallOverlay isOpen={callOpen} callerName={name} callType={callType} onClose={() => setCallOpen(false)} />

      {/* Header */}
      <div className="h-16 px-6 bg-stone-50 flex justify-between items-center shrink-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1 overflow-hidden" onClick={onToggleInfo}>
          {/* Avatar with online dot */}
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-full bg-white border border-stone-200 overflow-hidden flex items-center justify-center text-stone-500 text-[13px] font-medium">
              {chatUser?.avatarUrl ? (
                <img src={chatUser.avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0)
              )}
            </div>
            {/* Online status dot — green when online, grey when offline */}
            <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-stone-50 shadow-sm ${isOnline ? "bg-green-400" : "bg-stone-300"}`} />
          </div>
          {/* Name + status — single horizontal line, truncates on overflow */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="text-[14px] font-medium text-stone-700 group-hover:text-stone-900 truncate shrink">{name}</span>
            <span className="text-stone-300 text-[11px] shrink-0">·</span>
            <span className="text-[11px] shrink-0 truncate">
              {isTyping ? (
                <span className="text-green-500 font-medium animate-pulse">typing…</span>
              ) : (
                <span className={isOnline ? "text-green-500 font-medium" : "text-stone-400"}>{statusLabel}</span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setCallType("voice"); setCallOpen(true); }} title="Voice call" className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-[#1c1917] rounded-xl transition-all active:scale-95">
            <Phone size={18} strokeWidth={1.8} />
          </button>
          <button onClick={() => { setCallType("video"); setCallOpen(true); }} title="Video call" className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-[#1c1917] rounded-xl transition-all active:scale-95">
            <Video size={18} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => { setShowSearch((v) => !v); setSearchQuery(""); }}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${showSearch ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
          >
            <Search size={18} strokeWidth={1.8} />
          </button>
          <button
            onClick={onToggleInfo}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${isInfoOpen ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
          >
            <Info size={18} strokeWidth={1.8} />
          </button>

          {/* More options dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => { setShowMoreMenu((v) => !v); setShowClearConfirm(false); }}
              className={`p-2.5 rounded-xl transition-all active:scale-95 ${showMoreMenu ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
              title="More options"
            >
              <MoreVertical size={18} strokeWidth={1.8} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-auto"
                  >
                    <Trash2 size={14} className="text-red-400" />
                    Clear Chat History
                  </button>
                ) : (
                  <div className="px-4 py-3 flex flex-col gap-2.5">
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Remove <span className="font-semibold text-stone-700">{name}</span> and delete all messages? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearHistory}
                        className="flex-1 py-1.5 rounded-xl text-[11px] font-bold bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95"
                      >
                        Yes, Clear
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 py-1.5 rounded-xl text-[11px] font-medium border border-stone-200 text-stone-500 hover:bg-stone-50 transition-all active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="px-4 py-2 bg-white border-b border-stone-100 flex items-center gap-2 shrink-0 animate-in slide-in-from-top-2 duration-200">
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 h-9 bg-stone-100 rounded-full px-4 text-[12px] font-bold text-[#1c1917] placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-300 focus:bg-white transition-all"
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-stone-400 hover:text-[#1c1917] transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6 scroll-smooth">

        {/* Empty state */}
        {messages.length === 0 && !searchQuery && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-300">
            <MessageCircle size={32} strokeWidth={1.2} />
            <p className="text-[13px] font-medium text-stone-400">No messages yet</p>
            <p className="text-[11px] text-stone-300">Say something to start the conversation 👋</p>
          </div>
        )}

        {/* Search empty state */}
        {displayMessages.length === 0 && searchQuery && (
          <div className="flex items-center justify-center h-full text-stone-400 text-[12px] font-semibold">
            No messages matching "{searchQuery}"
          </div>
        )}

        {/* Date-grouped messages */}
        {messageGroups.map((group) => (
          <div key={group.label}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-stone-200/60" />
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest shrink-0">{group.label}</span>
              <div className="flex-1 h-px bg-stone-200/60" />
            </div>
            {group.msgs.map((msg: any) => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                onReply={(m) => setReplyingTo({ id: m.id, text: m.text, senderName: m.isSender ? (authUser?.name || "You") : name })}
                onReact={(msgId, emoji) => addReaction(chatId, msgId, emoji, authUser?.id || "u_1")}
                onCopy={(text) => navigator.clipboard?.writeText(text)}
                onDelete={(msgId) => deleteMessage(chatId, msgId)}
                onEdit={(msgId, newText) => editMessage(chatId, msgId, newText)}
                onForward={(msgId) => setForwardingMsgId(msgId)}
              />
            ))}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && !searchQuery && (
          <div className="flex items-start mb-3.5">
            <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-stone-200/60 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 bg-stone-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 bg-stone-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll-to-bottom FAB */}
      <ScrollToBottomFab scrollRef={scrollRef} newMessageCount={newMsgCount} onScrolledToBottom={() => setNewMsgCount(0)} />

      {/* Forward modal */}
      <ForwardModal
        isOpen={!!forwardingMsgId}
        onClose={() => setForwardingMsgId(null)}
        onSelect={(targetId, targetTab) => {
          if (forwardingMsgId) forwardMessage(chatId, forwardingMsgId, targetId, targetTab);
          setForwardingMsgId(null);
        }}
      />
    </div>
  );
}
