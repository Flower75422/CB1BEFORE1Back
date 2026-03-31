import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen: string; // ISO date string
}

interface UsersState {
  users: User[];
  followingIds: string[]; // IDs the owner follows

  getUser: (id: string) => User | undefined;
  getUserByName: (name: string) => User | undefined;
  follow: (id: string) => void;
  unfollow: (id: string) => void;
  setOnline: (id: string, online: boolean) => void;
}

const now = new Date().toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const hrsAgo  = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const SEED_USERS: User[] = [
  {
    id: "u_1", name: "Wasim Akram", handle: "@wasim",
    avatarUrl: "https://ui-avatars.com/api/?name=Wasim+Akram&background=1c1917&color=fff&size=150",
    isOnline: true, lastSeen: now,
    bio: "Full-Stack Engineer · Building Cobucket",
  },
  {
    id: "u_2", name: "Aisha Khan", handle: "@aisha",
    avatarUrl: "https://ui-avatars.com/api/?name=Aisha+Khan&background=f59e0b&color=fff&size=150",
    isOnline: true, lastSeen: now,
    bio: "Product Designer · UI/UX enthusiast",
  },
  {
    id: "u_3", name: "Alex Rivera", handle: "@alexr",
    avatarUrl: "https://ui-avatars.com/api/?name=Alex+Rivera&background=3b82f6&color=fff&size=150",
    isOnline: false, lastSeen: minsAgo(5),
    bio: "Frontend Developer",
  },
  {
    id: "u_4", name: "Elena Rodriguez", handle: "@elena_r",
    avatarUrl: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=8b5cf6&color=fff&size=150",
    isOnline: false, lastSeen: hrsAgo(2),
    bio: "Web3 Researcher",
  },
  {
    id: "u_5", name: "Marco Polo", handle: "@marco",
    avatarUrl: "https://ui-avatars.com/api/?name=Marco+Polo&background=10b981&color=fff&size=150",
    isOnline: true, lastSeen: now,
    bio: "Startup founder · Ex-Googler",
  },
  {
    id: "u_6", name: "Sarah Chen", handle: "@sarah_c",
    avatarUrl: "https://ui-avatars.com/api/?name=Sarah+Chen&background=ec4899&color=fff&size=150",
    isOnline: false, lastSeen: daysAgo(1),
    bio: "Data Scientist",
  },
  {
    id: "u_7", name: "David Kim", handle: "@dkim",
    avatarUrl: "https://ui-avatars.com/api/?name=David+Kim&background=f97316&color=fff&size=150",
    isOnline: false, lastSeen: hrsAgo(3),
    bio: "Backend engineer · Python & Rust",
  },
  {
    id: "u_8", name: "Priya Sharma", handle: "@priya_s",
    avatarUrl: "https://ui-avatars.com/api/?name=Priya+Sharma&background=06b6d4&color=fff&size=150",
    isOnline: true, lastSeen: now,
    bio: "Mobile developer · React Native",
  },
  {
    id: "u_9", name: "Omar Hassan", handle: "@omar_h",
    avatarUrl: "https://ui-avatars.com/api/?name=Omar+Hassan&background=84cc16&color=fff&size=150",
    isOnline: false, lastSeen: minsAgo(30),
    bio: "DevOps Engineer",
  },
  {
    id: "u_10", name: "Zara Ahmed", handle: "@zara_a",
    avatarUrl: "https://ui-avatars.com/api/?name=Zara+Ahmed&background=ef4444&color=fff&size=150",
    isOnline: false, lastSeen: daysAgo(2),
    bio: "Crypto analyst · DeFi",
  },
  {
    id: "u_11", name: "Luca Ferrari", handle: "@luca_f",
    avatarUrl: "https://ui-avatars.com/api/?name=Luca+Ferrari&background=6366f1&color=fff&size=150",
    isOnline: false, lastSeen: minsAgo(10),
    bio: "Game developer · Unity",
  },
  {
    id: "u_12", name: "Mia Johnson", handle: "@mia_j",
    avatarUrl: "https://ui-avatars.com/api/?name=Mia+Johnson&background=d97706&color=fff&size=150",
    isOnline: true, lastSeen: now,
    bio: "Content creator · Tech blogger",
  },
];

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: SEED_USERS,
      followingIds: ["u_2", "u_3", "u_5", "u_8"], // owner follows these users

      getUser: (id) => get().users.find((u) => u.id === id),
      getUserByName: (name) =>
        get().users.find((u) => u.name.toLowerCase() === name.toLowerCase()),

      follow: (id) =>
        set((s) => ({
          followingIds: s.followingIds.includes(id)
            ? s.followingIds
            : [...s.followingIds, id],
        })),

      unfollow: (id) =>
        set((s) => ({
          followingIds: s.followingIds.filter((i) => i !== id),
        })),

      setOnline: (id, online) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id
              ? { ...u, isOnline: online, lastSeen: online ? new Date().toISOString() : u.lastSeen }
              : u
          ),
        })),
    }),
    {
      name: 'cobucket-users',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        followingIds: state.followingIds,
        // Don't persist users — always use seed data (lastSeen would be stale)
      }),
    }
  )
);

/** Format lastSeen ISO string to human-readable relative label */
export function formatLastSeen(user: User): string {
  if (user.isOnline) return "Active now";
  const diff = Date.now() - new Date(user.lastSeen).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return "Active just now";
  if (mins < 60)  return `Active ${mins}m ago`;
  if (hours < 24) return `Active ${hours}h ago`;
  if (days === 1) return "Active yesterday";
  return `Active ${days} days ago`;
}
