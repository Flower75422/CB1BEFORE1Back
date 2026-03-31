"use client";

import UniversalChannelInfoPanel from "@/components/shared/channel/UniversalChannelInfoPanel";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";
import type { ChannelData } from "@/components/shared/channel/channel.types";

/** Thin adapter — maps the chats-page `data` prop into the ChannelData shape
 *  expected by UniversalChannelInfoPanel, then delegates all rendering to it. */
export default function ChannelInfoPanel({ data, onClose, onSearchOpen }: any) {
  const { myChannels } = useCommunitiesStore();
  const { user } = useAuthStore();

  // Enrich sparse chatsStore data with the full record from communitiesStore
  // Use String() coercion on both sides to avoid type mismatch (string vs number IDs)
  const storeChannel = myChannels.find((c) => String(c.id) === String(data?.id));

  const isOwner = storeChannel?.ownerId === user?.id;

  // Resolve bio from store first, then from data prop (covers both owned + followed channels)
  const resolvedBio = storeChannel?.desc ?? data?.desc ?? data?.bio ?? null;

  const channelData: ChannelData = {
    id:        String(data?.id ?? ""),
    name:      storeChannel?.name      ?? data?.name      ?? "Channel",
    handle:    storeChannel?.handle    ?? data?.handle,
    avatarUrl: storeChannel?.avatarUrl ?? data?.avatarUrl,
    bio:       resolvedBio ?? undefined,
    owner:     data?.owner             ?? data?.ownerName,
    ownerId:   storeChannel?.ownerId   ?? data?.ownerId,
    subs:      storeChannel?.members   ?? data?.members   ?? data?.subs,
    isPrivate: storeChannel?.isPrivate ?? data?.isPrivate,
    links:     storeChannel?.links     ?? data?.links,
    category:  storeChannel?.category  ?? data?.category,
  };

  return (
    <UniversalChannelInfoPanel
      channel={channelData}
      isOwner={isOwner}
      onCloseInfo={onClose}
      onSearchOpen={onSearchOpen}
    />
  );
}
