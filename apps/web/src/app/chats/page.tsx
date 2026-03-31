"use client";

import { useState, useEffect } from "react";
import ChatBoxSize from "./components/chat-box/layout/ChatBoxSize";
import DisplayFeature from "./components/chat-box/history-display/shared/DisplayFeature";
import DirectChatList from "./components/chat-box/history-display/chats/DirectChatList";
import ChannelList from "./components/chat-box/history-display/channels/ChannelList";
import GroupList from "./components/chat-box/history-display/groups/GroupList";
import DirectChatFeed from "./components/chat-box/content-display/chats/DirectChatFeed";
import ChannelContentFeed from "./components/chat-box/content-display/channels/ChannelContentFeed";
import GroupContentFeed from "./components/chat-box/content-display/groups/GroupContentFeed";
import DirectChatInfoPanel from "./components/chat-box/info-display/chats/DirectChatInfoPanel";
import ChannelInfoPanel from "./components/chat-box/info-display/channels/ChannelInfoPanel";
import GroupInfoPanel from "./components/chat-box/info-display/groups/GroupInfoPanel";
import ChatInput from "./components/chat-box/content-display/shared/ChatInput";

import { useChatsStore } from "@/store/chats/chats.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export default function ChatPage() {
  const { activeTab, activeChatId, directChats, channels, groups } = useChatsStore();
  const { myChannels, myGroups } = useCommunitiesStore();
  const [showInfo, setShowInfo] = useState(false);

  // Close info panel whenever the active tab changes — avoids stale/wrong panel showing
  useEffect(() => { setShowInfo(false); }, [activeTab]);

  // Per-tab lookup so the richest data source always wins.
  // Channels/Groups: communitiesStore first (has avatarUrl, members, handle).
  // DMs: chats.store only (directChats).
  const activeData = (() => {
    if (!activeChatId) return undefined;
    if (activeTab === "channels")
      return [...myChannels, ...channels].find((i) => String(i.id) === String(activeChatId));
    if (activeTab === "groups")
      return [...myGroups, ...groups].find((i) => String(i.id) === String(activeChatId));
    return directChats.find((i) => String(i.id) === String(activeChatId));
  })();

  // 🔴 We strictly wrap the setShowInfo in an arrow function so it doesn't fire on render
  const handleHideInfo = () => setShowInfo(false);
  const handleToggleInfo = () => setShowInfo(!showInfo);

  const renderHistoryList = () => {
    if (activeTab === "channels") return <ChannelList onSelect={handleHideInfo} />;
    if (activeTab === "groups") return <GroupList onSelect={handleHideInfo} />;
    return <DirectChatList onSelect={handleHideInfo} />;
  };

  const renderContentFeed = () => {
    if (!activeChatId) return <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] text-stone-400 font-bold">Select a conversation</div>;

    if (activeTab === "channels") return <ChannelContentFeed data={activeData} onToggleInfo={handleToggleInfo} isInfoOpen={showInfo} />;
    if (activeTab === "groups") return <GroupContentFeed data={activeData} onToggleInfo={handleToggleInfo} isInfoOpen={showInfo} onStartCall={() => {}} />;
    return <DirectChatFeed data={activeData} onToggleInfo={handleToggleInfo} isInfoOpen={showInfo} onStartCall={() => {}} />;
  };

  const renderInfoPanel = () => {
    if (activeTab === "channels") return <ChannelInfoPanel data={activeData} onClose={handleHideInfo} />;
    if (activeTab === "groups") return <GroupInfoPanel data={activeData} onClose={handleHideInfo} />;
    return <DirectChatInfoPanel data={activeData} onClose={handleHideInfo} />;
  };

  return (
    <main className="h-full bg-[#FDFBF7] overflow-hidden p-4">
      <ChatBoxSize 
        showInfo={showInfo}
        sidebar={
          <>
            {/* 🔴 DisplayFeature now handles its own state internally via Zustand */}
            <DisplayFeature />
            {renderHistoryList()}
          </>
        }
        content={
          <>
            {renderContentFeed()}
            {activeChatId && activeTab !== "channels" && <ChatInput />}
          </>
        }
        infoPanel={renderInfoPanel()}
      />
    </main>
  );
}