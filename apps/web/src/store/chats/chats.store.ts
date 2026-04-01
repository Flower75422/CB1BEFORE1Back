import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCommunitiesStore } from '@/store/communities/communities.store';
import { useAuthStore } from '@/store/auth/auth.store';

export interface ReplyTo {
  id: string;
  text: string;
  senderName: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  isSender: boolean;
  createdAt?: string;                        // ISO — for date separators
  replyTo?: ReplyTo;                         // quoted reply
  reactions?: Record<string, string[]>;      // emoji → [userId, ...]
  status?: "sent" | "delivered" | "read";   // read receipt state
  editedAt?: string;                         // ISO — set when message is edited
  forwardedFrom?: { name: string; chatId: string }; // set on forwarded messages
}

interface ChatsState {
  activeTab: string;
  activeChatId: string | null;
  isComposing: boolean;

  directChats: any[];
  channels: any[];
  groups: any[];
  mutedChatIds: string[];

  messages: Record<string, ChatMessage[]>;

  // Reply state — set when user taps Reply on a bubble
  replyingTo: ReplyTo | null;

  // Unread counts per chat/channel/group ID
  unreadCounts: Record<string, number>;

  // Draft messages per chat (preserved when switching chats)
  drafts: Record<string, string>;

  setActiveTab: (tab: string) => void;
  setActiveChatId: (id: string | null) => void;
  setIsComposing: (v: boolean) => void;
  setReplyingTo: (reply: ReplyTo | null) => void;
  addDirectChat: (name: string) => void;
  toggleMuteChat: (id: string) => void;
  sendMessage: (text: string) => void;
  addReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  editMessage: (chatId: string, messageId: string, newText: string) => void;
  forwardMessage: (fromChatId: string, msgId: string, toChatId: string, toTab: string) => void;
  clearChatHistory: (chatId: string) => void;
  markRead: (chatId: string) => void;
  setDraft: (chatId: string, text: string) => void;
  clearDraft: (chatId: string) => void;
}

const pastDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(10, 30, 0, 0);
  return d.toISOString();
};

export const useChatsStore = create<ChatsState>()(
  persist(
    (set, get) => ({
      activeTab: "chats",
      activeChatId: "1",
      isComposing: false,
      replyingTo: null,

      directChats: [
        { id: "1", userId: "u_2", name: "Aisha Khan",  lastMsg: "See you then!",   time: "12:45 PM" },
        { id: "2", userId: "u_3", name: "Alex Rivera", lastMsg: "Got the designs.", time: "Yesterday" },
      ],

      channels: [
        { id: "chan_1", name: "Web3 Founders", handle: "@web3_founders", time: "1h" },
        { id: "chan_2", name: "UI/UX Daily",   handle: "@ui_ux_daily",   time: "2h" },
      ],
      groups: [
        { id: "grp_1", name: "Python Devs",      lastMsg: "Wasim: Testing it.", time: "9:20 AM" },
        { id: "grp_2", name: "Startup Builders", lastMsg: "Wasim: Working on Cobucket.", time: "Yesterday" },
      ],

      mutedChatIds: [],
      drafts: {},

      unreadCounts: {
        "1":      2,
        "2":      0,
        "grp_1":  4,
        "grp_2":  1,
        "chan_1":  3,
        "chan_2":  0,
      },

      messages: {
        "1": [
          {
            id: "m1", text: "Hey! Let's build something awesome.", time: "10:30 AM",
            isSender: false, createdAt: pastDate(2), status: "read",
          },
          {
            id: "m2", text: "Absolutely. The new architecture is ready.", time: "10:32 AM",
            isSender: true, createdAt: pastDate(2), status: "read",
          },
          {
            id: "m3", text: "See you then!", time: "12:45 PM",
            isSender: false, createdAt: new Date().toISOString(), status: "read",
            reactions: { "👍": ["u_1"] },
          },
        ],
        "2": [
          {
            id: "m4", text: "Are the designs ready for review?", time: "Yesterday",
            isSender: true, createdAt: pastDate(1), status: "read",
          },
          {
            id: "m5", text: "Got the designs.", time: "Yesterday",
            isSender: false, createdAt: pastDate(1), status: "read",
            reactions: { "❤️": ["u_1", "u_3"] },
          },
        ],
      },

      // ── Setters ────────────────────────────────────────────────────────────
      setActiveTab: (tab) => {
        const state = get();
        let newActiveId: string | null = null;
        if (tab === "chats" && state.directChats.length > 0) {
          newActiveId = state.directChats[0].id;
        }
        if (tab === "channels") {
          if (state.channels.length > 0) {
            newActiveId = state.channels[0].id;
          } else {
            const { myChannels } = useCommunitiesStore.getState();
            if (myChannels.length > 0) newActiveId = myChannels[0].id;
          }
        }
        if (tab === "groups") {
          if (state.groups.length > 0) {
            newActiveId = state.groups[0].id;
          } else {
            const { myGroups } = useCommunitiesStore.getState();
            if (myGroups.length > 0) newActiveId = myGroups[0].id;
          }
        }
        set({ activeTab: tab, activeChatId: newActiveId, isComposing: false, replyingTo: null });
        // Clear unread badge for the auto-selected item
        if (newActiveId) get().markRead(newActiveId);
      },

      setActiveChatId: (id) => {
        set({ activeChatId: id, replyingTo: null });
        if (id) get().markRead(id);
      },

      setIsComposing: (v) => set({ isComposing: v }),

      setReplyingTo: (reply) => set({ replyingTo: reply }),

      // ── Create direct chat ────────────────────────────────────────────────
      addDirectChat: (name) => {
        const trimmed = name.trim();
        const existing = get().directChats.find(
          (c) => c.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (existing) {
          // Already exists — just open it instead of creating a duplicate
          set({ activeChatId: existing.id, activeTab: "chats", isComposing: false });
          get().markRead(existing.id);
          return;
        }
        // Resolve userId from users store so avatar/online status work downstream
        const { getUserByName } = require('@/store/users/users.store').useUsersStore.getState();
        const matchedUser = getUserByName(trimmed);
        const id = `dm_${Date.now()}`;
        set((state) => ({
          directChats: [
            { id, name: trimmed, userId: matchedUser?.id || null, lastMsg: "Say hello 👋", time: "Now" },
            ...state.directChats,
          ],
          messages: { ...state.messages, [id]: [] },
          activeChatId: id,
          activeTab: "chats",
          isComposing: false,
        }));
      },

      toggleMuteChat: (id) => set((state) => ({
        mutedChatIds: state.mutedChatIds.includes(id)
          ? state.mutedChatIds.filter((i) => i !== id)
          : [...state.mutedChatIds, id],
      })),

      // ── Mark read ─────────────────────────────────────────────────────────
      markRead: (chatId) => set((state) => ({
        unreadCounts: { ...state.unreadCounts, [chatId]: 0 },
        // Also mark all received messages in this chat as "read"
        messages: {
          ...state.messages,
          [chatId]: (state.messages[chatId] || []).map((m) =>
            !m.isSender && m.status !== "read" ? { ...m, status: "read" as const } : m
          ),
        },
      })),

      // ── Add reaction (toggle) ─────────────────────────────────────────────
      addReaction: (chatId, messageId, emoji, userId) =>
        set((state) => {
          const msgs = state.messages[chatId] || [];
          return {
            messages: {
              ...state.messages,
              [chatId]: msgs.map((m) => {
                if (m.id !== messageId) return m;
                const reactions = { ...(m.reactions || {}) };
                const existing = reactions[emoji] || [];
                if (existing.includes(userId)) {
                  // Toggle off
                  const next = existing.filter((u) => u !== userId);
                  if (next.length === 0) delete reactions[emoji];
                  else reactions[emoji] = next;
                } else {
                  reactions[emoji] = [...existing, userId];
                }
                return { ...m, reactions };
              }),
            },
          };
        }),

      // ── Delete message ────────────────────────────────────────────────────
      deleteMessage: (chatId, messageId) =>
        set((state) => {
          const remaining = (state.messages[chatId] || []).filter((m) => m.id !== messageId);
          // Recalculate lastMsg preview for the sidebar
          const lastMsg = remaining.length > 0
            ? remaining[remaining.length - 1].text
            : "No messages yet";
          const lastTime = remaining.length > 0
            ? remaining[remaining.length - 1].time
            : "";
          return {
            messages: { ...state.messages, [chatId]: remaining },
            directChats: state.directChats.map((item) =>
              item.id === chatId
                ? { ...item, lastMsg, time: lastTime }
                : item
            ),
          };
        }),

      // ── Clear chat history + remove contact from sidebar ─────────────────
      clearChatHistory: (chatId) =>
        set((state) => {
          const remaining = state.directChats.filter((c) => c.id !== chatId);
          const newActiveId = remaining.length > 0 ? remaining[0].id : null;
          const { [chatId]: _removed, ...restMessages } = state.messages;
          const { [chatId]: _removedUnread, ...restUnread } = state.unreadCounts;
          const { [chatId]: _removedDraft, ...restDrafts } = state.drafts;
          return {
            directChats: remaining,
            messages: restMessages,
            activeChatId: newActiveId,
            unreadCounts: restUnread,
            drafts: restDrafts,
            mutedChatIds: state.mutedChatIds.filter((id) => id !== chatId),
          };
        }),

      // ── Edit message ────────────────────────────────────────────────────
      editMessage: (chatId, messageId, newText) =>
        set((state) => {
          const msgs = (state.messages[chatId] || []).map((m) =>
            m.id === messageId ? { ...m, text: newText, editedAt: new Date().toISOString() } : m
          );
          const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : "No messages yet";
          return {
            messages: { ...state.messages, [chatId]: msgs },
            directChats: state.directChats.map((item) =>
              item.id === chatId ? { ...item, lastMsg } : item
            ),
          };
        }),

      // ── Forward message ───────────────────────────────────────────────
      forwardMessage: (fromChatId, msgId, toChatId, toTab) => {
        const state = get();
        // Find original message in DMs or groups
        const dmMsgs = state.messages[fromChatId] || [];
        const origDm = dmMsgs.find((m) => m.id === msgId);
        const grpMsgs = useCommunitiesStore.getState().groupMessages[fromChatId] || [];
        const origGrp = grpMsgs.find((m: any) => m.id === msgId);
        const orig = origDm || origGrp;
        if (!orig) return;

        const senderName = origDm
          ? (origDm.isSender ? (useAuthStore.getState().user?.name || "You") : state.directChats.find((c) => c.id === fromChatId)?.name || "User")
          : ((origGrp as any)?.sender || "Member");
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        if (toTab === "channels") {
          useCommunitiesStore.getState().addBroadcast(toChatId, orig.text);
          return;
        }

        if (toTab === "groups") {
          useCommunitiesStore.getState().addGroupMessage(toChatId, {
            id: `gm_${Date.now()}`,
            sender: useAuthStore.getState().user?.name || "You",
            text: orig.text,
            time,
            isMe: true,
            forwardedFrom: { name: senderName, chatId: fromChatId },
          });
        } else {
          const fwdMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            text: orig.text,
            time,
            isSender: true,
            createdAt: now.toISOString(),
            status: "delivered",
            forwardedFrom: { name: senderName, chatId: fromChatId },
          };
          set((s) => ({
            messages: { ...s.messages, [toChatId]: [...(s.messages[toChatId] || []), fwdMsg] },
            directChats: s.directChats.map((item) =>
              item.id === toChatId ? { ...item, lastMsg: orig.text, time: "Just now" } : item
            ),
          }));
        }
      },

      // ── Draft messages ────────────────────────────────────────────────
      setDraft: (chatId, text) =>
        set((state) => ({
          drafts: { ...state.drafts, [chatId]: text },
        })),

      clearDraft: (chatId) =>
        set((state) => {
          const d = { ...state.drafts };
          delete d[chatId];
          return { drafts: d };
        }),

      // ── Send message ──────────────────────────────────────────────────────
      sendMessage: (text) => {
        const state = get();
        if (!state.activeChatId) return;

        const now     = new Date();
        const time    = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const createdAt = now.toISOString();
        const id      = state.activeChatId;
        const replyTo = state.replyingTo ?? undefined;

        // Clear reply and draft after capturing
        set({ replyingTo: null });
        get().clearDraft(id);

        // ── Channels: bridge to communitiesStore ──────────────────────────
        if (state.activeTab === "channels") {
          useCommunitiesStore.getState().addBroadcast(id, text);
          set((s) => ({
            channels: s.channels.map((item) =>
              item.id === id ? { ...item, lastMsg: text, time: "Just now" } : item
            ),
          }));
          return;
        }

        // ── Groups: bridge to communitiesStore ────────────────────────────
        if (state.activeTab === "groups") {
          const senderName = useAuthStore.getState().user?.name || "You";
          useCommunitiesStore.getState().addGroupMessage(id, {
            id: `gm_${Date.now()}`,
            sender: senderName,
            text,
            time,
            isMe: true,
            replyTo,
          });
          set((s) => ({
            groups: s.groups.map((item) =>
              item.id === id
                ? { ...item, lastMsg: `${senderName}: ${text}`, time: "Just now" }
                : item
            ),
          }));
          return;
        }

        // ── Direct chats ──────────────────────────────────────────────────
        const newMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          text,
          time,
          isSender: true,
          createdAt,
          replyTo,
          status: "delivered",
        };
        const current = state.messages[id] || [];
        set((s) => ({
          messages: { ...s.messages, [id]: [...current, newMessage] },
          directChats: s.directChats.map((item) =>
            item.id === id ? { ...item, lastMsg: text, time: "Just now" } : item
          ),
        }));
      },
    }),
    {
      name: 'cobucket-chats',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeTab:    state.activeTab,
        activeChatId: state.activeChatId,
        directChats:  state.directChats,
        channels:     state.channels,
        groups:       state.groups,
        messages:     state.messages,
        mutedChatIds: state.mutedChatIds,
        unreadCounts: state.unreadCounts,
        drafts:       state.drafts,
      }),
    }
  )
);
