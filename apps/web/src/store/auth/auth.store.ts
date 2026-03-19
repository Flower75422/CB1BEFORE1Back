import { create } from 'zustand';

interface AuthState {
  user: { id: string; name: string; handle: string; avatarUrl: string | null; role: string } | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Mocking a logged-in Owner for UI testing
  user: { 
    id: "u_1", 
    name: "Wasim Akram", 
    handle: "@wasim", 
    avatarUrl: null, 
    role: "Owner" 
  },
  isAuthenticated: true, 
  isInitialized: true,

  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));