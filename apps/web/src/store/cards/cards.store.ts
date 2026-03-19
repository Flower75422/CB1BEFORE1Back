import { create } from 'zustand';

interface CardsState {
  myCards: any[];
  activeCardId: string | null;
  setMyCards: (cards: any[]) => void;
  setActiveCardId: (id: string | null) => void;
}

export const useCardsStore = create<CardsState>((set) => ({
  myCards: [], // Will be filled by your mock data arrays initially
  activeCardId: null,
  setMyCards: (cards) => set({ myCards: cards }),
  setActiveCardId: (id) => set({ activeCardId: id }),
}));