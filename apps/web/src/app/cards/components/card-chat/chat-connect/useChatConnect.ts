import { useEffect } from "react";
import { useChatsStore } from "@/store/chats/chats.store";

/**
 * useChatConnect — routes card-chat messages through the unified chatsStore
 * so conversations started here appear on the /chats page too.
 */
export function useChatConnect(user: any) {
  const chatId = user?.handle || user?.id || "unknown";

  // Register the user in directChats if not already present
  useEffect(() => {
    if (!user?.name) return;
    const exists = useChatsStore.getState().directChats.some((c) => c.id === chatId);
    if (!exists) {
      useChatsStore.setState((state) => ({
        directChats: [
          { id: chatId, name: user.name, lastMsg: "Started a conversation", time: "Just now" },
          ...state.directChats,
        ],
      }));
    }
  }, [chatId, user?.name]);

  const storedMessages = useChatsStore((state) => state.messages[chatId]);

  // Seed a welcome message if this is a brand-new chat
  const messages = storedMessages ?? [
    { id: "seed_1", text: "Hey! I saw your card on the feed.", isSender: false, time: "Just now" },
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: `msg_${Date.now()}`, text, isSender: true, time };

    useChatsStore.setState((state) => {
      const existing = state.messages[chatId] ?? messages;
      return {
        messages: { ...state.messages, [chatId]: [...existing, newMsg] },
        directChats: state.directChats.map((c) =>
          c.id === chatId ? { ...c, lastMsg: text, time: "Just now" } : c
        ),
      };
    });
  };

  return { messages, sendMessage };
}
