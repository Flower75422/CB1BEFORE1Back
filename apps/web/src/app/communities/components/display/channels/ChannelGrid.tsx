"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import ChannelCard, { Channel } from "./card";
import EmptyCommunityState from "@/app/profile/components/EmptyCommunityState";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { usePrivacyStore } from "@/store/privacy/privacy.store";

const parseSubs = (s: string): number => {
  const n = parseFloat(s);
  if (s.includes('k')) return Math.round(n * 1000);
  if (s.includes('m')) return Math.round(n * 1_000_000);
  return Math.round(n) || 0;
};
const formatSubs = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.max(0, n));
};

const generateMockChannels = (count: number): (Channel & { topics: string[]; subsNum: number })[] => {
  const TOPICS = ["Technology", "Business", "Design", "Marketing", "Web3", "Science"];
  const OWNERS = ["Dr. Aris", "Sarah Chen", "Marco Polo", "Wasim Akram", "Elena R.", "Alex Rivera", "Devon Lewis"];
  const IMAGES = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=60"
  ];
  const ADJECTIVES = ["Advanced", "Daily", "Global", "Creative", "Future", "Alpha"];

  return Array.from({ length: count }).map((_, i) => {
    const primaryTopic = TOPICS[i % TOPICS.length];
    const secondaryTopic = TOPICS[(i + 2) % TOPICS.length];
    const adj = ADJECTIVES[i % ADJECTIVES.length];
    const subsNum = Math.round(((i * 3.14) % 20 + 1) * 1000);
    const monthlyActiveViewers = Math.round(((i * 17) % 80 + 5) * 1000);
    const isTrending    = monthlyActiveViewers > 60000;
    // Featured: every 7th card with high engagement — replaces MAV line with a gold badge
    const isFeatured    = i % 7 === 0 && monthlyActiveViewers > 40000;
    // You might like: every 5th card (offset so it doesn't clash with featured/trending)
    const youMightLike  = !isFeatured && !isTrending && i % 5 === 1;

    const title = `${adj} ${primaryTopic} Hub`;
    return {
      id: i + 1,
      title,
      subs: formatSubs(subsNum),
      subsNum,
      owner: OWNERS[i % OWNERS.length],
      desc: `A community driven by users sharing the latest insights, workflows, and alpha in ${primaryTopic.toLowerCase()}.`,
      trending: isTrending,
      isFeatured,
      youMightLike,
      isPrivate: false,
      topics: [primaryTopic, secondaryTopic],
      avatarUrl: IMAGES[i % IMAGES.length],
      isJoined: false,
      monthlyActiveViewers,
      handle: `@${title.toLowerCase().replace(/[^a-z0-9\s_]/g,'').trim().replace(/\s+/g,'_').replace(/_+/g,'_')}` +
              `/ch/` +
              `${OWNERS[i % OWNERS.length].toLowerCase().replace(/[^a-z0-9\s_]/g,'').trim().replace(/\s+/g,'_').replace(/_+/g,'_')}`,
    };
  });
};

const GLOBAL_DATABASE_CHANNELS = generateMockChannels(60);

interface ChannelGridProps {
  filter?: "all" | "my_channels";
  activeTopic?: string;
  searchQuery?: string;
  onCreateRequest?: () => void;
  onOpenChat?: (channel: Channel) => void;
  onManage?: (channel: Channel) => void;
}

export default function ChannelGrid({
  filter = "all",
  activeTopic = "Feed",
  searchQuery = "",
  onCreateRequest,
  onOpenChat,
  onManage,
}: ChannelGridProps) {
  const { myChannels, subscribedChannelIds, subscribeChannel, unsubscribeChannel, channelMemberDeltas, pendingChannelSubscribeIds, requestSubscribeChannel, cancelChannelSubscribeRequest } = useCommunitiesStore();
  const { user } = useAuthStore();
  const { hiddenChannels, addChannel } = usePrivacyStore();
  const hiddenChannelIds = new Set(hiddenChannels.map((c) => c.id));

  // ── My Channels section ───────────────────────────────────────────────
  const myOwnedChannels: Channel[] = useMemo(() => {
    return myChannels
      .filter((c) => c.ownerId === user?.id)
      .map((c) => ({
        id: c.id as any,
        title: c.name,
        subs: c.members.toLocaleString(),
        owner: user?.name || "You",
        desc: c.desc,
        isPrivate: c.isPrivate,
        isJoined: true,
        avatarUrl: c.avatarUrl,
        isOwner: true,
        handle: c.handle,
      }));
  }, [myChannels, user]);

  // ── Global/explore channels ───────────────────────────────────────────
  const displayChannels = useMemo(() => {
    if (activeTopic === "My Channels") return [];

    let results = [...GLOBAL_DATABASE_CHANNELS];

    if (activeTopic === "Following") {
      results = results.filter((ch) => subscribedChannelIds.includes(String(ch.id)));
    } else if (activeTopic !== "Feed") {
      results = results.filter((ch) => ch.topics.includes(activeTopic));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (ch) =>
          ch.title.toLowerCase().includes(q) ||
          ch.owner.toLowerCase().includes(q) ||
          ch.desc.toLowerCase().includes(q)
      );
    }

    return results.filter((ch) => !hiddenChannelIds.has(String(ch.id)));
  }, [activeTopic, searchQuery, hiddenChannelIds, subscribedChannelIds, channelMemberDeltas]);

  // Apply search to owned channels
  const filteredOwnedChannels = useMemo(() => {
    if (!searchQuery.trim()) return myOwnedChannels;
    const q = searchQuery.toLowerCase();
    return myOwnedChannels.filter(
      (ch) => ch.title.toLowerCase().includes(q) || ch.desc.toLowerCase().includes(q)
    );
  }, [myOwnedChannels, searchQuery]);

  const hasOwned = filteredOwnedChannels.length > 0;
  const hasGlobal = displayChannels.length > 0;
  const isMyChannelsTab = activeTopic === "My Channels";
  // Show owned channels section in: My Channels tab only, or when search query is active
  const showOwned = isMyChannelsTab || (searchQuery.trim().length > 0 && hasOwned);

  if (isMyChannelsTab && !hasOwned) {
    return <EmptyCommunityState type="channel" onCreate={onCreateRequest || (() => {})} />;
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
            <p className="text-[14px] font-black text-stone-400">No channels found</p>
            <p className="text-[12px] text-stone-300 mt-1">No results for "{searchQuery}"</p>
          </div>
        </div>
      );
    }
    return <EmptyCommunityState type="channel" onCreate={onCreateRequest || (() => {})} />;
  }

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* ── MY CHANNELS — "My Channels" tab + Following tab ─────────── */}
      {showOwned && hasOwned && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest">My Channels</span>
            <div className="flex-1 h-px bg-stone-100" />
            <span className="text-[10px] text-stone-300">{filteredOwnedChannels.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOwnedChannels.map((channel) => (
              <ChannelCard
                key={`owned-${channel.id}`}
                channel={channel}
                isOwner={true}
                onManage={() => onManage && onManage(channel)}
                onOpenChat={onOpenChat}
                onHide={() => addChannel({ id: String(channel.id), title: channel.title, action: 'hide' })}
                onRestrict={() => addChannel({ id: String(channel.id), title: channel.title, action: 'restrict' })}
                onBlock={() => addChannel({ id: String(channel.id), title: channel.title, action: 'block' })}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── GLOBAL EXPLORE ────────────────────────────────────────────── */}
      {hasGlobal && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayChannels.map((channel) => {
            const isSubscribed = subscribedChannelIds.includes(String(channel.id));
            const delta = channelMemberDeltas[String(channel.id)] ?? 0;
            const adjustedSubs = delta !== 0 ? formatSubs(parseSubs(channel.subs) + delta) : channel.subs;
            const isPending = pendingChannelSubscribeIds.includes(String(channel.id));
            return (
              <ChannelCard
                key={channel.id}
                channel={{ ...channel, subs: adjustedSubs, isJoined: isSubscribed }}
                onOpenChat={onOpenChat}
                isSubscribed={isSubscribed}
                isPending={isPending}
                onSubscribe={() => subscribeChannel(String(channel.id))}
                onRequest={() => requestSubscribeChannel(String(channel.id))}
                onCancelRequest={() => cancelChannelSubscribeRequest(String(channel.id))}
                onUnsubscribe={() => unsubscribeChannel(String(channel.id))}
                onHide={() => addChannel({ id: String(channel.id), title: channel.title, avatarUrl: channel.avatarUrl, action: 'hide' })}
                onRestrict={() => addChannel({ id: String(channel.id), title: channel.title, avatarUrl: channel.avatarUrl, action: 'restrict' })}
                onBlock={() => addChannel({ id: String(channel.id), title: channel.title, avatarUrl: channel.avatarUrl, action: 'block' })}
              />
            );
          })}
        </div>
      )}

      {displayChannels.length > 8 && !searchQuery && (
        <div className="w-full flex items-center justify-center py-6 border-t border-stone-200/60 mt-4">
          <span className="text-[11px] font-medium text-stone-300 uppercase tracking-widest">
            Scroll for more community channels
          </span>
        </div>
      )}
    </div>
  );
}
