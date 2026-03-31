import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrivacyAction = 'hide' | 'restrict' | 'block';
export type VisibilityLevel = 'public' | 'followers' | 'private';

// Channels cover both community channels AND card-linked channels.
// id is a string so both numeric community IDs and string card-channel IDs work.
export interface HiddenChannel {
  id: string;
  title: string;
  handle?: string;   // card-channel handle / community channel handle
  avatarUrl?: string;
  action: PrivacyAction;
}

export interface HiddenGroup {
  id: number;
  title: string;
  avatarUrl?: string;
  action: PrivacyAction;
}

interface PrivacyState {
  // Visibility settings
  profileVisibility: VisibilityLevel;
  postVisibility: VisibilityLevel;
  allowMessages: boolean;
  allowTagging: boolean;

  setProfileVisibility: (v: VisibilityLevel) => void;
  setPostVisibility: (v: VisibilityLevel) => void;
  toggleAllowMessages: () => void;
  toggleAllowTagging: () => void;

  // Managed content
  hiddenChannels: HiddenChannel[];
  hiddenGroups: HiddenGroup[];

  addChannel: (channel: HiddenChannel) => void;
  removeChannel: (id: string) => void;

  addGroup: (group: HiddenGroup) => void;
  removeGroup: (id: number) => void;
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      profileVisibility: 'public',
      postVisibility: 'public',
      allowMessages: true,
      allowTagging: true,

      setProfileVisibility: (profileVisibility) => set({ profileVisibility }),
      setPostVisibility: (postVisibility) => set({ postVisibility }),
      toggleAllowMessages: () => set((s) => ({ allowMessages: !s.allowMessages })),
      toggleAllowTagging: () => set((s) => ({ allowTagging: !s.allowTagging })),

      hiddenChannels: [],
      hiddenGroups: [],

      addChannel: (channel) =>
        set((s) => ({
          hiddenChannels: s.hiddenChannels.some((c) => c.id === channel.id)
            ? s.hiddenChannels.map((c) => (c.id === channel.id ? channel : c))
            : [...s.hiddenChannels, channel],
        })),
      removeChannel: (id) =>
        set((s) => ({ hiddenChannels: s.hiddenChannels.filter((c) => c.id !== id) })),

      addGroup: (group) =>
        set((s) => ({
          hiddenGroups: s.hiddenGroups.some((g) => g.id === group.id)
            ? s.hiddenGroups.map((g) => (g.id === group.id ? group : g))
            : [...s.hiddenGroups, group],
        })),
      removeGroup: (id) =>
        set((s) => ({ hiddenGroups: s.hiddenGroups.filter((g) => g.id !== id) })),
    }),
    { name: 'cobucket-privacy' }
  )
);
