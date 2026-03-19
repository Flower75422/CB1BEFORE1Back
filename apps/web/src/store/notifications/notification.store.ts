import { create } from 'zustand';

interface NotificationsState {
  unreadCount: number;
  alerts: any[];
  addAlert: (alert: any) => void;
  clearAlerts: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  unreadCount: 0,
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts], unreadCount: state.unreadCount + 1 })),
  clearAlerts: () => set({ alerts: [], unreadCount: 0 }),
}));