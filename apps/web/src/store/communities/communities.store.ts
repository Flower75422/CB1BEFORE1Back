import { create } from 'zustand';

interface CommunitiesState {
  myChannels: any[];
  myGroups: any[];
  setMyChannels: (channels: any[]) => void;
  setMyGroups: (groups: any[]) => void;
}

export const useCommunitiesStore = create<CommunitiesState>((set) => ({
  myChannels: [],
  myGroups: [],
  setMyChannels: (channels) => set({ myChannels: channels }),
  setMyGroups: (groups) => set({ myGroups: groups }),
}));