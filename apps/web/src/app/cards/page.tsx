"use client";

import TopicPool from "./components/filter-header/TopicPool";
import DisplayViewStyle from "./components/card-search-engine/DisplayViewStyle";
import Feed from "./components/feeds/Feed";
import CardSettings from "./components/cardsettings/CardSettings";
import ChannelViewContainer from "./components/card-channel/ChannelViewContainer";
import CardChatView from "./components/card-chat/CardChatView";
import OtherUserProfileView from "./components/universal-other-user/OtherUserProfileView";

import { useAuthStore } from "@/store/auth/auth.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";
import { useCardsEditorStore } from "@/store/cards/cards.editor.store";

export default function CardsPage() {
  const { user } = useAuthStore();
  const { activeFilter, setActiveFilter, myCards } = useCardsFeedStore();
  const { activeChannelData, activeChatUser, activeProfileUser, openChannel, openChat, openProfile, closeAllViews } = useCardsSearchStore();
  
  const { isSettingsView, setIsSettingsView, setDraftCards, setActiveIndex } = useCardsEditorStore();

  const handleOpenSettings = (cardId?: any) => {
    const targetId = typeof cardId === "string" ? cardId : undefined;

    setDraftCards([...myCards]);
    
    if (targetId && myCards.length > 0) {
      const clickedIndex = myCards.findIndex(c => c.id === targetId);
      setActiveIndex(clickedIndex !== -1 ? clickedIndex : 0);
    } else {
      setActiveIndex(0);
    }
    
    setIsSettingsView(true);
  };

  return (
    <main className="relative flex flex-col w-full h-full min-h-screen bg-[#FDFBF7] text-[#1c1917] transition-colors duration-200">
      
      {/* Feed view — normal scrollable layout */}
      {!activeChannelData && !activeChatUser && !activeProfileUser && (
        <div className="flex flex-col flex-1 w-full max-w-[1400px] mx-auto px-6 pt-2 pb-20">
          <div className="w-full mb-6">
            <DisplayViewStyle
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenSettings={() => handleOpenSettings()}
              onOpenChannel={openChannel}
              onOpenChat={openChat}
              onOpenProfile={openProfile}
            />
            <div className="mt-4">
              <TopicPool />
            </div>
          </div>
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <Feed onEditCard={handleOpenSettings} />
          </div>
        </div>
      )}

      {/* Chat / Channel / Profile view
          fixed to the viewport height, starting AFTER the sidebar (left-64)
          so it's always centred in the content column regardless of scroll position */}
      {(activeProfileUser || activeChannelData || activeChatUser) && (
        <div className="fixed top-0 bottom-0 left-64 right-0 overflow-y-auto z-30 bg-[#FDFBF7]">
          <div className="w-full max-w-[1400px] mx-auto px-6 pt-2 pb-20">
            {activeProfileUser ? (
              <OtherUserProfileView user={activeProfileUser} onBack={closeAllViews} />
            ) : activeChannelData ? (
              <ChannelViewContainer data={activeChannelData} onBack={closeAllViews} />
            ) : activeChatUser ? (
              <CardChatView user={activeChatUser} onBack={closeAllViews} />
            ) : null}
          </div>
        </div>
      )}

      {/* 🔴 THE FIX: Removed the extra absolute div. CardSettings handles itself now. */}
      {isSettingsView && <CardSettings />}

    </main>
  );
}