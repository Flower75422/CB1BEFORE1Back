import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  language: string;
  socialLinks: Record<string, string>;
  twoFAEnabled: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleEmailNotifications: () => void;
  setLanguage: (language: string) => void;
  setSocialLink: (platform: string, url: string) => void;
  setTwoFAEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      emailNotifications: true,
      language: 'English (US)',
      socialLinks: {},
      twoFAEnabled: false,
      setTheme: (theme) => set({ theme }),
      toggleEmailNotifications: () =>
        set((state) => ({ emailNotifications: !state.emailNotifications })),
      setLanguage: (language) => set({ language }),
      setSocialLink: (platform, url) =>
        set((state) => ({
          socialLinks: { ...state.socialLinks, [platform]: url },
        })),
      setTwoFAEnabled: (twoFAEnabled) => set({ twoFAEnabled }),
    }),
    { name: 'cobucket-settings' }
  )
);
