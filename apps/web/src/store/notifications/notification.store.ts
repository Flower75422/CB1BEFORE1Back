import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'mention' | 'channel' | 'group' | 'join' | 'broadcast' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarColor?: string;
  targetId?: string;                                          // chat/channel/group ID to navigate to
  targetType?: 'chat' | 'channel' | 'group';                 // which tab to open
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
  // legacy
  alerts: any[];
  addAlert: (alert: any) => void;
  clearAlerts: () => void;
}

const SEED: Notification[] = [
  { id: "n1", type: "mention",   title: "Ravi Singh",            message: "mentioned you in a comment — \"Check out the latest updates here?\"", time: "1h ago",  read: false, avatarInitials: "RS", avatarColor: "bg-blue-100 text-blue-600",   targetId: "1",      targetType: "chat" },
  { id: "n2", type: "mention",   title: "Liam",                  message: "mentioned you in a discussion — \"What do you think about this?\"",    time: "3h ago",  read: false, avatarInitials: "LM", avatarColor: "bg-green-100 text-green-600",  targetId: "2",      targetType: "chat" },
  { id: "n3", type: "channel",   title: "Full Stack Developers",  message: "created a new broadcast — API Integration Guide",                   time: "2d ago",  read: true,  avatarInitials: "FSD", avatarColor: "bg-purple-100 text-purple-600", targetId: "chan_1", targetType: "channel" },
  { id: "n4", type: "join",      title: "Priya Sharma",          message: "joined your group Python Devs",                                      time: "2d ago",  read: true,  avatarInitials: "PS", avatarColor: "bg-amber-100 text-amber-600",   targetId: "grp_1", targetType: "group" },
  { id: "n5", type: "broadcast", title: "UI/UX Daily",           message: "new broadcast — 10 Figma tips you didn't know",                      time: "3d ago",  read: true,  avatarInitials: "UD", avatarColor: "bg-rose-100 text-rose-600",    targetId: "chan_2", targetType: "channel" },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: SEED,
      unreadCount: SEED.filter(n => !n.read).length,
      alerts: [],

      addNotification: (n) => set((state) => {
        const newN: Notification = { ...n, id: `n_${Date.now()}`, read: false };
        return { notifications: [newN, ...state.notifications], unreadCount: state.unreadCount + 1 };
      }),

      markRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - (state.notifications.find(n => n.id === id)?.read ? 0 : 1)),
      })),

      markAllRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),

      clearAll: () => set({ notifications: [], unreadCount: 0, alerts: [] }),

      // legacy compat
      addAlert: (alert) => set((state) => {
        const newNotification: Notification = {
          id: `n_${Date.now()}`,
          type: 'system',
          title: alert.title || 'Alert',
          message: alert.message || alert.text || '',
          time: 'Just now',
          read: false,
        };
        return {
          alerts: [alert, ...state.alerts],
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      }),
      clearAlerts: () => set({ alerts: [] }),
    }),
    {
      name: 'cobucket-notifications',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        alerts: state.alerts,
      }),
    }
  )
);
