"use client";

import { useCardsFeedStore } from "@/store/cards/cards.feed.store";

export default function GridLayout({ isAnimating, myInterests, handleTopicSelect }: any) {
  const { interestPool, activeFilter } = useCardsFeedStore();

  return (
    <div 
      className={`flex flex-wrap gap-2 w-full max-h-[220px] overflow-y-auto no-scrollbar py-1 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}
    >
      {interestPool.map((topic: string, index: number) => {
        const isCoreTab = ["For You", "Trending", "My Cards", "Following"].includes(topic);
        const isAlreadyPinned = (myInterests ?? []).includes(topic) || activeFilter === topic || isCoreTab;
        
        return (
          <button
            key={`${topic}-${index}`} 
            onClick={() => typeof handleTopicSelect === 'function' && handleTopicSelect(topic)}
            className={`
              px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all border shadow-sm
              animate-in fade-in zoom-in-95 duration-300
              ${isAlreadyPinned 
                ? "bg-stone-100 text-stone-400 border-stone-200 opacity-60 cursor-not-allowed" 
                : "bg-white text-[#1c1917] border-stone-200 hover:border-black hover:shadow-md"
              }
            `}
            style={{ animationDelay: `${index * 5}ms` }} 
            disabled={isAlreadyPinned} 
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}