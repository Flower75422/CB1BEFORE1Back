"use client";
import { Bell, BellOff, Share, Info, SendHorizonal, Megaphone, Pin, PinOff, Check, Search, X, Eye, Smile } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { useEffect, useRef, useState } from "react";

function cleanHandle(h?: string) {
  if (!h) return "";
  return h.split("/ch/")[0];
}

export default function ChannelContentFeed({ data, onToggleInfo, isInfoOpen }: any) {
  const name     = data?.name || "Channel";
  const chanId   = data?.id;
  const handle   = cleanHandle(data?.handle);
  const members  = data?.members ?? null;

  const allMessages = useCommunitiesStore((state) => state.channelBroadcasts[chanId]) || [];
  const pinnedId    = useCommunitiesStore((state) => state.pinnedBroadcastIds[chanId]);
  const { addBroadcast, addBroadcastReaction, pinBroadcast, unpinBroadcast, myChannels, mutedChannelIds, muteChannel, unmuteChannel } = useCommunitiesStore();
  const { user } = useAuthStore();

  const isOwner  = myChannels.some((c) => c.id === chanId && c.ownerId === user?.id);
  const isMuted  = mutedChannelIds.includes(String(chanId));
  const pinnedMsg = allMessages.find((m) => m.id === pinnedId) ?? null;

  const [broadcastText, setBroadcastText] = useState("");
  const [shareCopied,   setShareCopied]   = useState(false);
  const [showSearch,    setShowSearch]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter broadcasts by search
  const messages = searchQuery.trim()
    ? allMessages.filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : allMessages;

  // Reset search state when switching channels
  useEffect(() => {
    setShowSearch(false);
    setSearchQuery("");
    setBroadcastText("");
  }, [chanId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [allMessages]);

  const handleBroadcast = () => {
    if (!broadcastText.trim() || !chanId) return;
    addBroadcast(chanId, broadcastText.trim());
    setBroadcastText("");
  };

  const handlePin = (broadcastId: string) => {
    if (!chanId) return;
    pinnedId === broadcastId ? unpinBroadcast(chanId) : pinBroadcast(chanId, broadcastId);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/channel/${chanId}`
      : `/channel/${chanId}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFA]">

      {/* Header */}
      <div className="h-16 px-6 bg-stone-50 flex justify-between items-center shrink-0 z-10 border-b border-stone-100">
        <div className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1 overflow-hidden" onClick={onToggleInfo}>
          <div className="h-9 w-9 rounded-[12px] bg-white border border-stone-200 overflow-hidden flex items-center justify-center text-stone-500 font-medium text-[13px] shrink-0">
            {data?.avatarUrl ? (
              <img src={data.avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          {/* Name + meta — single horizontal line */}
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="text-[14px] font-medium text-stone-700 group-hover:text-stone-900 truncate shrink">{name}</span>
            <span className="text-stone-300 text-[11px] shrink-0">·</span>
            <span className="text-[11px] text-stone-400 truncate shrink-0">
              {handle
                ? handle
                : members !== null
                  ? `${members.toLocaleString()} subs`
                  : isOwner ? "Owner" : `${messages.length} broadcasts`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Mute / Unmute bell — wired to communitiesStore */}
          <button
            onClick={() => isMuted ? unmuteChannel(String(chanId)) : muteChannel(String(chanId))}
            title={isMuted ? "Unmute channel" : "Mute channel"}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${isMuted ? "text-amber-500 bg-amber-50" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
          >
            {isMuted ? <BellOff size={18} strokeWidth={1.8} /> : <Bell size={18} strokeWidth={1.8} />}
          </button>

          {/* Search broadcasts */}
          <button
            onClick={() => { setShowSearch((v) => !v); setSearchQuery(""); }}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${showSearch ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
            title="Search broadcasts"
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          {/* Share — copies channel link to clipboard */}
          <button
            onClick={handleShare}
            title="Copy channel link"
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${shareCopied ? "text-green-500 bg-green-50" : "text-stone-400 hover:bg-stone-100 hover:text-stone-700"}`}
          >
            {shareCopied ? <Check size={18} strokeWidth={2} /> : <Share size={18} strokeWidth={1.8} />}
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
            placeholder="Search broadcasts..."
            className="flex-1 h-9 bg-stone-100 rounded-full px-4 text-[12px] font-bold text-[#1c1917] placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-300 focus:bg-white transition-all"
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-stone-400 hover:text-[#1c1917]">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Pinned broadcast banner */}
      {pinnedMsg && (
        <div className="mx-4 mt-3 mb-1 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shrink-0">
          <Pin size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Pinned Broadcast</p>
            <p className="text-[12px] text-stone-700 leading-relaxed line-clamp-2">{pinnedMsg.text}</p>
          </div>
          {isOwner && (
            <button onClick={() => unpinBroadcast(chanId)} className="text-amber-400 hover:text-amber-600 transition-colors shrink-0" title="Unpin">
              <PinOff size={14} />
            </button>
          )}
        </div>
      )}

      {/* Broadcasts feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-4 scroll-smooth">
        <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm mb-2">
          <p className="text-[13px] text-stone-500 leading-relaxed">
            Welcome to <strong>{name}</strong>.{" "}
            {isOwner ? "You're the owner — broadcast below." : "Only admins can post here."}
          </p>
        </div>

        {messages.length === 0 && !isOwner && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-stone-300">
            <Megaphone size={24} strokeWidth={1.5} />
            <span className="text-[11px] font-black uppercase tracking-widest">No broadcasts yet</span>
          </div>
        )}

        {messages.map((msg: any) => {
          const isPinned = msg.id === pinnedId;
          return (
            <div key={msg.id} className={`bg-white border rounded-2xl p-5 shadow-sm group relative ${isPinned ? "border-amber-200" : "border-stone-200/60"}`}>
              {isPinned && (
                <div className="flex items-center gap-1 mb-2">
                  <Pin size={10} className="text-amber-500" />
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Pinned</span>
                </div>
              )}
              <p className="text-[13px] text-stone-600 leading-relaxed">{msg.text}</p>

              {/* Reactions row */}
              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {Object.entries(msg.reactions as Record<string, string[]>)
                    .filter(([, users]) => (users as string[]).length > 0)
                    .map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={() => addBroadcastReaction(chanId, msg.id, emoji, user?.id || "u_1")}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-[11px] hover:bg-stone-100 transition-colors active:scale-95"
                      >
                        <span>{emoji}</span>
                        <span className="font-bold text-stone-500 text-[10px]">{(users as string[]).length}</span>
                      </button>
                    ))}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-400">{msg.time}</span>
                  {/* View count */}
                  {msg.views !== undefined && (
                    <span className="flex items-center gap-1 text-[10px] text-stone-400">
                      <Eye size={11} />
                      {msg.views >= 1000
                        ? `${(msg.views / 1000).toFixed(msg.views < 10000 ? 1 : 0)}K`
                        : msg.views}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Quick react */}
                  <button
                    onClick={() => addBroadcastReaction(chanId, msg.id, "❤️", user?.id || "u_1")}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors text-[13px]"
                    title="React"
                  >
                    <Smile size={13} />
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => handlePin(msg.id)}
                      className="flex items-center gap-1 text-[10px] font-bold text-stone-400 hover:text-amber-500 px-2 py-1 rounded-lg hover:bg-amber-50"
                    >
                      {isPinned ? <><PinOff size={12} /> Unpin</> : <><Pin size={12} /> Pin</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Owner broadcast input */}
      {isOwner && (
        <div className="h-[72px] bg-white border-t border-stone-100 px-4 flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Megaphone size={16} className="text-amber-600" />
          </div>
          <div className="flex-1 h-10 bg-stone-100 rounded-full flex items-center px-4 border border-transparent focus-within:border-stone-300 focus-within:bg-white transition-all">
            <input
              type="text"
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleBroadcast(); }}
              placeholder="Broadcast to your subscribers..."
              className="flex-1 bg-transparent text-[13px] font-bold outline-none text-[#1c1917] placeholder:text-stone-400"
            />
          </div>
          <button
            onClick={handleBroadcast}
            disabled={!broadcastText.trim()}
            className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SendHorizonal size={18} className="-ml-0.5 mt-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}
