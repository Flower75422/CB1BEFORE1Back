"use client";

import ChannelTop from "./ChannelTop";
import ChannelBody from "./ChannelBody";
import ChannelBottom from "./ChannelBottom";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export interface Channel {
  id: number;
  title: string;
  subs: string;
  owner: string;
  desc: string;
  trending?: boolean;
  isFeatured?: boolean;
  youMightLike?: boolean;
  isPrivate?: boolean;
  topics?: string[];
  avatarUrl?: string;
  isJoined?: boolean;
  isOwner?: boolean;
  monthlyActiveViewers?: number;
  handle?: string;
}

interface ChannelCardProps {
  channel: Channel;
  isOwner?: boolean;
  isSubscribed?: boolean;
  isPending?: boolean;
  onManage?: () => void;
  onOpenChat?: (channel: Channel) => void;
  onSubscribe?: () => void;
  onRequest?: () => void;
  onCancelRequest?: () => void;
  onUnsubscribe?: () => void;
  onHide?: () => void;
  onRestrict?: () => void;
  onBlock?: () => void;
}

export default function ChannelCard({
  channel,
  isOwner,
  isSubscribed,
  isPending,
  onManage,
  onOpenChat,
  onSubscribe,
  onRequest,
  onCancelRequest,
  onUnsubscribe,
  onHide,
  onRestrict,
  onBlock,
}: ChannelCardProps) {
  const { mutedChannelIds, updateChannel } = useCommunitiesStore();
  const isMuted = mutedChannelIds.includes(String(channel.id));
  const effectiveIsSubscribed = isSubscribed ?? channel.isJoined;
  const canOpen = isOwner || !channel.isPrivate || effectiveIsSubscribed;

  const handleOpenChat = () => {
    if (canOpen && onOpenChat) onOpenChat(channel);
  };

  return (
    <div className="h-[220px] bg-white p-5 rounded-[28px] border border-stone-100 hover:shadow-xl hover:shadow-stone-200/40 transition-all flex flex-col justify-between group">
      <div onClick={handleOpenChat} className={canOpen ? "cursor-pointer" : "cursor-not-allowed opacity-90"}>
        <ChannelTop
          id={channel.id}
          title={channel.title}
          subs={channel.subs}
          avatarUrl={channel.avatarUrl}
          isPrivate={channel.isPrivate}
          isJoined={effectiveIsSubscribed}
          isOwner={isOwner}
          isMuted={isMuted}
          isPending={isPending}
          handle={channel.handle}
          onManage={onManage}
          onSubscribe={onSubscribe}
          onRequest={onRequest}
          onCancelRequest={onCancelRequest}
          onUnsubscribe={onUnsubscribe}
          onHide={onHide}
          onAbout={handleOpenChat}
        />
      </div>
      <ChannelBody
        desc={channel.desc}
        trending={channel.trending}
        isFeatured={channel.isFeatured}
        youMightLike={channel.youMightLike}
        monthlyActiveViewers={channel.monthlyActiveViewers}
      />
      <ChannelBottom
        owner={channel.owner}
        handle={channel.handle}
        isPrivate={channel.isPrivate}
        isOwner={isOwner}
        isSubscribed={effectiveIsSubscribed}
        onManage={onManage}
        onView={handleOpenChat}
      />
    </div>
  );
}
