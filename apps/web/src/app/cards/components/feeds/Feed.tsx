"use client";

import { useState } from "react";
import CardsGrid from "../CardsGrid";
import SingleCard from "../single-card";

interface FeedProps {
  activeFilter: string;
  onOpenChannel?: (data: any) => void;
  onOpenChat?: (user: any) => void;
  myCards?: any[]; 
  globalUser?: any; 
  onEditCard?: (cardId: string) => void; // 🔴 NEW PROP
}

const INITIAL_FOLLOWING = [
  { id: "f1", name: "Mike Creator", handle: "@mike_builds", views: "4k", likes: 210, posts: 8, description: "Day 12 of building my SaaS...", createdAt: "Just now", mediaUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_24fps.mp4", mediaType: "video", channelName: "Mike's Startup Journey" },
];

const TRENDING_CARDS = [
  { id: "t1", name: "Startup Daily", handle: "@startups", views: "15k", likes: 890, posts: 156, description: "YCombinator just released their new list.", createdAt: "1h ago", mediaUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60", mediaType: "image", channelName: "Startup Daily" },
  { id: "t2", name: "AI Weekly", handle: "@ai_news", views: "12k", likes: 640, posts: 42, description: "DeepMind's new model solves geometry.", createdAt: "2h ago", mediaUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60", mediaType: "image", channelName: "AI Weekly" },
];

const generateCards = (topic: string) => {
  return Array.from({ length: 6 }).map((_, i) => {
    const isEven = i % 2 === 0;
    return {
      id: `${topic}-${i}`,
      name: isEven ? "Sarah Designer" : "Devon Lewis",
      handle: isEven ? "@sarah_ux" : "@dev_lewis",
      avatarUrl: isEven ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80" : "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80",
      views: "1.2k", likes: 69, posts: 12,
      description: `Exploring the best practices in ${topic === "For You" ? "digital creation" : topic}.`,
      createdAt: "2h ago",
      channelName: `${isEven ? "Sarah Designer" : "Devon Lewis"}'s Channel`, 
      mediaUrl: isEven ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60" : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
      mediaType: "image"
    };
  });
};

export default function Feed({ activeFilter, onOpenChannel, onOpenChat, myCards = [], globalUser, onEditCard }: FeedProps) {
  const [followedCards, setFollowedCards] = useState<any[]>(INITIAL_FOLLOWING);

  const handleFollowToggle = (cardToFollow: any) => {
    setFollowedCards((prev) => {
      const isAlreadyFollowing = prev.some((c) => c.id === cardToFollow.id);
      if (isAlreadyFollowing) return prev.filter((c) => c.id !== cardToFollow.id);
      return [cardToFollow, ...prev];
    });
  };

  let displayCards: any[] = [];
  let headerTitle = activeFilter;
  let headerBadge = "Recommended";

  const myFormattedCards = myCards
    .filter(c => {
      if (activeFilter === "My Cards") return true;
      if (activeFilter === "For You") return c.channel?.isPublic;
      return c.channel?.isPublic && c.interests?.primary?.toLowerCase() === activeFilter.toLowerCase();
    })
    .map(c => ({
      id: c.id,
      name: globalUser?.name || "User",                 
      handle: globalUser?.handle || "@user",             
      avatarUrl: globalUser?.avatarUrl || "",       
      views: c.stats?.views || 0,                   
      likes: c.stats?.likes || 0,
      posts: c.stats?.posts || 0,
      description: c.bio,                     
      channelName: c.channel?.name || "Channel",
      mediaUrl: c.backMediaUrl,               
      mediaType: "image",
      primaryInterest: c.interests?.primary,
      permissions: c.permissions              
    }));

  if (activeFilter === "Following") {
    displayCards = followedCards;
    headerTitle = "Your Following";
    headerBadge = `${followedCards.length} Active`;
  } else if (activeFilter === "Trending") {
    displayCards = TRENDING_CARDS;
    headerTitle = "Trending Now";
    headerBadge = "Hot";
  } else if (activeFilter === "My Cards") {
    displayCards = myFormattedCards;
    headerTitle = "My Active Deck";
    headerBadge = `${myFormattedCards.length}/9 Slots`;
  } else {
    displayCards = [...myFormattedCards, ...generateCards(activeFilter)];
    headerTitle = activeFilter === "For You" ? "For You" : `${activeFilter} Feed`;
  }

  return (
    <div className="animate-in fade-in duration-500 w-full">
      <div className="flex items-center gap-3 mb-4 px-1">
        <h2 className="text-[15px] font-bold text-[#1c1917] capitalize">{headerTitle}</h2>
        <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
          {headerBadge}
        </span>
      </div>

      <CardsGrid>
        {displayCards.length > 0 ? (
          displayCards.map((card: any) => {
            const isFollowed = followedCards.some((c) => c.id === card.id);

            return (
              <SingleCard 
                key={card.id} 
                {...card} 
                isFollowed={isFollowed} 
                onFollowToggle={() => handleFollowToggle(card)} 
                onOpenChannel={onOpenChannel} 
                onOpenChat={card.permissions?.allowChat === false ? undefined : onOpenChat}
                // 🔴 Pass flag to tell SingleCard if it's currently in "My Cards" view
                isMyCardView={activeFilter === "My Cards"}
                onEditCard={() => onEditCard && onEditCard(card.id)}
              />
            );
          })
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-stone-400">
            <span className="text-[13px] font-bold">No cards found in this deck.</span>
          </div>
        )}
      </CardsGrid>
    </div>
  );
}