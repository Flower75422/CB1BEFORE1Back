import { useState } from "react";

export function useChatConnect(user: any) {
  // 1. Local State for the UI
  const [messages, setMessages] = useState([
    { id: 1, text: `Hey! I saw your card on the feed.`, sender: "me", time: "Just now" }
  ]);

  // 2. The Sync Function
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: "me",
      time: "Just now"
    };

    // Update the UI instantly
    setMessages((prev) => [...prev, newMessage]);
    
    // Sync to LocalStorage (So the main /messages page can read it)
    if (typeof window !== "undefined") {
      const chatHistoryKey = `chat_${user.handle}`;
      const existingHistory = JSON.parse(localStorage.getItem(chatHistoryKey) || "[]");
      localStorage.setItem(chatHistoryKey, JSON.stringify([...existingHistory, newMessage]));

      // Update the "Recent Chats" sidebar list
      const recentChats = JSON.parse(localStorage.getItem("recent_chats") || "[]");
      const updatedRecents = recentChats.filter((c: any) => c.handle !== user.handle);
      updatedRecents.unshift({ ...user, lastMessage: text, unread: 0 }); // Push to top
      localStorage.setItem("recent_chats", JSON.stringify(updatedRecents));
    }
  };

  return { messages, sendMessage };
}