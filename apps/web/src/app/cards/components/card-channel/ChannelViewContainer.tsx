"use client";

/**
 * ChannelViewContainer — Cards page adapter
 *
 * Maps the card's `data` shape (set by openChannel in cards.search.store)
 * into the normalized ChannelData shape and renders the universal channel UI.
 *
 * The universal components live in:
 *   src/components/shared/channel/
 *
 * Communities page can do the same mapping when it migrates.
 */

import UniversalChannelContainer from "@/components/shared/channel/UniversalChannelContainer";
import type { ChannelData } from "@/components/shared/channel/channel.types";

export default function ChannelViewContainer({ data, onBack }: any) {
  // Map card data → normalized ChannelData
  const channel: ChannelData = {
    id:        data?.channelHandle ?? data?.handle?.replace("@", "") ?? "",
    name:      data?.channelName  ?? "Channel",
    handle:    data?.handle,
    avatarUrl: data?.avatarUrl,
    bio:       data?.bio,
    owner:     data?.owner,
    subs:      data?.subs ?? 0,
    isPrivate: data?.isPrivate ?? false,
    links:     data?.links ?? [],
    category:  data?.category,
  };

  return (
    <UniversalChannelContainer
      channel={channel}
      isOwner={data?.isOwner ?? false}
      onBack={onBack}
    />
  );
}
