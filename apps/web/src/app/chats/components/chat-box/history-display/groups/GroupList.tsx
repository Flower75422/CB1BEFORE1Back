"use client";
import { useChatsStore } from "@/store/chats/chats.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

export default function GroupList({ onSelect }: any) {
  const { groups, activeChatId, setActiveChatId, unreadCounts } = useChatsStore();
  const { myGroups, groupMessages, joinedGroupIds } = useCommunitiesStore();
  const { user } = useAuthStore();

  /** Get the last message preview for a group from the communities store */
  const getLastMsg = (groupId: string): string => {
    const msgs = groupMessages[groupId];
    if (!msgs || msgs.length === 0) return "No messages yet";
    const last = msgs[msgs.length - 1];
    const prefix = last.isMe ? "You" : last.sender || "Member";
    return `${prefix}: ${last.text}`;
  };

  const ownedGroups = myGroups
    .filter((g) => g.ownerId === user?.id)
    .map((g) => ({
      id: g.id,
      name: g.name,
      handle: g.handle,
      avatarUrl: g.avatarUrl,
      time: "Owner",
      lastMsg: getLastMsg(g.id),
    }));

  const ownedIds = new Set(ownedGroups.map((g) => String(g.id)));

  // Joined groups: from chats.store + any from communities joinedGroupIds not in chats.store
  const joinedFromStore = groups.filter((g: any) => !ownedIds.has(String(g.id)));
  const extraJoined = myGroups
    .filter((g) => joinedGroupIds.includes(g.id) && !ownedIds.has(String(g.id)))
    .filter((g) => !joinedFromStore.some((s: any) => String(s.id) === String(g.id)))
    .map((g) => ({
      id: g.id,
      name: g.name,
      handle: g.handle,
      avatarUrl: g.avatarUrl,
      time: "",
      lastMsg: getLastMsg(g.id),
    }));

  const joinedGroups = [
    ...joinedFromStore.map((g: any) => ({ ...g, lastMsg: getLastMsg(g.id) })),
    ...extraJoined,
  ];

  const renderItem = (item: any) => {
    const isActive = activeChatId === item.id;
    const unread   = unreadCounts?.[item.id] ?? 0;
    return (
      <button
        key={item.id}
        onClick={() => { setActiveChatId(item.id); onSelect(item); }}
        className={`w-[calc(100%-16px)] mx-2 px-3 py-2.5 flex items-center gap-3 rounded-xl transition-all mb-0.5 text-left ${isActive ? "bg-stone-200/50" : "hover:bg-stone-100"}`}
      >
        <div className={`h-9 w-9 rounded-[12px] shrink-0 overflow-hidden border transition-colors ${isActive ? "border-stone-300" : "border-stone-200/60"}`}>
          {item.avatarUrl ? (
            <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-500 font-medium text-[12px]">
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
            <p className={`text-[11px] truncate ${unread > 0 ? "text-stone-600 font-medium" : "text-stone-400"}`}>{item.lastMsg}</p>
            {unread > 0 && (
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
      {ownedGroups.length > 0 && (
        <>
          <div className="px-4 py-2 text-[10px] text-stone-400 uppercase tracking-widest">My Groups</div>
          {ownedGroups.map(renderItem)}
        </>
      )}
      {joinedGroups.length > 0 && (
        <>
          <div className={`px-4 py-2 text-[10px] text-stone-400 uppercase tracking-widest ${ownedGroups.length > 0 ? "mt-2" : ""}`}>
            Joined
          </div>
          {joinedGroups.map(renderItem)}
        </>
      )}
      {ownedGroups.length === 0 && joinedGroups.length === 0 && (
        <div className="px-4 py-6 text-center text-[12px] text-stone-400">No groups yet.</div>
      )}
    </div>
  );
}
