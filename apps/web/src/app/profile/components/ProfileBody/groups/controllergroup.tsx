"use client";
import { useRouter } from "next/navigation";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";
import EmptyCommunityState from "../../EmptyCommunityState";
import GroupCard, { Group } from "@/app/communities/components/display/groups/card";

interface Props {
  onOpenChat: (group: Group) => void;
}

export default function ControllerGroup({ onOpenChat }: Props) {
  const router = useRouter();
  const { myGroups } = useCommunitiesStore();
  const { user } = useAuthStore();

  const ownedGroups: Group[] = myGroups
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
      isOwner: true,
      ownerId: user?.id,
      avatarUrl: g.avatarUrl,
      handle: g.handle,
    }));

  if (ownedGroups.length === 0) {
    return <EmptyCommunityState type="group" onCreate={() => router.push("/communities")} />;
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {ownedGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            isOwner={true}
            onOpenChat={onOpenChat}
            onManage={() => onOpenChat(group)}
          />
        ))}
      </div>
    </div>
  );
}
