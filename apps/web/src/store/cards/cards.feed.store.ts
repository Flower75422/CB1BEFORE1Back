import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useProfileStore } from '@/store/profile/profile.store';

// Master keyword database for the dropdown
const MASTER_KEYWORD_DB = [
  "Artificial Intelligence", "UI/UX Design", "Web3", "SaaS", "Venture Capital", "Machine Learning",
  "Frontend", "Backend", "DevOps", "Crypto", "Digital Art", "Startups"
];

// Seed global feed — represents all users on the platform (not persisted, always fresh)
const GLOBAL_FEED_SEED = [
  { id: "g1",  name: "Startup Daily",     handle: "@startups",      stats: { views: 150000, likes: 8900,  posts: 156 }, bio: "YCombinator just released their new batch list.",        channel: { name: "Startup Daily",        id: "startups",      isPublic: true }, interests: { primary: "Startups" },               backMediaUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=60",
    wallPosts: [{ id: "wp_g1_1", caption: "YC S24 batch is live 🚀", mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=60", mediaType: "image", isPinned: true,  expiresAt: null, createdAt: new Date(Date.now() - 3600000).toISOString() }] },
  { id: "g2",  name: "AI Weekly",          handle: "@ai_news",       stats: { views: 82000,  likes: 6400,  posts: 42  }, bio: "DeepMind's new model solves geometry at PhD level.",    channel: { name: "AI Weekly",            id: "ai_news",       isPublic: true }, interests: { primary: "Artificial Intelligence" }, backMediaUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=60",
    wallPosts: [{ id: "wp_g2_1", caption: "Gemini 2.0 drops today", mediaUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=60", mediaType: "image", isPinned: false, expiresAt: null, createdAt: new Date(Date.now() - 7200000).toISOString() }] },
  { id: "g3",  name: "Sarah Dev",          handle: "@sarah_codes",   stats: { views: 1200,   likes: 85,    posts: 4   }, bio: "Exploring Next.js 14 and Tailwind CSS deeply.",        channel: { name: "Sarah's Dev Log",      id: "sarah_codes",   isPublic: true }, interests: { primary: "Frontend" } },
  { id: "g4",  name: "Crypto Whale",       handle: "@whale_alert",   stats: { views: 340000, likes: 12000, posts: 890 }, bio: "Tracking large blockchain movements in real time.",     channel: { name: "Whale Alerts",         id: "whale_alert",   isPublic: true }, interests: { primary: "Web3" },
    wallPosts: [{ id: "wp_g4_1", caption: "500 BTC moved to cold", mediaUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=60", mediaType: "image", isPinned: true,  expiresAt: null, createdAt: new Date(Date.now() - 1800000).toISOString() }] },
  { id: "g5",  name: "Design Hub",         handle: "@design_hub",    stats: { views: 45000,  likes: 3200,  posts: 112 }, bio: "Curated UI/UX inspiration and case studies daily.",    channel: { name: "Design Hub",           id: "design_hub",    isPublic: true }, interests: { primary: "UI/UX Design" },           backMediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=60",
    wallPosts: [{ id: "wp_g5_1", caption: "Today's Figma breakdown", mediaUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=60", mediaType: "image", isPinned: false, expiresAt: null, createdAt: new Date(Date.now() - 10800000).toISOString() }] },
  { id: "g6",  name: "ML Papers",          handle: "@ml_papers",     stats: { views: 63000,  likes: 4100,  posts: 88  }, bio: "Breaking down research papers in plain English.",      channel: { name: "ML Papers Weekly",     id: "ml_papers",     isPublic: true }, interests: { primary: "Machine Learning" },        backMediaUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=60",
    wallPosts: [{ id: "wp_g6_1", caption: "New RLHF paper — must read", mediaUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=60", mediaType: "image", isPinned: false, expiresAt: null, createdAt: new Date(Date.now() - 14400000).toISOString() }] },
  { id: "g7",  name: "Devon Lewis",        handle: "@dev_lewis",      stats: { views: 9800,   likes: 540,   posts: 21  }, bio: "Building in public — backend APIs and cloud infra.",   channel: { name: "Devon's Backend Notes",id: "dev_lewis",      isPublic: true }, interests: { primary: "Backend" } },
  { id: "g8",  name: "Pipeline Pro",       handle: "@devops_pro",    stats: { views: 18000,  likes: 1100,  posts: 67  }, bio: "CI/CD pipelines, Kubernetes and cloud automation.",    channel: { name: "Pipeline Pro",         id: "devops_pro",    isPublic: true }, interests: { primary: "DevOps" },                  backMediaUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=60",
    wallPosts: [{ id: "wp_g8_1", caption: "K8s autoscaling walkthrough", mediaUrl: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?w=800&q=60", mediaType: "image", isPinned: false, expiresAt: null, createdAt: new Date(Date.now() - 21600000).toISOString() }] },
  { id: "g9",  name: "CoinDesk India",     handle: "@coindeskIN",    stats: { views: 220000, likes: 9800,  posts: 310 }, bio: "Latest crypto market moves and token analysis.",       channel: { name: "CoinDesk India",       id: "coindeskIN",    isPublic: true }, interests: { primary: "Crypto" } },
  { id: "g10", name: "Pixel & Ink",        handle: "@pixel_ink",     stats: { views: 27000,  likes: 2100,  posts: 74  }, bio: "Original digital art and NFT drops every week.",       channel: { name: "Pixel & Ink",          id: "pixel_ink",     isPublic: true }, interests: { primary: "Digital Art" },             backMediaUrl: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&q=60",
    wallPosts: [{ id: "wp_g10_1", caption: "New NFT drop this Friday", mediaUrl: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=60", mediaType: "image", isPinned: true,  expiresAt: null, createdAt: new Date(Date.now() - 5400000).toISOString() }] },
  { id: "g11", name: "Founders Fuel",      handle: "@founders_fuel", stats: { views: 71000,  likes: 5600,  posts: 130 }, bio: "Fundraising tips, pitch decks and founder stories.",   channel: { name: "Founders Fuel",        id: "founders_fuel", isPublic: true }, interests: { primary: "Venture Capital" },         backMediaUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=60",
    wallPosts: [{ id: "wp_g11_1", caption: "How we closed a $2M seed", mediaUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=60", mediaType: "image", isPinned: false, expiresAt: null, createdAt: new Date(Date.now() - 43200000).toISOString() }] },
  { id: "g12", name: "SaaS Playbook",      handle: "@saas_play",     stats: { views: 33000,  likes: 2400,  posts: 58  }, bio: "How to grow from 0 to $10k MRR as a solo founder.",   channel: { name: "SaaS Playbook",        id: "saas_play",     isPublic: true }, interests: { primary: "SaaS" } },
];

interface CardsFeedState {
  activeFilter: string;
  myCards: any[];
  followedCards: any[];
  globalFeed: any[];
  interestPool: string[];
  likedCardIds: string[];
  // Pinned interest tabs — persisted so they survive refresh
  myInterests: string[];

  setActiveFilter: (filter: string) => void;
  setMyCards: (cards: any[]) => void;
  saveSingleCard: (card: any) => void;
  deleteCard: (cardId: string) => void;
  toggleFollowCard: (card: any) => void;
  refreshInterestPool: () => void;
  incrementCardViews: (cardId: string) => void;
  toggleLikeCard: (cardId: string, primaryInterest?: string) => void;
  addInterest: (topic: string) => void;
  removeInterest: (topic: string) => void;
}

// Strip base64 data from a card before persisting
const stripBase64FromCard = (card: any) => ({
  ...card,
  profilePicUrl: card.profilePicUrl?.startsWith?.('data:') ? '' : card.profilePicUrl,
  backMediaUrl: card.backMediaUrl?.startsWith?.('data:') ? null : card.backMediaUrl,
  wallPosts: (card.wallPosts || []).map((p: any) => ({
    ...p,
    mediaUrl: p.mediaUrl?.startsWith?.('data:') ? '' : p.mediaUrl,
  })),
});

export const useCardsFeedStore = create<CardsFeedState>()(
  persist(
    (set, get) => ({
      activeFilter: 'For You',
      likedCardIds: [],
      myCards: [],
      myInterests: [],

      followedCards: [
        { id: "f1", name: "Mike Creator", handle: "@mike_builds", stats: { views: 4000, likes: 210, posts: 8 }, bio: "Day 12 of building my SaaS...", channel: { name: "Mike's Startup Journey", id: "mike_builds", isPublic: true }, interests: { primary: "SaaS" }, progress: 3 },
      ],

      // Global feed is seed data — always re-initialised from here, never persisted
      globalFeed: GLOBAL_FEED_SEED,

      interestPool: [],

      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setMyCards: (cards) => set({ myCards: cards }),

      saveSingleCard: (card) => set((state) => {
        const exists = state.myCards.find((c) => c.id === card.id);
        if (exists) return { myCards: state.myCards.map((c) => c.id === card.id ? card : c) };
        return { myCards: [...state.myCards, card] };
      }),

      deleteCard: (cardId) => set((state) => ({
        myCards: state.myCards.filter((c) => c.id !== cardId),
      })),

      toggleFollowCard: (card) => set((state) => {
        const isFollowing = state.followedCards.some((c) => c.id === card.id);
        if (isFollowing) return { followedCards: state.followedCards.filter((c) => c.id !== card.id) };
        return { followedCards: [card, ...state.followedCards] };
      }),

      toggleLikeCard: (cardId, primaryInterest) => set((state) => {
        const isLiked = state.likedCardIds.includes(cardId);
        if (isLiked) {
          // Unlike — remove from liked list, leave active filter unchanged
          return {
            likedCardIds: state.likedCardIds.filter((id) => id !== cardId),
            myCards: state.myCards.map((c) =>
              c.id === cardId
                ? { ...c, stats: { ...c.stats, likes: Math.max(0, (c.stats?.likes || 0) - 1) } }
                : c
            ),
            followedCards: state.followedCards.map((c) =>
              c.id === cardId
                ? { ...c, stats: { ...c.stats, likes: Math.max(0, (c.stats?.likes || 0) - 1) } }
                : c
            ),
            globalFeed: state.globalFeed.map((c) =>
              c.id === cardId
                ? { ...c, stats: { ...c.stats, likes: Math.max(0, (c.stats?.likes || 0) - 1) } }
                : c
            ),
          };
        } else {
          // Like — add to liked list, leave active filter unchanged
          return {
            likedCardIds: [...state.likedCardIds, cardId],
            myCards: state.myCards.map((c) =>
              c.id === cardId
                ? { ...c, stats: { ...c.stats, likes: (c.stats?.likes || 0) + 1 } }
                : c
            ),
            followedCards: state.followedCards.map((c) =>
              c.id === cardId
                ? { ...c, stats: { ...c.stats, likes: (c.stats?.likes || 0) + 1 } }
                : c
            ),
            globalFeed: state.globalFeed.map((c) =>
              c.id === cardId
                ? { ...c, stats: { ...c.stats, likes: (c.stats?.likes || 0) + 1 } }
                : c
            ),
          };
        }
      }),

      incrementCardViews: (cardId) => {
        // Bump weekly views on the profile — every card view counts toward this week's total
        useProfileStore.getState().bumpWeeklyViews();
        set((state) => ({
          myCards: state.myCards.map((c) =>
            c.id === cardId
              ? { ...c, stats: { ...c.stats, views: (c.stats?.views || 0) + 1 } }
              : c
          ),
          globalFeed: state.globalFeed.map((c) =>
            c.id === cardId
              ? { ...c, stats: { ...c.stats, views: (c.stats?.views || 0) + 1 } }
              : c
          ),
        }));
      },

      addInterest: (topic) => set((state) => {
        const isCoreTab = ["For You", "Trending", "My Cards", "Following"].includes(topic);
        if (isCoreTab || state.myInterests.includes(topic)) return state;
        return { myInterests: [...state.myInterests, topic] };
      }),

      removeInterest: (topic) => set((state) => ({
        myInterests: state.myInterests.filter((t) => t !== topic),
      })),

      refreshInterestPool: () => {
        const { myCards, followedCards } = get();

        const userInterests = [
          ...myCards.map((c) => c.interests?.primary),
          ...followedCards.map((c) => c.interests?.primary),
        ].filter(Boolean);

        const randomFiller = [...MASTER_KEYWORD_DB].sort(() => 0.5 - Math.random()).slice(0, 40);
        const combinedUniqueSet = Array.from(new Set([...userInterests, ...randomFiller]));

        for (let i = combinedUniqueSet.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [combinedUniqueSet[i], combinedUniqueSet[j]] = [combinedUniqueSet[j], combinedUniqueSet[i]];
        }

        set({ interestPool: combinedUniqueSet });
      },
    }),
    {
      name: 'cobucket-cards-feed',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data — globalFeed is always re-seeded from the constant above
      partialize: (state) => ({
        activeFilter: state.activeFilter,
        interestPool: state.interestPool,
        followedCards: state.followedCards,
        likedCardIds: state.likedCardIds,
        myCards: state.myCards.map(stripBase64FromCard),
        myInterests: state.myInterests,
        // globalFeed intentionally excluded
      }),
    }
  )
);
