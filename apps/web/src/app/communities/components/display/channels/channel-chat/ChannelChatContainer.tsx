"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import ChannelChatTop from "./ChannelChatTop";
import ChannelChatBody from "./ChannelChatBody";
import ChannelChatBottom from "./ChannelChatBottom";
import ChannelMoreFeature from "./ChannelMoreFeature";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

export default function ChannelChatContainer({ channel, onClose }: any) {
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { subscribedChannelIds, subscribeChannel, unsubscribeChannel, channelBroadcasts, addBroadcast, pinnedBroadcastIds, pendingChannelSubscribeIds, requestSubscribeChannel, cancelChannelSubscribeRequest } = useCommunitiesStore();
  const { user } = useAuthStore();

  const isSubscribed = subscribedChannelIds.includes(String(channel.id));
  const isOwner = channel.isOwner ?? (channel.ownerId === user?.id);
  const isPending = pendingChannelSubscribeIds.includes(String(channel.id));
  const messages = channelBroadcasts[String(channel.id)] || [];
  const pinnedId = pinnedBroadcastIds[String(channel.id)];
  const pinnedBroadcast = pinnedId ? messages.find((m) => m.id === pinnedId) ?? null : null;

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(m => m.text.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  useEffect(() => {
    const rootMain = document.querySelector("main");
    if (rootMain) {
      const originalOverflow = rootMain.style.overflow;
      rootMain.style.overflow = "hidden";
      return () => { rootMain.style.overflow = originalOverflow; };
    } else {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = originalStyle; };
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] max-h-full min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? 'w-2/3 border-r border-stone-200' : 'w-full'}`}>
        <ChannelChatTop
          channel={channel}
          onClose={onClose}
          onToggleInfo={() => setShowInfo(!showInfo)}
          isInfoOpen={showInfo}
          onToggleSearch={() => { setShowSearch(s => !s); setSearchQuery(""); }}
          isSearchOpen={showSearch}
        />
        {showSearch && (
          <div className="px-4 py-2 bg-white border-b border-stone-100 flex items-center gap-2 shrink-0">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search broadcasts..."
              className="flex-1 h-9 bg-stone-100 rounded-full px-4 text-[12px] font-bold text-[#1c1917] placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-300 focus:bg-white transition-all"
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-stone-400 hover:text-[#1c1917] transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        <ChannelChatBody messages={filteredMessages} pinnedBroadcast={pinnedBroadcast} />
        <ChannelChatBottom
          isSubscribed={isSubscribed}
          isOwner={isOwner}
          isPrivate={channel.isPrivate}
          isPending={isPending}
          onSubscribe={() => subscribeChannel(String(channel.id))}
          onUnsubscribe={() => unsubscribeChannel(String(channel.id))}
          onRequest={() => requestSubscribeChannel(String(channel.id))}
          onCancelRequest={() => cancelChannelSubscribeRequest(String(channel.id))}
          onBroadcast={(text) => addBroadcast(String(channel.id), text)}
        />
      </div>

      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative">
          <ChannelMoreFeature
            channel={channel}
            isOwner={isOwner}
            isSubscribed={isSubscribed}
            onSubscribe={() => subscribeChannel(String(channel.id))}
            onLeave={() => { unsubscribeChannel(String(channel.id)); setShowInfo(false); }}
            onCloseInfo={() => setShowInfo(false)}
          />
        </div>
      )}
    </div>
  );
}
