"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ChatHeader from "./top-display/ChatHeader";
import ChatBody from "./body-display/ChatBody";
import ChatInput from "./input-display/ChatInput";
import ChatSettings from "./settings/ChatSettings";
import { useChatConnect } from "./chat-connect/useChatConnect";
import { useAuthStore } from "@/store/auth/auth.store";

export default function CardChatView({ user, onBack }: any) {
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user: currentUser } = useAuthStore();

  // Wire the chat hook — loads/persists messages for this user
  const { messages, sendMessage } = useChatConnect(user);

  // Owner check: if the card owner IS the logged-in user, chat isn't meaningful
  const isOwner = currentUser?.id === user?.id || currentUser?.handle === user?.handle;

  // Filter messages by search query
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m: any) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Lock background scroll when chat is open
  useEffect(() => {
    const rootMain = document.querySelector("main");
    if (rootMain) {
      const originalOverflow = rootMain.style.overflow;
      rootMain.style.overflow = "hidden";
      return () => { rootMain.style.overflow = originalOverflow; };
    } else {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = originalStyle; };
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

      {/* LEFT/MAIN: Chat Area */}
      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? 'w-2/3 border-r border-stone-200' : 'w-full'}`}>
        <ChatHeader
          user={user}
          onBack={onBack}
          onToggleInfo={() => setShowInfo(!showInfo)}
          isInfoOpen={showInfo}
          onToggleSearch={() => { setShowSearch(s => !s); setSearchQuery(""); }}
          isSearchOpen={showSearch}
        />

        {/* Search bar (inline, below header) */}
        {showSearch && (
          <div className="px-4 py-2 bg-white border-b border-stone-100 flex items-center gap-2 shrink-0">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 h-9 bg-stone-100 rounded-full px-4 text-[12px] font-bold text-[#1c1917] placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-300 focus:bg-white transition-all"
            />
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(""); }}
              className="text-stone-400 hover:text-[#1c1917] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <ChatBody messages={filteredMessages} />

        {/* If the current user is the owner of this card, block self-chat */}
        {isOwner ? (
          <div className="h-[76px] bg-white border-t border-stone-100 px-4 flex items-center justify-center shrink-0">
            <span className="text-[12px] font-semibold text-stone-400 italic">This is your own card — you can't chat with yourself.</span>
          </div>
        ) : (
          <ChatInput onSend={sendMessage} />
        )}
      </div>

      {/* RIGHT: Settings / Info Panel */}
      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative z-20">
          <ChatSettings user={user} onCloseInfo={() => setShowInfo(false)} />
        </div>
      )}

    </div>
  );
}
