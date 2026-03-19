"use client";

import { useState } from "react";
import TopicPool from "./components/filter-header/TopicPool";
import DisplayViewStyle from "./components/card-search-engine/DisplayViewStyle";
import Feed from "./components/feeds/Feed";
import CardSettings from "./components/cardsettings/CardSettings";
import ChannelViewContainer from "./components/card-channel/ChannelViewContainer";
import CardChatView from "./components/card-chat/CardChatView";

// 🔴 1. IMPORT THE NEW UNIVERSAL PUBLIC PROFILE VIEW
import OtherUserProfileView from "./components/universal-other-user/OtherUserProfileView";

const GLOBAL_USER = {
  name: "Sarah Designer",
  handle: "@sarah_ux",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
};

export default function CardsPage() {
  const [activeFilter, setActiveFilter] = useState("For You");
  const [isSettingsView, setIsSettingsView] = useState(false);
  const [activeChannelData, setActiveChannelData] = useState<any>(null);
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [myCards, setMyCards] = useState<any[]>([]);
  
  const [activeProfileUser, setActiveProfileUser] = useState<any>(null);

  const handleOpenChannel = (data: any) => {
    setActiveChannelData(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenChat = (user: any) => {
    setActiveChatUser(user);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenProfile = (user: any) => {
    setActiveProfileUser(user);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToFeed = () => {
    setActiveChannelData(null);
    setActiveChatUser(null);
    setActiveProfileUser(null); 
  };

  return (
    <main className="relative flex flex-col w-full h-full min-h-screen bg-[#FDFBF7] text-[#1c1917]">
      <div
        className={`flex flex-col flex-1 w-full max-w-[1400px] mx-auto px-6 pt-2 pb-20 ${
          isSettingsView ? "hidden" : "flex"
        }`}
      >
        {!activeChannelData && !activeChatUser && !activeProfileUser && !isSettingsView && (
          <div className="w-full mb-6">
            <DisplayViewStyle
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenSettings={() => setIsSettingsView(true)}
              onOpenChannel={handleOpenChannel}
              onOpenChat={handleOpenChat}
              onOpenProfile={handleOpenProfile} 
            />
            <div className="mt-4">
              <TopicPool activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>
          </div>
        )}
        
        {activeProfileUser ? (
          // 🔴 2. SHOW THE PUBLIC PROFILE INSTEAD OF YOUR PERSONAL ONE
          <div className="flex-1 w-full pt-4">
            <OtherUserProfileView 
              user={activeProfileUser} 
              onBack={handleBackToFeed} 
            />
          </div>

        ) : activeChannelData ? (
          <div className="flex-1 w-full pt-4">
            <ChannelViewContainer data={activeChannelData} onBack={handleBackToFeed} />
          </div>

        ) : activeChatUser ? (
          <div className="flex-1 w-full pt-4">
            <CardChatView user={activeChatUser} onBack={handleBackToFeed} />
          </div>

        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <Feed
              activeFilter={activeFilter}
              onOpenChannel={handleOpenChannel}
              onOpenChat={handleOpenChat}
              myCards={myCards}
              globalUser={GLOBAL_USER}
              onEditCard={(cardId) => { setIsSettingsView(true); }}
            />
          </div>
        )}
      </div>

      {isSettingsView && (
        <div className="absolute inset-0 z-30 bg-[#FDFBF7] flex flex-col px-6 pt-6 pb-6 overflow-hidden">
          <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col min-h-0 animate-in fade-in duration-300">
            <CardSettings
              initialCards={myCards}
              globalUser={GLOBAL_USER}
              onSave={(savedDeck: any) => { setMyCards(savedDeck); setIsSettingsView(false); }}
              onBack={() => setIsSettingsView(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}