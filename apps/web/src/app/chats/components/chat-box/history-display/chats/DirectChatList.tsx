"use client";
import { BellOff } from "lucide-react";
import { useChatsStore } from "@/store/chats/chats.store";
import { useUsersStore } from "@/store/users/users.store";

export default function DirectChatList({ onSelect }: any) {
  const { directChats, activeChatId, setActiveChatId, mutedChatIds, unreadCounts, messages } = useChatsStore();
  const { getUserByName, getUser } = useUsersStore();

  /** Always derived live from messages[] — never stale after delete/send */
  const getLiveLastMsg = (chatId: string, fallback: string): string => {
    const msgs = messages[chatId];
    if (!msgs || msgs.length === 0) return fallback || "No messages yet";
    const last = msgs[msgs.length - 1];
    const prefix = last.isSender ? "You: " : "";
    return `${prefix}${last.text}`;
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
      {directChats.length === 0 && (
        <div className="px-4 py-6 text-center text-[12px] text-stone-400">
          No conversations yet. Hit ✏️ to start one.
        </div>
      )}
      {directChats.map((item) => {
        const isActive  = activeChatId === item.id;
        const isMuted   = mutedChatIds.includes(item.id);
        const unread    = unreadCounts?.[item.id] ?? 0;

        // Resolve avatarUrl + isOnline from users.store
        const chatUser  = item.userId ? getUser(item.userId) : getUserByName(item.name);
        const avatarUrl = chatUser?.avatarUrl;
        const isOnline  = chatUser?.isOnline ?? false;

        return (
          <button
            key={item.id}
            onClick={() => { setActiveChatId(item.id); onSelect(item); }}
            className={`w-[calc(100%-16px)] mx-2 px-3 py-2.5 flex items-center gap-3 rounded-xl transition-all mb-0.5 text-left ${isActive ? "bg-stone-200/50" : "hover:bg-stone-100"}`}
          >
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <div className={`h-9 w-9 rounded-full overflow-hidden border transition-colors ${isActive ? "border-stone-300" : "border-stone-200/60"}`}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white text-stone-500 font-medium text-[12px]">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              {/* Online dot */}
              <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-[1.5px] border-[#FDFBF7] ${isOnline ? "bg-green-400" : "bg-stone-300"}`} />
            </div>

            {/* Name + last message */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`text-[13px] font-medium truncate transition-colors ${isActive ? "text-stone-700" : unread > 0 ? "text-stone-800 font-semibold" : "text-stone-500"}`}>
                    {item.name}
                  </span>
                  {isMuted && <BellOff size={10} className="text-stone-300 shrink-0" />}
                </div>
                <span className="text-[10px] text-stone-400 shrink-0">{item.time}</span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className={`text-[11px] truncate ${isMuted ? "text-stone-300" : unread > 0 ? "text-stone-600 font-medium" : "text-stone-400"}`}>
                  {getLiveLastMsg(item.id, item.lastMsg)}
                </p>
                {unread > 0 && !isMuted && (
                  <span className="shrink-0 h-4 min-w-[16px] px-1 bg-stone-800 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
