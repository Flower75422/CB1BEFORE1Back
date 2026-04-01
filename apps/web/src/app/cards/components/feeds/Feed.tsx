"use client";

import CardsGrid from "../CardsGrid";
import SingleCard from "../single-card";
import { useAuthStore } from "@/store/auth/auth.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";
import { usePrivacyStore } from "@/store/privacy/privacy.store";
import { useProfileStore } from "@/store/profile/profile.store";

export default function Feed({ onEditCard }: { onEditCard: (id: string) => void }) {
  const { user } = useAuthStore();
  const { profileData } = useProfileStore();
  const { activeFilter, myCards, followedCards, globalFeed, toggleFollowCard } = useCardsFeedStore();
  const { openChannel, openChat, openProfile } = useCardsSearchStore();
  const { hiddenChannels, addChannel } = usePrivacyStore();

  // A card is its linked channel — filter by channelHandle
  const hiddenChannelIds = new Set(hiddenChannels.map((c) => c.id));

  // BULLETPROOFING: Force these to ALWAYS be arrays
  const safeMyCards = myCards || [];
  const safeFollowedCards = followedCards || [];
  const safeGlobalFeed = globalFeed || [];

  let displayCards: any[] = [];

  // Owner identity comes from the public profile (display name + handle set in Settings → Profile)
  const ownerName   = profileData.name     || user?.name     || "Unknown";
  const ownerHandle = profileData.username
    ? "@" + profileData.username.replace(/^@/, "")
    : (user?.handle || "@user");
  const ownerAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || "User")}&background=F5F5F4&color=78716c`;

  // Formats your personal cards (owned by the logged-in user)
  const myFormattedCards = safeMyCards
    .filter((c: any) => activeFilter === "My Cards" || c.channel?.isPublic)
    .map((c: any) => ({
      id: c.id,
      // Use profile display name + handle so the chat box reflects the owner's public identity
      name: ownerName,
      handle: ownerHandle,
      avatarUrl: ownerAvatar,
      views: c.stats?.views,
      likes: c.stats?.likes,
      posts: c.stats?.posts,
      description: c.bio,
      channelName: c.channel?.name,
      channelHandle: c.channel?.id,
      mediaUrl: c.backMediaUrl,
      mediaType: "image",
      primaryInterest: c.interests?.primary,
      permissions: c.permissions,
      allowFullProfile: c.permissions?.allowFullProfile !== false,
      isPrivate: !(c.channel?.isPublic ?? true),
      wallPosts: c.wallPosts || [],
      location: c.location,
      reachability: c.permissions?.reachability ?? "Global",
    }));

  // Formats any raw store card (globalFeed / followedCards) into the SingleCard shape
  const formatCard = (c: any) => ({
    id: c.id,
    name: c.name,
    handle: c.handle,
    avatarUrl: c.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || "User")}&background=F5F5F4&color=78716c`,
    views: c.stats?.views,
    likes: c.stats?.likes,
    posts: c.stats?.posts,
    description: c.bio,
    channelName: c.channel?.name,
    channelHandle: c.channel?.id,
    mediaUrl: c.backMediaUrl,
    mediaType: "image",
    primaryInterest: c.interests?.primary,
    permissions: c.permissions,
    allowFullProfile: c.permissions?.allowFullProfile !== false,
    isPrivate: !(c.channel?.isPublic ?? true),
    wallPosts: c.wallPosts || [],
    location: c.location,
    reachability: c.permissions?.reachability ?? "Global",
  });

  const CORE_TABS = ["For You", "Trending", "My Cards", "Following"];

  // Cards restricted to Country/Local should never appear in the global "For You" / "Trending" mixes
  const isGloballyReachable = (c: any) => {
    const r = (c.permissions?.reachability ?? c.reachability ?? "Global").toLowerCase();
    return r === "global";
  };

  if (activeFilter === "Following") {
    // Show cards the user explicitly follows — formatted correctly
    displayCards = safeFollowedCards.map(formatCard);

  } else if (activeFilter === "Trending") {
    // Show globally-reachable cards sorted by views (most popular first)
    displayCards = [...safeGlobalFeed]
      .filter(isGloballyReachable)
      .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
      .map(formatCard);

  } else if (activeFilter === "My Cards") {
    displayCards = myFormattedCards;

  } else if (activeFilter === "For You") {
    // Mix: user's own cards (all) + globally-reachable global feed
    const globallyReachableGlobal = safeGlobalFeed.filter(isGloballyReachable).map(formatCard);
    displayCards = [...myFormattedCards, ...globallyReachableGlobal];

  } else {
    // ── INTEREST FILTER ──────────────────────────────────────────────
    // User selected a specific interest topic (e.g. "AI", "Design")
    // Show all cards from globalFeed + followedCards + myCards
    // whose primaryInterest matches the selected topic
    const topic = activeFilter.toLowerCase();

    const matchingGlobal = safeGlobalFeed
      .filter((c: any) => c.interests?.primary?.toLowerCase() === topic)
      .map(formatCard);

    const matchingFollowed = safeFollowedCards
      .filter((c: any) => c.interests?.primary?.toLowerCase() === topic)
      .map(formatCard);

    const matchingMine = myFormattedCards
      .filter((c: any) => c.primaryInterest?.toLowerCase() === topic);

    displayCards = [...matchingMine, ...matchingFollowed, ...matchingGlobal];
  }

  // FINAL CRASH PROTECTION + filter cards whose linked channel is hidden/restricted/blocked
  const finalCardsToRender = (displayCards || []).filter(
    (card: any) => !hiddenChannelIds.has(String(card.channelHandle ?? card.id))
  );

  return (
    // Added a slight top padding (pt-2) so it breathes nicely under your horizontal tabs
    <div className="animate-in fade-in duration-500 w-full pt-2">
      
      {/* 🔴 THE FIX: Completely nuked the header div. It's gone forever. */}

      <CardsGrid>
        {finalCardsToRender.length > 0 ? (
          finalCardsToRender.map((card: any) => {
            const isMyCardGlobally = safeMyCards.some((myCard: any) => myCard.id === card.id);
            const isFollowedGlobally = safeFollowedCards.some((c: any) => c.id === card.id);

            return (
              <SingleCard
                key={card.id}
                {...card}
                isFollowed={isFollowedGlobally}
                onFollowToggle={() => toggleFollowCard(card)}
                onOpenChannel={() => openChannel({
                  channelName: card.channelName,
                  channelHandle: card.channelHandle,
                  handle: `@${card.channelHandle}`,
                  owner: card.name,
                  bio: card.description,
                  avatarUrl: card.avatarUrl,
                  subs: card.views ?? 0,
                  isPrivate: false,
                  isOwner: isMyCardGlobally,
                })}
                onOpenChat={card.permissions?.allowChat === false ? undefined : () => openChat(card)}
                isMyCardView={isMyCardGlobally}
                onEditCard={() => onEditCard(card.id)}
                onHideCard={() => addChannel({ id: String(card.channelHandle ?? card.id), title: card.channelName || card.name, handle: card.handle, avatarUrl: card.avatarUrl, action: 'hide' })}
                onOpenProfile={(data?: any) => openProfile(data || {
                  name: card.name,
                  handle: card.handle,
                  avatarUrl: card.avatarUrl,
                  bio: card.description,
                  views: card.views,
                  location: card.location,
                  mediaUrl: card.mediaUrl,
                  channelName: card.channelName,
                  channelHandle: card.channelHandle,
                  isPrivate: card.isPrivate,
                  wallPosts: card.wallPosts,
                })}
              />
            );
          })
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center gap-2 text-stone-400">
            <span className="text-[14px] font-medium text-stone-500">No cards found for "{activeFilter}"</span>
            <span className="text-[12px]">
              {activeFilter === "Following"
                ? "Follow some cards to see them here."
                : activeFilter === "My Cards"
                ? "Create your first card to get started."
                : CORE_TABS.includes(activeFilter)
                ? "No cards available right now."
                : "No one has set this as their primary interest yet."}
            </span>
          </div>
        )}
      </CardsGrid>
    </div>
  );
}