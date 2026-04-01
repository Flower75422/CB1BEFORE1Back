"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hash, Users2 } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import ChannelCard, { Channel } from "@/app/communities/components/display/channels/card";
import GroupCard, { Group } from "@/app/communities/components/display/groups/card";
import { GLOBAL_DATABASE_CHANNELS } from "@/app/communities/components/display/channels/ChannelGrid";
import { GLOBAL_DATABASE_GROUPS }   from "@/app/communities/components/display/groups/GroupGrid";

interface Props {
  onOpenChannelChat: (channel: Channel) => void;
  onOpenGroupChat:   (group: Group)   => void;
}

type SubTab = "Channels" | "Groups";

export default function ControllerFollowing({ onOpenChannelChat, onOpenGroupChat }: Props) {
  const router = useRouter();
  const { subscribedChannelIds, joinedGroupIds, myChannels: ownedChannels, myGroups: ownedGroups } = useCommunitiesStore();
  const [subTab, setSubTab] = useState<SubTab>("Channels");

  // ── Subscribed channels ─────────────────────────────────────────────────
  // Merge global DB + owned channels so subscriptions to owned channels also appear
  const allChannelPool: Channel[] = [
    ...GLOBAL_DATABASE_CHANNELS.map((c) => ({
      id:        c.id as any,
      title:     c.title,
      subs:      c.subs,
      owner:     c.owner,
      desc:      (c.desc as string) || "",
      isPrivate: c.isPrivate,
      isJoined:  true,
      isOwner:   false,
      avatarUrl: c.avatarUrl,
      handle:    c.handle,
    })),
    ...ownedChannels.map((c) => ({
      id:        c.id as any,
      title:     c.name,
      subs:      String(c.members),
      owner:     "You",
      desc:      c.desc || "",
      isPrivate: c.isPrivate,
      isJoined:  true,
      isOwner:   false,
      avatarUrl: c.avatarUrl,
      handle:    c.handle,
    })),
  ];
  const followedChannels: Channel[] = allChannelPool.filter(
    (c) => subscribedChannelIds.includes(String(c.id))
  );

  // ── Joined groups ───────────────────────────────────────────────────────
  // Merge global DB + owned groups so joins of owned groups also appear
  const allGroupPool: Group[] = [
    ...GLOBAL_DATABASE_GROUPS.map((g) => ({
      id:        g.id as any,
      title:     g.title,
      members:   g.members,
      owner:     g.owner,
      desc:      (g.desc as string) || "",
      isPrivate: g.isPrivate,
      activity:  g.activity,
      isJoined:  true,
      isOwner:   false,
      avatarUrl: g.avatarUrl,
      handle:    g.handle,
    })),
    ...ownedGroups.map((g) => ({
      id:        g.id as any,
      title:     g.name,
      members:   String(g.members),
      owner:     "You",
      desc:      g.desc || "",
      isPrivate: g.isPrivate,
      activity:  g.activity || "Active",
      isJoined:  true,
      isOwner:   false,
      avatarUrl: g.avatarUrl,
      handle:    g.handle,
    })),
  ];
  const followedGroups: Group[] = allGroupPool.filter(
    (g) => joinedGroupIds.includes(String(g.id))
  );

  const counts = { Channels: followedChannels.length, Groups: followedGroups.length };
  const SUB_TABS: SubTab[] = ["Channels", "Groups"];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">

      {/* Sub-tab bar */}
      <div className="flex items-center gap-1 mb-6">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all ${
              subTab === tab
                ? "bg-stone-800 text-white border-stone-800"
                : "bg-white text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600"
            }`}
          >
            {tab === "Channels"
              ? <Hash size={12} />
              : <Users2 size={12} />
            }
            {tab}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              subTab === tab
                ? "bg-white/20 text-white"
                : "bg-stone-100 text-stone-400"
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Channels sub-tab */}
      {subTab === "Channels" && (
        followedChannels.length === 0
          ? <FollowingEmpty
              type="channels"
              message="You haven't subscribed to any channels yet."
              cta="Explore Channels"
              onCta={() => router.push("/communities")}
            />
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {followedChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  isOwner={false}
                  onOpenChat={onOpenChannelChat}
                />
              ))}
            </div>
          )
      )}

      {/* Groups sub-tab */}
      {subTab === "Groups" && (
        followedGroups.length === 0
          ? <FollowingEmpty
              type="groups"
              message="You haven't joined any groups yet."
              cta="Explore Groups"
              onCta={() => router.push("/communities")}
            />
          : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {followedGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isOwner={false}
                  onOpenChat={onOpenGroupChat}
                />
              ))}
            </div>
          )
      )}

    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────
function FollowingEmpty({ type, message, cta, onCta }: {
  type: string;
  message: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
        {type === "channels"
          ? <Hash size={24} className="text-stone-300" />
          : <Users2 size={24} className="text-stone-300" />
        }
      </div>
      <div>
        <p className="text-[14px] font-black text-stone-400">{message}</p>
        <button
          onClick={onCta}
          className="mt-3 px-4 py-2 bg-stone-800 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black active:scale-95 transition-all"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
