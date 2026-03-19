"use client";

import { useMemo } from "react";
import GroupCard, { Group } from "./card";
import EmptyCommunityState from "@/app/profile/components/EmptyCommunityState";

// 🔴 FIX: Replaced Math.random() with deterministic math using the index `i`
const generateMockGroups = (count: number): (Group & { topics: string[], avatarUrl?: string })[] => {
  const TOPICS = ["Technology", "Business", "Design", "Marketing", "Web3", "Science"];
  const OWNERS = ["Wasim Akram", "Elena Rodriguez", "Alex Rivera", "Professor April", "Dr. Aris", "Sarah Chen", "Marco Polo"];
  const IMAGES = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=60"
  ];
  const NOUNS = ["Labs", "Designers", "Hub", "Circle", "Syndicate", "Guild", "Mastermind", "Collective"];

  return Array.from({ length: count }).map((_, i) => {
    const primaryTopic = TOPICS[i % TOPICS.length];
    const secondaryTopic = TOPICS[(i + 2) % TOPICS.length];
    const noun = NOUNS[i % NOUNS.length];
    const isPrivate = i % 4 === 0; 
    
    // 🔴 FIX: Deterministic numbers using `i` instead of Math.random()
    // This ensures Server and Client render the EXACT same numbers
    const memberCountK = ((i * 1.7) % 5 + 1).toFixed(1);
    const memberCountHundreds = (i * 87) % 900 + 100;
    const members = i % 3 === 0 ? `${memberCountK}k` : `${memberCountHundreds}`;

    const activeToday = (i * 23) % 50 + 5;
    const newPosts = (i * 59) % 100 + 10;
    const activity = i % 2 === 0 ? `${activeToday} active today` : `${newPosts} new posts`;

    return {
      id: i + 1,
      title: `${primaryTopic} ${noun}`,
      members: members,
      owner: OWNERS[i % OWNERS.length],
      desc: `A highly curated group for discussing ${primaryTopic.toLowerCase()} workflows, sharing alpha, and networking.`,
      isPrivate: isPrivate,
      activity: activity,
      topics: [primaryTopic, secondaryTopic],
      avatarUrl: IMAGES[i % IMAGES.length],
      isJoined: i % 3 === 0 // Automatically makes every 3rd group show "Leave Group"
    };
  });
};

const GLOBAL_DATABASE_GROUPS = generateMockGroups(60);

interface GroupGridProps {
  filter?: "all" | "my_groups";
  activeTopic?: string;
  onCreateRequest?: () => void;
  onOpenChat?: (group: Group) => void;
}

export default function GroupGrid({ filter = "all", activeTopic = "Feed", onCreateRequest, onOpenChat }: GroupGridProps) {
  
  const displayGroups = useMemo(() => {
    let results = GLOBAL_DATABASE_GROUPS;

    if (filter === "my_groups") {
      results = results.filter(group => group.owner === "Wasim Akram");
    }

    if (activeTopic === "Following") {
      results = results.slice(0, 8); 
    } else if (activeTopic !== "Feed") {
      results = results.filter(group => group.topics.includes(activeTopic));
    }

    return results;
  }, [filter, activeTopic]);

  if (displayGroups.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyCommunityState type="group" onCreate={onCreateRequest || (() => {})} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayGroups.map((group) => (
          <GroupCard 
            key={group.id} 
            group={group} 
            onOpenChat={onOpenChat} 
          />
        ))}
      </div>

      {displayGroups.length > 8 && (
        <div className="w-full flex items-center justify-center py-6 border-t border-stone-200/60 mt-4">
          <span className="text-[11px] font-black text-stone-300 uppercase tracking-widest">
            Scroll for more community groups
          </span>
        </div>
      )}
    </div>
  );
}