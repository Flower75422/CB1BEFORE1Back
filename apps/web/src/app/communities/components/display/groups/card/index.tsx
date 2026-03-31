"use client";

import GroupTop from "./GroupTop";
import GroupBody from "./GroupBody";
import GroupBottom from "./GroupBottom";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export interface Group {
  id: number;
  title: string;
  members: string;
  owner: string;
  desc: string;
  isPrivate?: boolean;
  activity: string;
  lastActiveDays?: number;
  avatarUrl?: string;
  topics?: string[];
  isJoined?: boolean;
  isOwner?: boolean;
  handle?: string;
}

interface GroupCardProps {
  group: Group;
  isOwner?: boolean;
  isJoined?: boolean;
  isPending?: boolean;
  onManage?: () => void;
  onOpenChat?: (group: Group) => void;
  onJoin?: () => void;
  onLeave?: () => void;
  onRequest?: () => void;
  onCancelRequest?: () => void;
  onHide?: () => void;
  onRestrict?: () => void;
  onBlock?: () => void;
}

export default function GroupCard({
  group, isOwner, isJoined, isPending, onManage, onOpenChat, onJoin, onLeave, onRequest, onCancelRequest, onHide, onRestrict, onBlock,
}: GroupCardProps) {
  const { mutedGroupIds, updateGroup } = useCommunitiesStore();
  const isMuted = mutedGroupIds.includes(String(group.id));
  const effectiveIsJoined = isJoined ?? group.isJoined;
  const canOpen = isOwner || !group.isPrivate || effectiveIsJoined;

  const handleOpenChat = () => {
    if (canOpen && onOpenChat) onOpenChat(group);
  };

  return (
    <div className="h-[220px] bg-white p-5 rounded-[28px] border border-stone-100 hover:shadow-xl hover:shadow-stone-200/40 transition-all flex flex-col justify-between group">
      <div onClick={handleOpenChat} className={canOpen ? "cursor-pointer" : "cursor-not-allowed opacity-90"}>
        <GroupTop
          id={group.id}
          title={group.title}
          members={group.members}
          isPrivate={group.isPrivate}
          avatarUrl={group.avatarUrl}
          isJoined={effectiveIsJoined}
          isOwner={isOwner}
          isMuted={isMuted}
          isPending={isPending}
          handle={group.handle}
          onManage={onManage}
          onJoin={onJoin}
          onRequest={onRequest}
          onCancelRequest={onCancelRequest}
          onLeave={onLeave}
          onHide={onHide}
          onAbout={handleOpenChat}
        />
      </div>
      <GroupBody desc={group.desc} lastActiveDays={group.lastActiveDays} activity={group.activity} />
      <GroupBottom
        owner={group.owner}
        handle={group.handle}
        isPrivate={group.isPrivate}
        isOwner={isOwner}
        isJoined={effectiveIsJoined}
        onManage={onManage}
        onView={handleOpenChat}
      />
    </div>
  );
}
