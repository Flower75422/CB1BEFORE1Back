import { create } from 'zustand';

interface ProfileState {
  profileData: any | null;
  setProfileData: (data: any) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileData: null,
  setProfileData: (data) => set({ profileData: data }),
}));