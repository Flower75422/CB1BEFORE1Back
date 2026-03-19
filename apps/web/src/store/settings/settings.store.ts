import { create } from 'zustand';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleEmailNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'light',
  emailNotifications: true,
  setTheme: (theme) => set({ theme }),
  toggleEmailNotifications: () => set((state) => ({ emailNotifications: !state.emailNotifications })),
}));