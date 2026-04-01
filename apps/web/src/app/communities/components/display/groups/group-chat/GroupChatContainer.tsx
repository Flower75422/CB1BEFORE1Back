"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import GroupChatTop from "./GroupChatTop";
import GroupChatBody from "./GroupChatBody";
import GroupChatBottom from "./GroupChatBottom";
import GroupMoreFeature from "./GroupMoreFeature";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

export default function GroupChatContainer({ group, onClose }: any) {
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { joinedGroupIds, joinGroup, leaveGroup, pendingGroupJoinIds, requestJoinGroup, cancelJoinRequest, groupMessages, addGroupMessage } = useCommunitiesStore();
  const { user } = useAuthStore();

  const isJoined = joinedGroupIds.includes(String(group.id));
  const isOwner = group.isOwner ?? (group.ownerId === user?.id);
  const isAdmin = !isOwner && !!(group.admins?.includes(user?.id || ""));
  const isPending = pendingGroupJoinIds.includes(String(group.id));

  const messages = groupMessages[String(group.id)] || [];

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(m => m.text.toLowerCase().includes(q) || m.sender.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  useEffect(() => {
    const rootMain = document.querySelector("main");
    if (rootMain) {
      const orig = rootMain.style.overflow;
      rootMain.style.overflow = "hidden";
      return () => { rootMain.style.overflow = orig; };
    } else {
      const orig = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = orig; };
    }
  }, []);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addGroupMessage(String(group.id), {
      id: `gm_${Date.now()}`,
      sender: user?.name || "You",
      text: text.trim(),
      time,
      isMe: true,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] max-h-full min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 duration-300">

      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? 'w-2/3 border-r border-stone-200' : 'w-full'}`}>
        <GroupChatTop
          group={group}
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
              placeholder="Search messages..."
              className="flex-1 h-9 bg-stone-100 rounded-full px-4 text-[12px] font-bold text-[#1c1917] placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-300 focus:bg-white transition-all"
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-stone-400 hover:text-[#1c1917] transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        <GroupChatBody messages={filteredMessages} />
        <GroupChatBottom
          onSend={handleSend}
          isJoined={isJoined || isOwner}
          isPrivate={group.isPrivate}
          isPending={isPending}
          onJoin={() => joinGroup(String(group.id))}
          onRequest={() => requestJoinGroup(String(group.id))}
          onCancelRequest={() => cancelJoinRequest(String(group.id))}
        />
      </div>

      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative">
          <GroupMoreFeature
            group={group}
            isOwner={isOwner}
            isAdmin={isAdmin}
            isJoined={isJoined}
            onJoin={() => joinGroup(String(group.id))}
            onLeave={() => { leaveGroup(String(group.id)); setShowInfo(false); }}
            onCloseInfo={() => setShowInfo(false)}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
}
