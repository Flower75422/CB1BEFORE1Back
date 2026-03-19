"use client";
import { useState } from "react";
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

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setShowInfo(false); 
  };

  const renderHistoryList = () => {
    if (activeTab === "channels") return <ChannelList onSelect={handleSelect} />;
    if (activeTab === "groups") return <GroupList onSelect={handleSelect} />;
    return <DirectChatList onSelect={handleSelect} />;
  };

  const renderContentFeed = () => {
    if (activeTab === "channels") return <ChannelContentFeed data={selectedItem} onToggleInfo={() => setShowInfo(!showInfo)} isInfoOpen={showInfo} />;
    if (activeTab === "groups") return <GroupContentFeed data={selectedItem} onToggleInfo={() => setShowInfo(!showInfo)} isInfoOpen={showInfo} onStartCall={() => {}} />;
    return <DirectChatFeed data={selectedItem} onToggleInfo={() => setShowInfo(!showInfo)} isInfoOpen={showInfo} onStartCall={() => {}} />;
  };

  const renderInfoPanel = () => {
    if (activeTab === "channels") return <ChannelInfoPanel data={selectedItem} onClose={() => setShowInfo(false)} />;
    if (activeTab === "groups") return <GroupInfoPanel data={selectedItem} onClose={() => setShowInfo(false)} />;
    return <DirectChatInfoPanel data={selectedItem} onClose={() => setShowInfo(false)} />;
  };

  return (
    <main className="h-full bg-[#FDFBF7] overflow-hidden p-4">
      <ChatBoxSize 
        showInfo={showInfo}
        sidebar={
          <>
            <DisplayFeature onTabChange={setActiveTab} />
            {renderHistoryList()}
          </>
        }
        content={
          <>
            {renderContentFeed()}
            {activeTab !== "channels" && <ChatInput />}
          </>
        }
        infoPanel={renderInfoPanel()}
      />
    </main>
  );
}