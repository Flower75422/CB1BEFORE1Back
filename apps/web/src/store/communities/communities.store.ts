import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useNotificationsStore } from '@/store/notifications/notification.store';

export interface ChannelLink {
  platform: string; // "website"|"twitter"|"linkedin"|"instagram"|"youtube"|"github"|"custom"
  label: string;
  url: string;
}

export interface ChannelPermissions {
  allowComments: boolean;
  allowReactions: boolean;
  tier: "Free" | "Paid";
  reachability: "Global" | "Country" | "Local";
  searchIndexing: boolean;
  isNSFW: boolean;
}

export interface GroupPermissions {
  isPublic: boolean;
  allowMessages: boolean;
  allowMedia: boolean;
  reachability: "Global" | "Country" | "Local";
  searchIndexing: boolean;
  isNSFW: boolean;
}

export interface GroupMember {
  handle: string;
  role: "Member" | "Admin" | "Owner";
  name?: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  handle: string;
  handleLastEditedAt?: string;   // ISO date of last handle edit
  handleEditCount?: number;      // first 2 edits free, cooldown from 3rd onwards
  members: number;
  desc: string;
  isPrivate: boolean;
  category: string;
  ownerId: string;
  avatarUrl?: string;
  links?: ChannelLink[];
  showSubscriberCount?: boolean;   // owner can hide/show — default true
  monthlyActiveViewers?: number;
  permissions?: Partial<ChannelPermissions>;
  pool?: string[];                 // interest pool (up to 6 topics)
}

export interface CommunityGroup {
  id: string;
  name: string;
  handle: string;
  handleLastEditedAt?: string;   // ISO date of last handle edit
  handleEditCount?: number;      // first 2 edits free, cooldown from 3rd onwards
  members: number;
  desc: string;
  isPrivate: boolean;
  category: string;
  ownerId: string;
  activity: string;
  admins: string[];
  avatarUrl?: string;
  permissions?: Partial<GroupPermissions>;
  pool?: string[];                 // interest pool (up to 6 topics)
  groupMembers?: GroupMember[];    // invited members with roles
  adminRights?: string[];          // global admin privilege ids: "users"|"settings"|"content"
}

export interface Broadcast {
  id: string;
  text: string;
  time: string;
  isPinned?: boolean;
  views?: number;                             // view count shown under broadcast
  reactions?: Record<string, string[]>;      // emoji → [userId, ...]
}

export interface GroupMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  replyTo?: { id: string; text: string; senderName: string };
  reactions?: Record<string, string[]>;      // emoji → [userId, ...]
  editedAt?: string;                         // ISO — set when message is edited
  forwardedFrom?: { name: string; chatId: string }; // set on forwarded messages
}

interface CommunitiesState {
  myChannels: CommunityChannel[];
  myGroups: CommunityGroup[];

  // Viewer interaction tracking
  subscribedChannelIds: string[];
  joinedGroupIds: string[];

  // Mute preferences (persisted)
  mutedChannelIds: string[];
  mutedGroupIds: string[];

  // Channel broadcast messages (persisted per channel)
  channelBroadcasts: Record<string, Broadcast[]>;

  // Pinned broadcast per channel — channelId → broadcastId (or null = no pin)
  pinnedBroadcastIds: Record<string, string | null>;

  // Group chat messages (persisted per group)
  groupMessages: Record<string, GroupMessage[]>;

  // Pinned message per group — groupId → messageId (or null)
  pinnedGroupMessageIds: Record<string, string | null>;

  // Private channel subscribe requests
  pendingChannelSubscribeIds: string[];

  // Private group join requests (current user's outgoing)
  pendingGroupJoinIds: string[];

  // Incoming join requests per group (owner sees these)
  groupJoinRequests: Record<string, Array<{ id: string; name: string }>>;

  // Member count deltas (tracks +1/-1 when user subscribes/joins)
  channelMemberDeltas: Record<string, number>;
  groupMemberDeltas: Record<string, number>;

  addChannel: (channel: CommunityChannel) => void;
  addGroup: (group: CommunityGroup) => void;
  removeChannel: (id: string) => void;
  removeGroup: (id: string) => void;
  setMyChannels: (channels: CommunityChannel[]) => void;
  setMyGroups: (groups: CommunityGroup[]) => void;
  updateChannel: (id: string, updates: Partial<CommunityChannel>) => void;
  updateGroup: (id: string, updates: Partial<CommunityGroup>) => void;

  subscribeChannel: (id: string, channelName?: string) => void;
  unsubscribeChannel: (id: string) => void;
  joinGroup: (id: string, groupName?: string) => void;
  leaveGroup: (id: string) => void;

  muteChannel: (id: string) => void;
  unmuteChannel: (id: string) => void;
  muteGroup: (id: string) => void;
  unmuteGroup: (id: string) => void;

  addBroadcast: (channelId: string, text: string) => void;
  pinBroadcast: (channelId: string, broadcastId: string) => void;
  unpinBroadcast: (channelId: string) => void;
  addBroadcastReaction: (channelId: string, broadcastId: string, emoji: string, userId: string) => void;
  addGroupMessage: (groupId: string, msg: GroupMessage) => void;
  deleteGroupMessage: (groupId: string, messageId: string) => void;
  editGroupMessage: (groupId: string, messageId: string, newText: string) => void;
  addGroupMessageReaction: (groupId: string, messageId: string, emoji: string, userId: string) => void;
  pinGroupMessage: (groupId: string, messageId: string | null) => void;

  requestSubscribeChannel: (id: string) => void;
  cancelChannelSubscribeRequest: (id: string) => void;

  requestJoinGroup: (id: string) => void;
  cancelJoinRequest: (id: string) => void;
  approveGroupJoinRequest: (groupId: string, userId: string) => void;
  declineGroupJoinRequest: (groupId: string, userId: string) => void;
}

export const useCommunitiesStore = create<CommunitiesState>()(
  persist(
  (set) => ({

  // ── CHANNELS ──────────────────────────────────────────────────────────
  myChannels: [
    {
      id: "chan_1",
      name: "Web3 Founders",
      handle: "@web3_founders/ch/wasim123",
      members: 120,
      desc: "Connecting builders in the Web3 and blockchain space.",
      isPrivate: false,
      category: "Technology",
      ownerId: "u_1",
      avatarUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&q=60",
      links: [
        { platform: "website",  label: "Website",  url: "https://web3founders.io" },
        { platform: "twitter",  label: "X",        url: "https://twitter.com/web3founders" },
        { platform: "github",   label: "GitHub",   url: "https://github.com/web3founders" },
      ],
      showSubscriberCount: true,
      monthlyActiveViewers: 84200,
    },
    {
      id: "chan_2",
      name: "UI/UX Daily",
      handle: "@ui_ux_daily/ch/wasim123",
      members: 840,
      desc: "Daily UI/UX inspiration, Figma tips and design breakdowns.",
      isPrivate: false,
      category: "Design",
      ownerId: "u_1",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=60",
      links: [
        { platform: "instagram", label: "Instagram", url: "https://instagram.com/uiuxdaily" },
        { platform: "linkedin",  label: "LinkedIn",  url: "https://linkedin.com/company/uiuxdaily" },
        { platform: "custom",    label: "Newsletter", url: "https://uiuxdaily.substack.com" },
      ],
      showSubscriberCount: true,
      monthlyActiveViewers: 312000,
    },
  ],

  // ── GROUPS ────────────────────────────────────────────────────────────
  myGroups: [
    {
      id: "grp_1",
      name: "Python Devs",
      handle: "@python_devs/gr/wasim123",
      members: 1200,
      desc: "Discussing Django, APIs, and backend scripting.",
      isPrivate: false,
      category: "Technology",
      ownerId: "u_1",
      activity: "Very Active",
      admins: ["u_1"],
      avatarUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop&q=60",
    },
    {
      id: "grp_2",
      name: "Startup Builders",
      handle: "@startup_builders/gr/wasim123",
      members: 450,
      desc: "Networking for indie hackers and solo founders.",
      isPrivate: true,
      category: "Business",
      ownerId: "u_1",
      activity: "Active",
      admins: ["u_1"],
      avatarUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop&q=60",
    },
  ],

  pinnedGroupMessageIds: { grp_1: "gm2", grp_2: null },

  // Seed pre-subscribed/joined IDs so "Following" tab has content
  subscribedChannelIds: ["1", "5", "9", "13"],
  joinedGroupIds: ["1", "4", "7"],

  mutedChannelIds: [],
  mutedGroupIds: [],

  // Seed broadcasts for owned channels + a few global channels (ids 1, 5, 9, 13)
  channelBroadcasts: {
    chan_1: [
      { id: "b1", text: "Welcome to Web3 Founders! We'll post updates and opportunities here.", time: "Monday 9:00 AM", views: 8420, reactions: { "🔥": ["u_2", "u_3"], "👍": ["u_4"] } },
      { id: "b2", text: "New AMA this Friday — live with a top Web3 founder. Stay tuned!", time: "Yesterday 2:30 PM", views: 3184 },
    ],
    chan_2: [
      { id: "b3", text: "Welcome to UI/UX Daily. Expect daily inspiration, Figma tips and design teardowns.", time: "Monday 10:00 AM", views: 12700, reactions: { "❤️": ["u_5", "u_6", "u_7"] } },
    ],
    "1": [
      { id: "g1", text: "Welcome to the channel! Follow for the latest updates.", time: "Monday 8:00 AM", views: 540 },
      { id: "g2", text: "Big news dropping this week. Stay tuned for the announcement!", time: "Yesterday 3:00 PM", views: 891 },
    ],
    "5": [
      { id: "g3", text: "Thanks for subscribing. We post deep-dives every Tuesday.", time: "Monday 11:00 AM", views: 320 },
    ],
    "9": [
      { id: "g4", text: "New resource guide is live — check the pinned link.", time: "Yesterday 9:00 AM", views: 215 },
    ],
    "13": [
      { id: "g5", text: "Community Q&A session is happening this Saturday!", time: "2 days ago", views: 1042 },
    ],
  },

  // Seed group messages for owned + joined groups
  groupMessages: {
    grp_1: [
      { id: "gm1", sender: "Elena Rodriguez", text: "Anyone tried the new Python 3.13 features yet?", time: "Monday 9:00 AM", isMe: false },
      { id: "gm2", sender: "Alex Rivera", text: "The free-threaded mode is a game changer for async work.", time: "Monday 9:15 AM", isMe: false },
      { id: "gm3", sender: "Wasim Akram", text: "Testing it in our Django project right now. Very smooth.", time: "Monday 9:20 AM", isMe: true },
    ],
    grp_2: [
      { id: "gm4", sender: "Marco Polo", text: "Welcome founders! Share what you're building this week.", time: "Yesterday 10:00 AM", isMe: false },
      { id: "gm5", sender: "Wasim Akram", text: "Working on the Cobucket communities feature — almost done!", time: "Yesterday 10:05 AM", isMe: true },
    ],
    "1": [
      { id: "gm6", sender: "Elena R.", text: "Hey everyone! Has anyone tried the new Figma variables update?", time: "10:42 AM", isMe: false },
      { id: "gm7", sender: "Marco P.", text: "Yes! It completely changes how we do dark mode.", time: "10:45 AM", isMe: false },
    ],
    "4": [
      { id: "gm8", sender: "Sarah Chen", text: "Great discussion on the last post. What does everyone think?", time: "Yesterday 2:00 PM", isMe: false },
    ],
    "7": [
      { id: "gm9", sender: "Dr. Aris", text: "Sharing the new research paper in the resources channel.", time: "Today 8:30 AM", isMe: false },
      { id: "gm10", sender: "Wasim Akram", text: "Thanks! Will check it out.", time: "Today 8:32 AM", isMe: true },
    ],
  },

  pinnedBroadcastIds: {},

  pendingChannelSubscribeIds: [],

  pendingGroupJoinIds: [],

  groupJoinRequests: {
    "1": [
      { id: "req_1", name: "Priya Sharma" },
      { id: "req_2", name: "James Okafor" },
    ],
    "4": [
      { id: "req_3", name: "Sofia Mendes" },
    ],
  },

  channelMemberDeltas: {},
  groupMemberDeltas: {},

  // ── ACTIONS ───────────────────────────────────────────────────────────
  addChannel: (channel) =>
    set((state) => ({ myChannels: [...state.myChannels, channel] })),

  addGroup: (group) =>
    set((state) => ({ myGroups: [...state.myGroups, group] })),

  removeChannel: (id) =>
    set((state) => ({ myChannels: state.myChannels.filter((c) => c.id !== id) })),

  removeGroup: (id) =>
    set((state) => ({ myGroups: state.myGroups.filter((g) => g.id !== id) })),

  setMyChannels: (channels) => set({ myChannels: channels }),
  setMyGroups: (groups) => set({ myGroups: groups }),

  updateChannel: (id, updates) =>
    set((state) => ({
      myChannels: state.myChannels.map((c) => {
        if (c.id !== id) return c;
        const handleChanged = updates.handle !== undefined && updates.handle !== c.handle;
        const newCount = handleChanged ? (c.handleEditCount ?? 0) + 1 : c.handleEditCount;
        return {
          ...c,
          ...updates,
          ...(handleChanged ? {
            handleLastEditedAt: new Date().toISOString(),
            handleEditCount: newCount,
          } : {}),
        };
      }),
    })),

  updateGroup: (id, updates) =>
    set((state) => ({
      myGroups: state.myGroups.map((g) => {
        if (g.id !== id) return g;
        const handleChanged = updates.handle !== undefined && updates.handle !== g.handle;
        const newCount = handleChanged ? (g.handleEditCount ?? 0) + 1 : g.handleEditCount;
        return {
          ...g,
          ...updates,
          ...(handleChanged ? {
            handleLastEditedAt: new Date().toISOString(),
            handleEditCount: newCount,
          } : {}),
        };
      }),
    })),

  subscribeChannel: (id, channelName?) =>
    set((state) => {
      if (state.subscribedChannelIds.includes(id)) return {};
      // Find channel name for notification — check owned channels first, then use passed name
      const channel = state.myChannels.find((c) => c.id === id);
      const resolvedName = channel?.name || channelName || "Channel";
      // Trigger notification after state update
      setTimeout(() => {
        useNotificationsStore.getState().addNotification({
          type: 'channel',
          title: resolvedName,
          message: `You subscribed to ${resolvedName}`,
          time: 'Just now',
          avatarInitials: resolvedName.slice(0, 2).toUpperCase(),
          avatarColor: 'bg-purple-100 text-purple-600',
        });
      }, 0);
      return {
        subscribedChannelIds: [...state.subscribedChannelIds, id],
        pendingChannelSubscribeIds: state.pendingChannelSubscribeIds.filter((pid) => pid !== id),
        channelMemberDeltas: { ...state.channelMemberDeltas, [id]: (state.channelMemberDeltas[id] ?? 0) + 1 },
      };
    }),

  unsubscribeChannel: (id) =>
    set((state) => ({
      subscribedChannelIds: state.subscribedChannelIds.filter((cid) => cid !== id),
      channelMemberDeltas: { ...state.channelMemberDeltas, [id]: (state.channelMemberDeltas[id] ?? 0) - 1 },
    })),

  joinGroup: (id, groupName?) =>
    set((state) => {
      if (state.joinedGroupIds.includes(id)) return {};
      // Find group name for notification — check owned groups first, then use passed name
      const group = state.myGroups.find((g) => g.id === id);
      const resolvedName = group?.name || groupName || "Group";
      // Trigger notification after state update
      setTimeout(() => {
        useNotificationsStore.getState().addNotification({
          type: 'group',
          title: resolvedName,
          message: `You joined ${resolvedName}`,
          time: 'Just now',
          avatarInitials: resolvedName.slice(0, 2).toUpperCase(),
          avatarColor: 'bg-green-100 text-green-600',
        });
      }, 0);
      return {
        joinedGroupIds: [...state.joinedGroupIds, id],
        pendingGroupJoinIds: state.pendingGroupJoinIds.filter((pid) => pid !== id),
        groupMemberDeltas: { ...state.groupMemberDeltas, [id]: (state.groupMemberDeltas[id] ?? 0) + 1 },
      };
    }),

  leaveGroup: (id) =>
    set((state) => ({
      joinedGroupIds: state.joinedGroupIds.filter((gid) => gid !== id),
      groupMemberDeltas: { ...state.groupMemberDeltas, [id]: (state.groupMemberDeltas[id] ?? 0) - 1 },
    })),

  muteChannel: (id) =>
    set((state) => ({
      mutedChannelIds: state.mutedChannelIds.includes(id)
        ? state.mutedChannelIds
        : [...state.mutedChannelIds, id],
    })),

  unmuteChannel: (id) =>
    set((state) => ({
      mutedChannelIds: state.mutedChannelIds.filter((cid) => cid !== id),
    })),

  muteGroup: (id) =>
    set((state) => ({
      mutedGroupIds: state.mutedGroupIds.includes(id)
        ? state.mutedGroupIds
        : [...state.mutedGroupIds, id],
    })),

  unmuteGroup: (id) =>
    set((state) => ({
      mutedGroupIds: state.mutedGroupIds.filter((gid) => gid !== id),
    })),

  addBroadcast: (channelId, text) =>
    set((state) => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const msg: Broadcast = { id: `b_${Date.now()}`, text, time, views: 0 };
      const prev = state.channelBroadcasts[channelId] || [];
      return { channelBroadcasts: { ...state.channelBroadcasts, [channelId]: [...prev, msg] } };
    }),

  addBroadcastReaction: (channelId, broadcastId, emoji, userId) =>
    set((state) => {
      const prev = state.channelBroadcasts[channelId] || [];
      return {
        channelBroadcasts: {
          ...state.channelBroadcasts,
          [channelId]: prev.map((b) => {
            if (b.id !== broadcastId) return b;
            const r = { ...(b.reactions || {}) };
            const existing = r[emoji] || [];
            if (existing.includes(userId)) {
              const next = existing.filter((u) => u !== userId);
              if (next.length === 0) delete r[emoji]; else r[emoji] = next;
            } else {
              r[emoji] = [...existing, userId];
            }
            return { ...b, reactions: r };
          }),
        },
      };
    }),

  pinBroadcast: (channelId, broadcastId) =>
    set((state) => ({
      pinnedBroadcastIds: { ...state.pinnedBroadcastIds, [channelId]: broadcastId },
    })),

  unpinBroadcast: (channelId) =>
    set((state) => ({
      pinnedBroadcastIds: { ...state.pinnedBroadcastIds, [channelId]: null },
    })),

  requestSubscribeChannel: (id) =>
    set((state) => ({
      pendingChannelSubscribeIds: state.pendingChannelSubscribeIds.includes(id)
        ? state.pendingChannelSubscribeIds
        : [...state.pendingChannelSubscribeIds, id],
    })),

  cancelChannelSubscribeRequest: (id) =>
    set((state) => ({
      pendingChannelSubscribeIds: state.pendingChannelSubscribeIds.filter((pid) => pid !== id),
    })),

  requestJoinGroup: (id) =>
    set((state) => ({
      pendingGroupJoinIds: state.pendingGroupJoinIds.includes(id)
        ? state.pendingGroupJoinIds
        : [...state.pendingGroupJoinIds, id],
    })),

  cancelJoinRequest: (id) =>
    set((state) => ({
      pendingGroupJoinIds: state.pendingGroupJoinIds.filter((pid) => pid !== id),
    })),

  approveGroupJoinRequest: (groupId, userId) =>
    set((state) => {
      const reqs = state.groupJoinRequests[groupId] || [];
      return {
        groupJoinRequests: { ...state.groupJoinRequests, [groupId]: reqs.filter(r => r.id !== userId) },
        groupMemberDeltas: { ...state.groupMemberDeltas, [groupId]: (state.groupMemberDeltas[groupId] ?? 0) + 1 },
      };
    }),

  declineGroupJoinRequest: (groupId, userId) =>
    set((state) => {
      const reqs = state.groupJoinRequests[groupId] || [];
      return {
        groupJoinRequests: { ...state.groupJoinRequests, [groupId]: reqs.filter(r => r.id !== userId) },
      };
    }),

  addGroupMessage: (groupId, msg) =>
    set((state) => {
      const prev = state.groupMessages[groupId] || [];
      return { groupMessages: { ...state.groupMessages, [groupId]: [...prev, msg] } };
    }),

  deleteGroupMessage: (groupId, messageId) =>
    set((state) => {
      const remaining = (state.groupMessages[groupId] || []).filter((m) => m.id !== messageId);
      // Auto-unpin if the deleted message was the pinned one
      const wasPinned = state.pinnedGroupMessageIds[groupId] === messageId;
      return {
        groupMessages: { ...state.groupMessages, [groupId]: remaining },
        pinnedGroupMessageIds: wasPinned
          ? { ...state.pinnedGroupMessageIds, [groupId]: null }
          : state.pinnedGroupMessageIds,
      };
    }),

  editGroupMessage: (groupId, messageId, newText) =>
    set((state) => ({
      groupMessages: {
        ...state.groupMessages,
        [groupId]: (state.groupMessages[groupId] || []).map((m) =>
          m.id === messageId ? { ...m, text: newText, editedAt: new Date().toISOString() } : m
        ),
      },
    })),

  addGroupMessageReaction: (groupId, messageId, emoji, userId) =>
    set((state) => {
      const prev = state.groupMessages[groupId] || [];
      return {
        groupMessages: {
          ...state.groupMessages,
          [groupId]: prev.map((m) => {
            if (m.id !== messageId) return m;
            const r = { ...(m.reactions || {}) };
            const existing = r[emoji] || [];
            if (existing.includes(userId)) {
              const next = existing.filter((u) => u !== userId);
              if (next.length === 0) delete r[emoji]; else r[emoji] = next;
            } else {
              r[emoji] = [...existing, userId];
            }
            return { ...m, reactions: r };
          }),
        },
      };
    }),

  pinGroupMessage: (groupId, messageId) =>
    set((state) => ({
      pinnedGroupMessageIds: { ...state.pinnedGroupMessageIds, [groupId]: messageId },
    })),
  }),
  {
    name: 'cobucket-communities',
    version: 1,
    migrate: (persistedState: any, _version: number) => {
      // Back-fill missing `desc` on any channels/groups stored before desc was added
      if (persistedState.myChannels) {
        persistedState.myChannels = persistedState.myChannels.map((c: any) => ({
          ...c,
          desc: c.desc || "",
        }));
      }
      if (persistedState.myGroups) {
        persistedState.myGroups = persistedState.myGroups.map((g: any) => ({
          ...g,
          desc: g.desc || "",
        }));
      }
      return persistedState;
    },
    storage: createJSONStorage(() => localStorage),
    // Persist only user interaction state — seed data (myChannels/myGroups) stays as initializer
    partialize: (state) => ({
      subscribedChannelIds:      state.subscribedChannelIds,
      pendingChannelSubscribeIds: state.pendingChannelSubscribeIds,
      joinedGroupIds:            state.joinedGroupIds,
      pendingGroupJoinIds:       state.pendingGroupJoinIds,
      mutedChannelIds:           state.mutedChannelIds,
      mutedGroupIds:             state.mutedGroupIds,
      channelBroadcasts:         state.channelBroadcasts,
      pinnedBroadcastIds:        state.pinnedBroadcastIds,
      groupMessages:             state.groupMessages,
      pinnedGroupMessageIds:     state.pinnedGroupMessageIds,
      channelMemberDeltas:       state.channelMemberDeltas,
      groupMemberDeltas:         state.groupMemberDeltas,
      myChannels:                state.myChannels,
      myGroups:                  state.myGroups,
      groupJoinRequests:         state.groupJoinRequests,
    }),
  }
));
