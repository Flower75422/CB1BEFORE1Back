"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import GroupCard, { Group } from "./card";
import EmptyCommunityState from "@/app/profile/components/EmptyCommunityState";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { usePrivacyStore } from "@/store/privacy/privacy.store";

const parseMembers = (s: string): number => {
  const n = parseFloat(s);
  if (s.includes('k')) return Math.round(n * 1000);
  return Math.round(n) || 0;
};
const formatMembers = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.max(0, n));
};

const generateMockGroups = (count: number): (Group & { topics: string[]; membersNum: number })[] => {
  const TOPICS = ["Technology", "Business", "Design", "Marketing", "Web3", "Science"];
  const OWNERS = ["Wasim Akram", "Elena Rodriguez", "Alex Rivera", "Professor April", "Dr. Aris", "Sarah Chen", "Marco Polo"];
  const IMAGES = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=60"
  ];
  const NOUNS = ["Labs", "Designers", "Hub", "Circle", "Syndicate", "Guild", "Mastermind", "Collective"];

  return Array.from({ length: count }).map((_, i) => {
    const primaryTopic = TOPICS[i % TOPICS.length];
    const secondaryTopic = TOPICS[(i + 2) % TOPICS.length];
    const noun = NOUNS[i % NOUNS.length];
    const isPrivate = i % 4 === 0;
    const lastActiveDays = (i * 3 + 1) % 20;
    const membersNum = i % 3 === 0
      ? Math.round(((i * 1.7) % 5 + 1) * 1000)
      : (i * 87) % 900 + 100;
    const activeToday = (i * 23) % 50 + 5;
    const newPosts = (i * 59) % 100 + 10;
    const activity = i % 2 === 0 ? `${activeToday} active today` : `${newPosts} new posts`;

    const groupTitle = `${primaryTopic} ${noun}`;
    return {
      id: i + 1,
      title: groupTitle,
      members: formatMembers(membersNum),
      membersNum,
      owner: OWNERS[i % OWNERS.length],
      desc: `A highly curated group for discussing ${primaryTopic.toLowerCase()} workflows, sharing alpha, and networking.`,
      isPrivate,
      lastActiveDays,
      activity,
      topics: [primaryTopic, secondaryTopic],
      avatarUrl: IMAGES[i % IMAGES.length],
      isJoined: false,
      handle: `@${groupTitle.toLowerCase().replace(/[^a-z0-9\s_]/g,'').trim().replace(/\s+/g,'_').replace(/_+/g,'_')}` +
              `/gr/` +
              `${OWNERS[i % OWNERS.length].toLowerCase().replace(/[^a-z0-9\s_]/g,'').trim().replace(/\s+/g,'_').replace(/_+/g,'_')}`,
    };
  });
};

const GLOBAL_DATABASE_GROUPS = generateMockGroups(60);

interface GroupGridProps {
  filter?: "all" | "my_groups";
  activeTopic?: string;
  searchQuery?: string;
  onCreateRequest?: () => void;
  onOpenChat?: (group: Group) => void;
  onManage?: (group: Group) => void;
}

export default function GroupGrid({
  filter = "all",
  activeTopic = "Feed",
  searchQuery = "",
  onCreateRequest,
  onOpenChat,
  onManage,
}: GroupGridProps) {
  const { myGroups, joinedGroupIds, joinGroup, leaveGroup, pendingGroupJoinIds, requestJoinGroup, cancelJoinRequest, groupMemberDeltas } = useCommunitiesStore();
  const { user } = useAuthStore();
  const { hiddenGroups, addGroup } = usePrivacyStore();
  const hiddenGroupIds = new Set(hiddenGroups.map((g) => g.id));

  // ── My Groups section ─────────────────────────────────────────────────
  const myOwnedGroups: Group[] = useMemo(() => {
    return myGroups
      .filter((g) => g.ownerId === user?.id)
      .map((g) => ({
        id: g.id as any,
        title: g.name,
        members: g.members.toLocaleString(),
        owner: user?.name || "You",
        desc: g.desc,
        isPrivate: g.isPrivate,
        activity: g.activity,
        isJoined: true,
        avatarUrl: g.avatarUrl,
        isOwner: true,
        handle: g.handle,
      }));
  }, [myGroups, user]);

  // ── Global/explore groups ─────────────────────────────────────────────
  const displayGroups = useMemo(() => {
    if (activeTopic === "My Groups") return [];

    let results = [...GLOBAL_DATABASE_GROUPS];

    if (activeTopic === "Following") {
      results = results.filter((g) => joinedGroupIds.includes(String(g.id)));
    } else if (activeTopic !== "Feed") {
      results = results.filter((g) => g.topics.includes(activeTopic));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.owner.toLowerCase().includes(q) ||
          g.desc.toLowerCase().includes(q)
      );
    }

    return results.filter((g) => !hiddenGroupIds.has(g.id));
  }, [activeTopic, searchQuery, hiddenGroupIds, joinedGroupIds, groupMemberDeltas]);

  const filteredOwnedGroups = useMemo(() => {
    if (!searchQuery.trim()) return myOwnedGroups;
    const q = searchQuery.toLowerCase();
    return myOwnedGroups.filter(
      (g) => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)
    );
  }, [myOwnedGroups, searchQuery]);

  const hasOwned = filteredOwnedGroups.length > 0;
  const hasGlobal = displayGroups.length > 0;
  const isMyGroupsTab = activeTopic === "My Groups";
  const showOwned = isMyGroupsTab;

  if (isMyGroupsTab && !hasOwned) {
    return <EmptyCommunityState type="group" onCreate={onCreateRequest || (() => {})} />;
  }

  // Empty state when search has no results
  if (!hasOwned && !hasGlobal) {
    if (searchQuery.trim()) {
      return (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
            <Search size={24} className="text-stone-300" />
          </div>
          <div>
            <p className="text-[14px] font-black text-stone-400">No groups found</p>
            <p className="text-[12px] text-stone-300 mt-1">No results for "{searchQuery}"</p>
          </div>
        </div>
      );
    }
    return <EmptyCommunityState type="group" onCreate={onCreateRequest || (() => {})} />;
  }

  return (
    <div className="flex flex-col gap-6 pb-20">

      {/* ── MY GROUPS — My Groups tab + Following tab ────────────────── */}
      {showOwned && hasOwned && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest">My Groups</span>
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-[10px] text-stone-300">{filteredOwnedGroups.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOwnedGroups.map((group) => (
              <GroupCard
                key={`owned-${group.id}`}
                group={group}
                isOwner={true}
                onManage={() => onManage && onManage(group)}
                onOpenChat={onOpenChat}
                onHide={() => addGroup({ id: group.id as number, title: group.title, action: 'hide' })}
                onRestrict={() => addGroup({ id: group.id as number, title: group.title, action: 'restrict' })}
                onBlock={() => addGroup({ id: group.id as number, title: group.title, action: 'block' })}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── GLOBAL EXPLORE ────────────────────────────────────────────── */}
      {hasGlobal && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayGroups.map((group) => {
            const isJoined = joinedGroupIds.includes(String(group.id));
            const isPending = pendingGroupJoinIds.includes(String(group.id));
            const delta = groupMemberDeltas[String(group.id)] ?? 0;
            const adjustedMembers = delta !== 0 ? formatMembers(parseMembers(group.members) + delta) : group.members;
            return (
              <GroupCard
                key={group.id}
                group={{ ...group, members: adjustedMembers, isJoined }}
                onOpenChat={onOpenChat}
                isJoined={isJoined}
                isPending={isPending}
                onJoin={() => joinGroup(String(group.id))}
                onLeave={() => leaveGroup(String(group.id))}
                onRequest={() => requestJoinGroup(String(group.id))}
                onCancelRequest={() => cancelJoinRequest(String(group.id))}
                onHide={() => addGroup({ id: group.id, title: group.title, avatarUrl: group.avatarUrl, action: 'hide' })}
                onRestrict={() => addGroup({ id: group.id, title: group.title, avatarUrl: group.avatarUrl, action: 'restrict' })}
                onBlock={() => addGroup({ id: group.id, title: group.title, avatarUrl: group.avatarUrl, action: 'block' })}
              />
            );
          })}
        </div>
      )}

      {displayGroups.length > 8 && !searchQuery && (
        <div className="w-full flex items-center justify-center py-6 border-t border-stone-200/60 mt-4">
          <span className="text-[11px] font-medium text-stone-300 uppercase tracking-widest">
            Scroll for more community groups
          </span>
        </div>
      )}
    </div>
  );
}
