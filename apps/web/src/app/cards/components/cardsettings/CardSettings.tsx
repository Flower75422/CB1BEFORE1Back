"use client";

import { useState } from "react";
import { FilePlus, LayoutGrid, ChevronRight, ArrowLeft } from "lucide-react";
import CardEditor from "./CardEditor";
import CardSettingsTopBar from "./cardsettingstopbar/CardSettingsTopBar";
import CardSettingsFilterBar from "./cardsettingsfilterbar/CardSettingsFilterBar";

import { useAuthStore } from "@/store/auth/auth.store";
import { useCardsEditorStore } from "@/store/cards/cards.editor.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export default function CardSettings() {
  const { user } = useAuthStore();

  const {
    draftCards, activeIndex, setActiveIndex,
    addNewDraft, deleteDraft, setIsSettingsView, updateActiveDraft,
  } = useCardsEditorStore();

  const { setMyCards, saveSingleCard, deleteCard, refreshInterestPool } = useCardsFeedStore();
  const { myChannels, addChannel, removeChannel, setMyChannels } = useCommunitiesStore();

  // Fix #6: cardToChannel now includes links, permissions, pool, avatarUrl
  const cardToChannel = (card: any) => ({
    id: card.channel?.id || card.id,
    name: card.channel?.name || "Unnamed Card",
    handle: card.channel?.id ? `@${card.channel.id}` : `@${card.id}`,
    members: card.stats?.members || 0,
    desc: card.bio || "",
    isPrivate: !(card.channel?.isPublic ?? true),
    category: card.interests?.primary || "General",
    ownerId: user?.id || "u_1",
    // Only sync non-base64 avatar URLs to avoid bloating the communities store
    avatarUrl: card.profilePicUrl && !card.profilePicUrl.startsWith('data:') ? card.profilePicUrl : undefined,
    links: card.links || [],
    pool: card.interests?.pool || [],
    permissions: card.permissions
      ? {
          allowComments: card.permissions.allowComments !== false,
          allowReactions: card.permissions.allowReactions !== false,
          tier: card.permissions.tier || "Free",
          reachability: card.permissions.reachability || "Global",
          searchIndexing: card.permissions.searchIndexing !== false,
          isNSFW: card.permissions.isNSFW || false,
        }
      : undefined,
  });

  // Upsert: update existing channel or add new one
  const upsertCardAsChannel = (card: any) => {
    const ch = cardToChannel(card);
    const exists = myChannels.some((c) => c.id === ch.id);
    if (exists) {
      setMyChannels(myChannels.map((c) => (c.id === ch.id ? ch : c)));
    } else {
      addChannel(ch);
    }
  };

  const [showEmptyStateChannelSelect, setShowEmptyStateChannelSelect] = useState(false);

  const activeCard = draftCards[activeIndex];
  const isDeckEmpty = draftCards.length === 0;

  const isValidCard = (card: any) => {
    const name = card?.channel?.name?.trim();
    const handle = card?.channel?.id?.trim();
    return name && handle && name.length > 0 && handle.length > 0;
  };

  const handleSaveDeck = () => {
    const hasInvalidCard = draftCards.some((card) => !isValidCard(card));
    if (hasInvalidCard) {
      alert("Cannot save! Please ensure all cards have a valid Card Name and Card Handle.");
      return;
    }
    setMyCards([...draftCards]);
    draftCards.forEach(upsertCardAsChannel);
    // Fix #8: refresh interest pool after saving so feed filters update
    refreshInterestPool();
    setIsSettingsView(false);
  };

  const handleSaveSingleCard = (index: number) => {
    const targetCard = draftCards[index];
    if (!isValidCard(targetCard)) {
      alert("Cannot save! Please ensure this card has a valid Card Name and Card Handle.");
      return;
    }
    saveSingleCard(targetCard);
    upsertCardAsChannel(targetCard);
    // Fix #8: refresh interest pool after saving single card too
    refreshInterestPool();
    alert(`"${targetCard.channel.name || 'Card'}" saved to your deck successfully!`);
  };

  const handleDeleteCard = (index: number, withChannel: boolean = false) => {
    const cardToDelete = draftCards[index];
    if (!cardToDelete) return;
    deleteCard(cardToDelete.id);
    deleteDraft(index);
    if (withChannel) removeChannel(cardToDelete.channel?.id || cardToDelete.id);
  };

  const handleBack = () => {
    setIsSettingsView(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 left-64 flex flex-col items-center bg-[#FDFBF7] overflow-hidden p-6 pt-2 select-none z-[100] animate-in fade-in duration-200">

      <CardSettingsTopBar onBack={handleBack} onSave={handleSaveDeck} isEmpty={isDeckEmpty} />

      {isDeckEmpty ? (

        <div className="flex-1 w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 pb-20">
          <div className="flex flex-col items-center max-w-sm w-full gap-8">
            <div className="text-center space-y-2">
              <h2 className="text-[16px] font-semibold text-stone-700">Your Deck is Empty</h2>
              <p className="text-[13px] text-stone-500">Create a blank identity or link one of your existing communities to get started.</p>
            </div>

            {!showEmptyStateChannelSelect ? (
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => addNewDraft(user)}
                  className="group flex items-center p-4 bg-white border border-stone-200 rounded-2xl hover:border-black hover:shadow-md transition-all text-left"
                >
                  <div className="h-12 w-12 bg-stone-100 rounded-xl flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors text-stone-600 mr-4 shrink-0">
                    <FilePlus size={20} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-stone-700">Create Blank Card</h3>
                    <p className="text-[12px] text-stone-400 mt-0.5">Start entirely from scratch</p>
                  </div>
                  <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-600 transition-colors" />
                </button>

                <button
                  onClick={() => setShowEmptyStateChannelSelect(true)}
                  className="group flex items-center p-4 bg-white border border-stone-200 rounded-2xl hover:border-black hover:shadow-md transition-all text-left"
                >
                  <div className="h-12 w-12 bg-stone-100 rounded-xl flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors text-stone-600 mr-4 shrink-0">
                    <LayoutGrid size={20} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-stone-700">Link Existing Channel</h3>
                    <p className="text-[12px] text-stone-400 mt-0.5">Import an active community</p>
                  </div>
                  <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-600 transition-colors" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full animate-in fade-in duration-200">
                <button
                  onClick={() => setShowEmptyStateChannelSelect(false)}
                  className="text-[12px] font-medium text-stone-400 hover:text-stone-700 self-start flex items-center gap-1.5 mb-4 px-2 py-1 -ml-2 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <ArrowLeft size={14} strokeWidth={1.8} /> Back
                </button>

                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-stone-50 border-b border-stone-100 px-4 py-3">
                    <span className="text-[11px] text-stone-400">Select a Channel</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto no-scrollbar flex flex-col p-2 gap-1 w-full">
                    {myChannels.length === 0 ? (
                      <div className="text-center py-8 text-[12px] text-stone-400">No channels available.</div>
                    ) : (
                      myChannels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => {
                            addNewDraft(user, channel);
                            setShowEmptyStateChannelSelect(false);
                          }}
                          className="flex items-center p-3 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-colors text-left group"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-[13px] font-medium text-stone-700 truncate">{channel.name}</h3>
                            <p className="text-[11px] text-stone-400 mt-0.5 truncate">{channel.handle}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      ) : (

        <>
          <CardSettingsFilterBar
            cards={draftCards}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onAdd={(existingChannel: any) => addNewDraft(user, existingChannel)}
            onDelete={handleDeleteCard}
            onSaveSingleCard={handleSaveSingleCard}
          />

          <div className="flex-1 w-full max-w-4xl mx-auto overflow-hidden">
            {activeCard && (
              <CardEditor
                user={user}
                card={activeCard}
                updateCard={updateActiveDraft}
                onDelete={() => handleDeleteCard(activeIndex)}
              />
            )}
          </div>
        </>
      )}

    </div>
  );
}
