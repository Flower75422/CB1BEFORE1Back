"use client";

import { useUsersStore } from "@/store/users/users.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { UserPlus, TrendingUp, Users, Check } from "lucide-react";
import Image from "next/image";

// ── People Card ───────────────────────────────────────────────────────────────

function PersonCard({
  user,
  isFollowing,
  onFollow,
}: {
  user: { id: string; name: string; handle: string; bio?: string; avatarUrl?: string };
  isFollowing: boolean;
  onFollow: () => void;
}) {
  return (
    <div className="flex-shrink-0 w-52 bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4 hover:shadow-md transition-all flex flex-col items-center text-center gap-2">
      {/* Avatar */}
      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-stone-100">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-lg font-semibold">
            {user.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="w-full">
        <p className="text-[13px] font-semibold text-stone-800 leading-tight truncate">{user.name}</p>
        <p className="text-[11px] text-stone-400 truncate">{user.handle}</p>
        {user.bio && (
          <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-snug">{user.bio}</p>
        )}
      </div>

      {/* Follow button */}
      <button
        onClick={onFollow}
        disabled={isFollowing}
        className={`mt-auto w-full py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
          isFollowing
            ? "border border-stone-200 text-stone-400 cursor-default"
            : "bg-stone-900 text-white hover:bg-stone-700 active:scale-95"
        }`}
      >
        {isFollowing ? (
          <span className="flex items-center justify-center gap-1">
            <Check size={11} strokeWidth={2.5} /> Following
          </span>
        ) : (
          "Follow"
        )}
      </button>
    </div>
  );
}

// ── Channel Card ─────────────────────────────────────────────────────────────

function ChannelCard({
  channel,
  isSubscribed,
  onSubscribe,
}: {
  channel: {
    id: string;
    name: string;
    handle: string;
    members: number;
    desc: string;
    category: string;
    avatarUrl?: string;
    channelMemberDeltas?: number;
  };
  isSubscribed: boolean;
  onSubscribe: () => void;
}) {
  const displayMembers = channel.members + (channel.channelMemberDeltas ?? 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4 hover:shadow-md transition-all flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-stone-100">
          {channel.avatarUrl ? (
            <Image
              src={channel.avatarUrl}
              alt={channel.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm font-semibold">
              {channel.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-stone-800 truncate leading-tight">{channel.name}</p>
          <p className="text-[11px] text-stone-400 truncate">{displayMembers.toLocaleString()} subscribers</p>
        </div>
      </div>

      {/* Desc */}
      <p className="text-[12px] text-stone-500 line-clamp-2 leading-snug">{channel.desc}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
          {channel.category}
        </span>
        <button
          onClick={onSubscribe}
          className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
            isSubscribed
              ? "border border-stone-200 text-stone-400"
              : "bg-stone-900 text-white hover:bg-stone-700 active:scale-95"
          }`}
        >
          {isSubscribed ? (
            <span className="flex items-center gap-1">
              <Check size={11} strokeWidth={2.5} /> Following
            </span>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Group Card ────────────────────────────────────────────────────────────────

function GroupCard({
  group,
  isJoined,
  onJoin,
}: {
  group: {
    id: string;
    name: string;
    handle: string;
    members: number;
    desc: string;
    category: string;
    activity: string;
    avatarUrl?: string;
    groupMemberDeltas?: number;
  };
  isJoined: boolean;
  onJoin: () => void;
}) {
  const displayMembers = group.members + (group.groupMemberDeltas ?? 0);

  const activityColor =
    group.activity === "Very Active"
      ? "bg-emerald-100 text-emerald-700"
      : group.activity === "Active"
      ? "bg-sky-100 text-sky-700"
      : "bg-stone-100 text-stone-500";

  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4 hover:shadow-md transition-all flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-stone-100">
          {group.avatarUrl ? (
            <Image
              src={group.avatarUrl}
              alt={group.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm font-semibold">
              {group.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-stone-800 truncate leading-tight">{group.name}</p>
          <p className="text-[11px] text-stone-400 truncate">{displayMembers.toLocaleString()} members</p>
        </div>
      </div>

      {/* Desc */}
      <p className="text-[12px] text-stone-500 line-clamp-2 leading-snug">{group.desc}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${activityColor}`}>
          {group.activity}
        </span>
        <button
          onClick={onJoin}
          className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
            isJoined
              ? "border border-stone-200 text-stone-400"
              : "bg-stone-900 text-white hover:bg-stone-700 active:scale-95"
          }`}
        >
          {isJoined ? (
            <span className="flex items-center gap-1">
              <Check size={11} strokeWidth={2.5} /> Joined
            </span>
          ) : (
            "Join"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Section Heading ───────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={14} strokeWidth={2.5} className="text-stone-400" />
      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
        {label}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { users, followingIds, follow } = useUsersStore();
  const {
    myChannels,
    myGroups,
    subscribedChannelIds,
    joinedGroupIds,
    subscribeChannel,
    joinGroup,
    channelMemberDeltas,
    groupMemberDeltas,
  } = useCommunitiesStore();

  // People: exclude owner (u_1) and already-followed users
  const suggestedPeople = users.filter(
    (u) => u.id !== "u_1" && !followingIds.includes(u.id)
  );

  return (
    <main className="min-h-screen w-full bg-[#FDFBF7] flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[1400px] px-6 pt-2 pb-12">

        {/* Page title */}
        <div className="mb-8 pt-4">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Explore</h1>
          <p className="text-[13px] text-stone-400 mt-0.5">Discover people, channels, and groups</p>
        </div>

        {/* ── Section 1: People to Follow ── */}
        <section className="mb-10">
          <SectionHeading icon={UserPlus} label="People to Follow" />

          {suggestedPeople.length === 0 ? (
            <p className="text-[13px] text-stone-400">You&apos;re already following everyone!</p>
          ) : (
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.explore-scroll::-webkit-scrollbar { display: none; }`}</style>
              {suggestedPeople.map((user) => (
                <PersonCard
                  key={user.id}
                  user={user}
                  isFollowing={followingIds.includes(user.id)}
                  onFollow={() => follow(user.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Section 2: Trending Channels ── */}
        <section className="mb-10">
          <SectionHeading icon={TrendingUp} label="Trending Channels" />

          {myChannels.length === 0 ? (
            <p className="text-[13px] text-stone-400">No channels to show yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {myChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={{
                    ...channel,
                    channelMemberDeltas: channelMemberDeltas[channel.id] ?? 0,
                  }}
                  isSubscribed={subscribedChannelIds.includes(channel.id)}
                  onSubscribe={() => subscribeChannel(channel.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Section 3: Active Groups ── */}
        <section className="mb-10">
          <SectionHeading icon={Users} label="Active Groups" />

          {myGroups.length === 0 ? (
            <p className="text-[13px] text-stone-400">No groups to show yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {myGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={{
                    ...group,
                    groupMemberDeltas: groupMemberDeltas[group.id] ?? 0,
                  }}
                  isJoined={joinedGroupIds.includes(group.id)}
                  onJoin={() => joinGroup(group.id)}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
