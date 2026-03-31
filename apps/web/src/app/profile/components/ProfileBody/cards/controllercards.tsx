"use client";
import { useRouter } from "next/navigation";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import { useAuthStore } from "@/store/auth/auth.store";
import { useProfileStore } from "@/store/profile/profile.store";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";
import CardsGrid from "@/app/cards/components/CardsGrid";
import SingleCard from "@/app/cards/components/single-card";

export default function ControllerCards() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profileData } = useProfileStore();
  const { myCards, toggleFollowCard } = useCardsFeedStore();
  const { openChannel, openChat } = useCardsSearchStore();

  const ownerName   = profileData.name || user?.name || "Unknown";
  const ownerHandle = "@" + (profileData.username || "").replace(/^@/, "") || user?.handle || "@user";
  const ownerAvatar = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || "User")}&background=F5F5F4&color=78716c`;

  const formattedCards = (myCards || []).map((c: any) => ({
    id: c.id,
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
    location: c.location,
  }));

  if (formattedCards.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
          <span className="text-2xl">🃏</span>
        </div>
        <p className="text-[13px] font-semibold text-stone-500">No cards yet</p>
        <p className="text-[11px] text-stone-400">Cards you create will appear here.</p>
        <button
          onClick={() => router.push("/cards")}
          className="mt-2 px-5 py-2 bg-[#1c1917] text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-black active:scale-95 transition-all"
        >
          Go to Cards
        </button>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-700">
      <CardsGrid>
        {formattedCards.map((card: any) => (
          <SingleCard
            key={card.id}
            {...card}
            isMyCardView={true}
            onOpenChannel={() => openChannel({ channelName: card.channelName, handle: `@${card.channelHandle}` })}
            onOpenChat={card.permissions?.allowChat === false ? undefined : () => openChat(card)}
          />
        ))}
      </CardsGrid>
    </div>
  );
}
