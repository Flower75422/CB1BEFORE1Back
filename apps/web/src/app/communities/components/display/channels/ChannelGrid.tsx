"use client";

import { useMemo } from "react";
import ChannelCard, { Channel } from "./card";
import EmptyCommunityState from "@/app/profile/components/EmptyCommunityState";

// 🔴 FIX: Replaced Math.random() with deterministic math using `i`
const generateMockChannels = (count: number): (Channel & { topics: string[] })[] => {
  const TOPICS = ["Technology", "Business", "Design", "Marketing", "Web3", "Science"];
  const OWNERS = ["Dr. Aris", "Sarah Chen", "Marco Polo", "Wasim Akram", "Elena R.", "Alex Rivera", "Devon Lewis"];
  const IMAGES = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=60"
  ];
  const ADJECTIVES = ["Advanced", "Daily", "Global", "Creative", "Future", "Alpha"];

  return Array.from({ length: count }).map((_, i) => {
    const primaryTopic = TOPICS[i % TOPICS.length];
    const secondaryTopic = TOPICS[(i + 2) % TOPICS.length];
    const adj = ADJECTIVES[i % ADJECTIVES.length];
    const isTrending = i % 7 === 0; 
    
    // 🔴 FIX: Deterministic math for subscriber count
    const subsCount = ((i * 3.14) % 20 + 1).toFixed(1);

    return {
      id: i + 1,
      title: `${adj} ${primaryTopic} Hub`,
      subs: `${subsCount}k`, // Safe for SSR now
      owner: OWNERS[i % OWNERS.length],
      desc: `A community driven by users sharing the latest insights, workflows, and alpha in ${primaryTopic.toLowerCase()}.`,
      trending: isTrending,
      isPrivate: false, 
      topics: [primaryTopic, secondaryTopic],
      avatarUrl: IMAGES[i % IMAGES.length],
      isJoined: i % 4 === 0 // Automatically makes every 4th channel show "Leave Channel"
    };
  });
};

const GLOBAL_DATABASE_CHANNELS = generateMockChannels(60);

interface ChannelGridProps {
  filter?: "all" | "my_channels";
  activeTopic?: string;
  onCreateRequest?: () => void;
  onOpenChat?: (channel: Channel) => void;
}

export default function ChannelGrid({ filter = "all", activeTopic = "Feed", onCreateRequest, onOpenChat }: ChannelGridProps) {
  
  const displayChannels = useMemo(() => {
    let results = GLOBAL_DATABASE_CHANNELS;

    if (filter === "my_channels") {
      results = results.filter(channel => channel.owner === "Wasim Akram");
    }

    if (activeTopic === "Following") {
      results = results.slice(0, 8); 
    } else if (activeTopic !== "Feed") {
      results = results.filter(channel => channel.topics.includes(activeTopic));
    }

    return results;
  }, [filter, activeTopic]);

  if (displayChannels.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyCommunityState 
          type="channel" 
          onCreate={onCreateRequest || (() => {})} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayChannels.map((channel) => (
          <ChannelCard 
            key={channel.id} 
            channel={channel} 
            onOpenChat={onOpenChat} 
          />
        ))}
      </div>

      {displayChannels.length > 8 && (
        <div className="w-full flex items-center justify-center py-6 border-t border-stone-200/60 mt-4">
          <span className="text-[11px] font-black text-stone-300 uppercase tracking-widest">
            Scroll for more community channels
          </span>
        </div>
      )}
    </div>
  );
}