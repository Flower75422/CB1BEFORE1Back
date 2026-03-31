import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Wallpost {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  facet: string;
  stats: { views: string | number; likes: number };
  date: string;
}

interface ProfileChannel {
  id: number;
  title: string;
  subs: string;
  owner: string;
  desc: string;
  trending?: boolean;
  isPrivate?: boolean;
  avatarUrl?: string;
  isJoined?: boolean;
}

interface ProfileGroup {
  id: number;
  title: string;
  members: string;
  owner: string;
  desc: string;
  isPrivate?: boolean;
  activity: string;
  avatarUrl?: string;
  isJoined?: boolean;
}

interface ProfileState {
  profileData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    avatarUrl: string;
    bannerUrl: string;
    stats: { followers: string | number; following: string | number; views: string | number; };
    bio: { location: string; text: string; status: string; };
  };
  wallposts: Wallpost[];
  channels: ProfileChannel[];
  groups: ProfileGroup[];

  // ── Unique profile visitors ───────────────────────────────────────────────
  // Each user ID appears at most once — gives true unique visitor count
  uniqueVisitorIds: string[];

  // ── Weekly views ──────────────────────────────────────────────────────────
  // Cumulative views across cards, channels, posts this week.
  // Seeded with a realistic starting number; incremented live when content is viewed.
  weeklyViews: number;

  updateProfile: (updates: { name?: string; username?: string; email?: string; phone?: string; bio?: { location?: string; text?: string; status?: string } }) => void;
  updateAvatar: (url: string) => void;
  updateBanner: (url: string) => void;
  addWallpost: (post: Omit<Wallpost, 'id' | 'stats' | 'date'>) => void;
  removeWallpost: (id: string) => void;

  // Records a profile visit — ignored if this userId already visited
  recordVisit: (userId: string) => void;

  // Increments weeklyViews by 1 — called from cardsFeedStore on card view
  bumpWeeklyViews: () => void;
}

// 47 seed visitor IDs — represents unique users who have already visited this profile
const SEED_VISITOR_IDS = Array.from(
  { length: 47 },
  (_, i) => `usr_${String(i + 1).padStart(3, '0')}`
);

const INITIAL_WALLPOSTS: Wallpost[] = [
  { id: "post_1", mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60", mediaType: "image", facet: "Software Dev", stats: { views: "2.4k", likes: 142 }, date: "Oct 12, 2025" },
  { id: "post_2", mediaUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_24fps.mp4", mediaType: "video", facet: "Startup Founder", stats: { views: "8.1k", likes: 890 }, date: "Oct 05, 2025" },
  { id: "post_3", mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60", mediaType: "image", facet: "UI/UX Design", stats: { views: "1.2k", likes: 95 }, date: "Sep 28, 2025" },
];

const INITIAL_CHANNELS: ProfileChannel[] = [
  { id: 1, title: "Next.js Masters", subs: "12.4k", owner: "Wasim Akram", desc: "Official broadcast for Next.js and React architecture updates.", trending: true, isJoined: true },
  { id: 2, title: "UI/UX Daily", subs: "8.1k", owner: "Wasim Akram", desc: "Daily design inspiration, Figma tips, and UI breakdowns.", isPrivate: true, isJoined: true },
  { id: 3, title: "Backend Alpha", subs: "3.2k", owner: "Wasim Akram", desc: "System design, databases, and Python architecture deep dives.", isJoined: true },
];

const INITIAL_GROUPS: ProfileGroup[] = [
  { id: 1, title: "Python Devs", members: "1.2k", owner: "Wasim Akram", desc: "Discussing Django, APIs, and backend scripting.", activity: "Very Active", isJoined: true },
  { id: 2, title: "Startup Builders", members: "450", owner: "Wasim Akram", desc: "Networking for indie hackers and solo founders.", isPrivate: true, activity: "Active", isJoined: true },
  { id: 3, title: "Crypto Traders", members: "8.9k", owner: "Wasim Akram", desc: "Real-time alpha, Web3, and market analysis.", activity: "Very Active", isJoined: true },
];

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profileData: {
        name: "Wasim Akram Dudekula",
        username: "wasim_dev",
        email: "wasim@cobucket.app",
        phone: "",
        avatarUrl: "https://ui-avatars.com/api/?name=Wasim+Akram&background=F5F5F4&color=78716c",
        bannerUrl: "",
        stats: { followers: "1.2k", following: "450", views: "12.8k" },
        bio: {
          location: "Hyderabad, India",
          text: "Full-Stack Engineer exploring the social space through technology. Passionate about scalable systems, Python, and Next.js.",
          status: "Posted in Channels 2h ago: Building the ultimate social media platform called Cobucket.",
        },
      },

      wallposts: INITIAL_WALLPOSTS,
      channels: INITIAL_CHANNELS,
      groups: INITIAL_GROUPS,

      uniqueVisitorIds: SEED_VISITOR_IDS,
      weeklyViews: 2847,

      // ── Unique visit recording ────────────────────────────────────────────
      recordVisit: (userId) =>
        set((state) => {
          // Already visited — don't count again
          if (state.uniqueVisitorIds.includes(userId)) return state;
          return { uniqueVisitorIds: [...state.uniqueVisitorIds, userId] };
        }),

      // ── Weekly views bump ─────────────────────────────────────────────────
      bumpWeeklyViews: () =>
        set((state) => ({ weeklyViews: state.weeklyViews + 1 })),

      addWallpost: (post) =>
        set((state) => ({
          wallposts: [
            {
              id: `post_${Date.now()}`,
              mediaUrl: post.mediaUrl,
              mediaType: post.mediaType,
              facet: post.facet,
              stats: { views: 0, likes: 0 },
              date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            },
            ...state.wallposts,
          ],
        })),

      removeWallpost: (id) =>
        set((state) => ({
          wallposts: state.wallposts.filter((p) => p.id !== id),
        })),

      updateAvatar: (url) =>
        set((state) => ({
          profileData: { ...state.profileData, avatarUrl: url },
        })),

      updateBanner: (url) =>
        set((state) => ({
          profileData: { ...state.profileData, bannerUrl: url },
        })),

      updateProfile: (updates) =>
        set((state) => ({
          profileData: {
            ...state.profileData,
            ...(updates.name     !== undefined && { name: updates.name }),
            ...(updates.username !== undefined && { username: updates.username }),
            ...(updates.email    !== undefined && { email: updates.email }),
            ...(updates.phone    !== undefined && { phone: updates.phone }),
            bio: {
              ...state.profileData.bio,
              ...(updates.bio?.location !== undefined && { location: updates.bio.location }),
              ...(updates.bio?.text     !== undefined && { text: updates.bio.text }),
              ...(updates.bio?.status   !== undefined && { status: updates.bio.status }),
            },
          },
        })),
    }),
    {
      name: 'cobucket-profile',
      partialize: (state) => ({
        profileData: {
          ...state.profileData,
          avatarUrl: state.profileData.avatarUrl.startsWith('data:')
            ? 'https://ui-avatars.com/api/?name=Wasim+Akram&background=F5F5F4&color=78716c'
            : state.profileData.avatarUrl,
          bannerUrl: state.profileData.bannerUrl.startsWith('data:')
            ? ''
            : state.profileData.bannerUrl,
        },
        wallposts: state.wallposts,
        uniqueVisitorIds: state.uniqueVisitorIds,
        weeklyViews: state.weeklyViews,
      }),
    }
  )
);
