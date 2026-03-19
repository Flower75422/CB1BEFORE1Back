import { create } from 'zustand';

interface ChatsState {
  activeTab: 'chats' | 'channels' | 'groups';
  activeChatId: string | null;
  setActiveTab: (tab: 'chats' | 'channels' | 'groups') => void;
  setActiveChatId: (id: string | null) => void;
}

export const useChatsStore = create<ChatsState>((set) => ({
  activeTab: 'chats',
  activeChatId: null,
  setActiveTab: (tab) => set({ activeTab: tab, activeChatId: null }),
  setActiveChatId: (id) => set({ activeChatId: id }),
}));