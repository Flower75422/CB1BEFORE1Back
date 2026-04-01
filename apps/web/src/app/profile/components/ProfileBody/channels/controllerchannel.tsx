"use client";
import { useRouter } from "next/navigation";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";
import EmptyCommunityState from "../../EmptyCommunityState";
import ChannelCard, { Channel } from "@/app/communities/components/display/channels/card";

interface Props {
  onOpenChat: (channel: Channel) => void;
}

export default function ControllerChannel({ onOpenChat }: Props) {
  const router = useRouter();
  const { myChannels } = useCommunitiesStore();
  const { user } = useAuthStore();

  const ownedChannels: Channel[] = myChannels
    .filter((c) => c.ownerId === user?.id)
    .map((c) => ({
      id: c.id as any,
      title: c.name,
      subs: c.members.toLocaleString(),
      owner: user?.name || "You",
      desc: c.desc || "",
      isPrivate: c.isPrivate,
      isJoined: true,
      isOwner: true,
      ownerId: user?.id,
      avatarUrl: c.avatarUrl,
      handle: c.handle,
    }));

  if (ownedChannels.length === 0) {
    return <EmptyCommunityState type="channel" onCreate={() => router.push("/communities")} />;
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {ownedChannels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isOwner={true}
            onOpenChat={onOpenChat}
            onManage={() => onOpenChat(channel)}
          />
        ))}
      </div>
    </div>
  );
}
