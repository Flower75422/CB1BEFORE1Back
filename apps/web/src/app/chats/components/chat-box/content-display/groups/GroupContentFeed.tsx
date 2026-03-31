"use client";
import { Phone, Video, Info, Search, X, Users, Pin } from "lucide-react";
import CallOverlay from "../shared/CallOverlay";
import ChatBubble from "../shared/ChatBubble";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useUsersStore } from "@/store/users/users.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { useChatsStore } from "@/store/chats/chats.store";
import { useEffect, useRef, useState, useMemo } from "react";

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

function cleanHandle(h?: string) {
  if (!h) return "";
  return h.split("/gr/")[0].split("/ch/")[0];
}

export default function GroupContentFeed({ data, onToggleInfo, isInfoOpen, onStartCall }: any) {
  const name    = data?.name || "Group Chat";
  const groupId = data?.id;
  const handle  = cleanHandle(data?.handle);
  const members = data?.members ?? null;

  const rawMessages = useCommunitiesStore((state) => state.groupMessages[groupId]) || [];
  const { myGroups, addGroupMessageReaction, deleteGroupMessage, pinnedGroupMessageIds } = useCommunitiesStore();
  const { getUserByName } = useUsersStore();
  const { user: authUser } = useAuthStore();
  const { setReplyingTo } = useChatsStore();

  // Pinned message for this group
  const pinnedMsgId = pinnedGroupMessageIds?.[groupId] ?? null;
  const pinnedMsg   = pinnedMsgId ? rawMessages.find((m: any) => m.id === pinnedMsgId) : null;
  const prevLenRef = useRef(rawMessages.length);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [typingName, setTypingName] = useState("");
  const [callOpen, setCallOpen]   = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);

  // Clear search + typing indicator when switching groups
  useEffect(() => {
    setShowSearch(false);
    setSearchQuery("");
    setIsTyping(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    prevLenRef.current = rawMessages.length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [rawMessages, isTyping]);

  // Typing indicator using real sender names from message history
  useEffect(() => {
    const newLen = rawMessages.length;
    const lastMsg = rawMessages[newLen - 1];
    if (newLen > prevLenRef.current && lastMsg?.isMe) {
      // Use actual senders from message history, not fake names
      const realSenders = rawMessages
        .filter((m: any) => !m.isMe && m.sender)
        .map((m: any) => m.sender as string);
      const uniqueSenders = [...new Set(realSenders)];
      const nameToShow = uniqueSenders.length > 0
        ? uniqueSenders[newLen % uniqueSenders.length]
        : "Someone";
      setTypingName(nameToShow);
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setIsTyping(false), 1800);
    }
    prevLenRef.current = newLen;
  }, [rawMessages]);

  useEffect(() => () => { if (typingTimerRef.current) clearTimeout(typingTimerRef.current); }, []);

  const displayMessages = useMemo(() => {
    if (!searchQuery.trim()) return rawMessages;
    const q = searchQuery.toLowerCase();
    return rawMessages.filter((m: any) => m.text?.toLowerCase().includes(q));
  }, [rawMessages, searchQuery]);

  // Group by date for separators
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
      <CallOverlay isOpen={callOpen} callerName={name} onClose={() => setCallOpen(false)} />

      {/* Header */}
      <div className="h-16 px-6 bg-stone-50 flex justify-between items-center shrink-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1 overflow-hidden" onClick={onToggleInfo}>
          <div className="h-9 w-9 rounded-[12px] bg-white border border-stone-200 overflow-hidden flex items-center justify-center text-stone-500 font-medium shrink-0">
            {data?.avatarUrl ? (
              <img src={data.avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Users size={16} />
            )}
          </div>
          {/* Name + status — single horizontal line */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="text-[14px] font-medium text-stone-700 group-hover:text-stone-900 truncate shrink">{name}</span>
            <span className="text-stone-300 text-[11px] shrink-0">·</span>
            <span className="text-[11px] shrink-0 truncate">
              {isTyping ? (
                <span className="text-green-500 font-medium animate-pulse">{typingName} is typing…</span>
              ) : (
                <span className="text-stone-400">
                  {handle || (members !== null ? `${members.toLocaleString()} members` : `${rawMessages.length} msg${rawMessages.length !== 1 ? "s" : ""}`)}
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCallOpen(true)} title="Voice call" className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 rounded-xl transition-all active:scale-95">
            <Phone size={18} strokeWidth={1.8} />
          </button>
          <button onClick={() => setCallOpen(true)} title="Video call" className="p-2.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 rounded-xl transition-all active:scale-95">
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
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-stone-400 hover:text-[#1c1917]">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Pinned message banner */}
      {pinnedMsg && !searchQuery && (
        <div className="mx-4 mb-0 mt-0 px-4 py-2.5 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-center gap-3 shrink-0">
          <Pin size={13} className="text-amber-500 shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Pinned Message</span>
            <span className="text-[11px] text-amber-700 font-medium truncate">{pinnedMsg.text}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6 scroll-smooth">

        {/* Empty state */}
        {rawMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-300">
            <Users size={32} strokeWidth={1.2} />
            <p className="text-[13px] font-medium text-stone-400">No messages yet</p>
            <p className="text-[11px] text-stone-300">Be the first to say something 👋</p>
          </div>
        )}

        {displayMessages.length === 0 && searchQuery && (
          <div className="flex items-center justify-center h-full text-stone-400 text-[12px] font-semibold">
            No messages matching "{searchQuery}"
          </div>
        )}

        {/* Date-grouped messages */}
        {messageGroups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-stone-200/60" />
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest shrink-0">{group.label}</span>
              <div className="flex-1 h-px bg-stone-200/60" />
            </div>
            {group.msgs.map((msg: any, idx: number) => {
              const isSender   = msg.isMe ?? msg.isSender ?? false;
              const prevMsg    = idx > 0 ? group.msgs[idx - 1] : null;
              const showSender = !prevMsg || prevMsg.sender !== msg.sender || (prevMsg.isMe ?? prevMsg.isSender);
              // Resolve sender avatarUrl from users.store
              const senderUser = msg.sender ? getUserByName(msg.sender) : null;
              return (
                <ChatBubble
                  key={msg.id}
                  msg={{
                    id:        msg.id,
                    text:      msg.text,
                    time:      msg.time,
                    isSender,
                    replyTo:   msg.replyTo,
                    reactions: msg.reactions,
                    status:    "read",
                  }}
                  senderName={msg.sender}
                  senderAvatarUrl={senderUser?.avatarUrl}
                  showSenderInfo={showSender}
                  onReply={(m) => setReplyingTo({
                    id: m.id, text: m.text,
                    senderName: isSender ? (authUser?.name || "You") : (msg.sender || "Member"),
                  })}
                  onReact={(msgId, emoji) => addGroupMessageReaction(groupId, msgId, emoji, authUser?.id || "u_1")}
                  onCopy={(text) => navigator.clipboard?.writeText(text)}
                  onDelete={(msgId) => deleteGroupMessage(groupId, msgId)}
                />
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && !searchQuery && (
          <div className="flex flex-col items-start mb-3.5">
            <span className="text-[10px] font-bold text-stone-400 mb-1 ml-1 uppercase tracking-wide">{typingName}</span>
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
    </div>
  );
}
