import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getUpdatedCards } from '@/app/cards/components/cardsettings/UpdateActiveCard';

interface CardsEditorState {
  isSettingsView: boolean;
  draftCards: any[];
  activeIndex: number;

  setIsSettingsView: (isOpen: boolean) => void;
  setDraftCards: (cards: any[]) => void;
  setActiveIndex: (index: number) => void;
  updateActiveDraft: (updates: any) => void;
  addNewDraft: (globalUser: any, existingChannel?: any) => void;
  deleteDraft: (index: number) => void;
}

// Strip base64 data URLs from a card before persisting to avoid localStorage overflow
const stripBase64FromCard = (card: any) => ({
  ...card,
  profilePicUrl: card.profilePicUrl?.startsWith?.('data:') ? '' : card.profilePicUrl,
  backMediaUrl: card.backMediaUrl?.startsWith?.('data:') ? null : card.backMediaUrl,
  wallPosts: (card.wallPosts || []).map((p: any) => ({
    ...p,
    mediaUrl: p.mediaUrl?.startsWith?.('data:') ? '' : p.mediaUrl,
  })),
});

export const useCardsEditorStore = create<CardsEditorState>()(
  persist(
    (set, get) => ({
      isSettingsView: false,
      draftCards: [],
      activeIndex: 0,

      setIsSettingsView: (isOpen) => set({ isSettingsView: isOpen }),
      setDraftCards: (cards) => set({ draftCards: cards }),
      setActiveIndex: (index) => set({ activeIndex: index }),

      updateActiveDraft: (updates) => {
        const { draftCards, activeIndex } = get();
        const updated = getUpdatedCards(draftCards, activeIndex, updates);
        set({ draftCards: updated });
      },

      addNewDraft: (globalUser, existingChannel = null) => {
        const { draftCards } = get();
        if (draftCards.length >= 9) return;

        const newCard = {
          id: `card_${Date.now()}`,
          bio: '',
          backMediaUrl: null,
          profilePicUrl: null,
          links: [],
          channel: existingChannel
            ? { name: existingChannel.name, id: existingChannel.handle.split('/')[0].replace('@', ''), isPublic: !existingChannel.isPrivate ?? true }
            : { name: 'New Card', id: '', isPublic: true },
          interests: { primary: '', pool: [] },
          // Fix #5: include allowComments and allowReactions with explicit true defaults
          permissions: {
            allowChat: true,
            allowFullProfile: true,
            allowComments: true,
            allowReactions: true,
            searchIndexing: true,
            isNSFW: false,
            tier: 'Free',
            reachability: 'Global',
          },
          team: [{ name: globalUser?.name || 'You', handle: globalUser?.handle || '@user', role: 'Owner' }],
          postAsChannel: true,
          stats: { views: 0, likes: 0, posts: 0 },
          progress: existingChannel ? 2 : 1,
          wallPosts: [],
          location: { enabled: false, name: '' },
        };

        set({ draftCards: [...draftCards, newCard], activeIndex: draftCards.length });
      },

      deleteDraft: (index: number) => {
        const { draftCards, activeIndex } = get();
        const newCards = draftCards.filter((_, idx) => idx !== index);

        let newIndex = activeIndex;
        if (index === activeIndex) {
          newIndex = activeIndex >= newCards.length ? Math.max(0, newCards.length - 1) : activeIndex;
        } else if (index < activeIndex) {
          newIndex = activeIndex - 1;
        }

        set({ draftCards: newCards, activeIndex: newIndex });
      },
    }),
    {
      name: 'cobucket-cards-editor',
      storage: createJSONStorage(() => localStorage),
      // Persist everything except base64 image data (too large for localStorage)
      partialize: (state) => ({
        isSettingsView: state.isSettingsView,
        activeIndex: state.activeIndex,
        draftCards: state.draftCards.map(stripBase64FromCard),
      }),
    }
  )
);
