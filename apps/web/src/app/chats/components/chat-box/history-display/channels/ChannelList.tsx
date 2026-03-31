"use client";
import { useChatsStore } from "@/store/chats/chats.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

/** Strip the internal /ch/... suffix from a handle so only @name is shown */
function cleanHandle(handle: string): string {
  if (!handle) return "";
  return handle.split("/ch/")[0];
}

export default function ChannelList({ onSelect }: any) {
  const { channels, activeChatId, setActiveChatId, unreadCounts } = useChatsStore();
  const { myChannels, mutedChannelIds } = useCommunitiesStore();
  const { user } = useAuthStore();

  const ownedChannels = myChannels
    .filter((c) => c.ownerId === user?.id)
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: cleanHandle(c.handle),
      avatarUrl: c.avatarUrl,
      time: "Owner",
    }));

  const ownedIds = new Set(ownedChannels.map((c) => String(c.id)));
  const followingChannels = channels
    .filter((c: any) => !ownedIds.has(String(c.id)))
    .map((c: any) => ({ ...c, handle: cleanHandle(c.handle) }));

  const renderItem = (item: any) => {
    const isActive = activeChatId === item.id;
    const isMuted  = mutedChannelIds.includes(String(item.id));
    const unread   = unreadCounts?.[item.id] ?? 0;
    return (
      <button
        key={item.id}
        onClick={() => { setActiveChatId(item.id); onSelect(item); }}
        className={`w-[calc(100%-16px)] mx-2 px-3 py-2.5 flex items-center gap-3 rounded-xl transition-all mb-0.5 text-left ${isActive ? "bg-stone-200/50" : "hover:bg-stone-100"}`}
      >
        <div className={`h-9 w-9 rounded-[10px] shrink-0 overflow-hidden border transition-colors ${isActive ? "border-stone-300" : "border-stone-200/60"}`}>
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white text-stone-500 font-medium text-[12px]">
              {item.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <span className={`text-[13px] font-medium truncate transition-colors ${isActive ? "text-stone-700" : unread > 0 ? "text-stone-800 font-semibold" : "text-stone-500"}`}>
              {item.name}
            </span>
            <span className="text-[10px] text-stone-400 shrink-0">{item.time}</span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <p className={`text-[11px] truncate ${isMuted ? "text-stone-300" : "text-stone-400"}`}>{item.handle}</p>
            {unread > 0 && !isMuted && (
              <span className="shrink-0 h-4 min-w-[16px] px-1 bg-stone-800 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
      {ownedChannels.length > 0 && (
        <>
          <div className="px-4 py-2 text-[10px] text-stone-400 uppercase tracking-widest">My Channels</div>
          {ownedChannels.map(renderItem)}
        </>
      )}
      {followingChannels.length > 0 && (
        <>
          <div className={`px-4 py-2 text-[10px] text-stone-400 uppercase tracking-widest ${ownedChannels.length > 0 ? "mt-2" : ""}`}>
            Following
          </div>
          {followingChannels.map(renderItem)}
        </>
      )}
      {ownedChannels.length === 0 && followingChannels.length === 0 && (
        <div className="px-4 py-6 text-center text-[12px] text-stone-400">No channels yet.</div>
      )}
    </div>
  );
}
