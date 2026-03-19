"use client";

import { useState } from "react";
import { Pencil } from "lucide-react"; // 🔴 Import Pencil icon
import FrontOfCard from "./front/FrontOfCard";
import BackOfCard from "./back/BackOfCard";

export default function SingleCard(props: any) {
  const [isFlipped, setIsFlipped] = useState(false);

  // 🔴 Destructure the new props we added in Feed.tsx
  const { onOpenChannel, onOpenChat, channelName, name, handle, isMyCardView, onEditCard } = props;

  const handleChannelClick = () => {
    if (onOpenChannel) {
      onOpenChannel({
        channelName: channelName || `${name || 'User'}'s Channel`,
        handle: handle || "@unknown"
      });
    }
  };

  return (
    <div className="group w-full h-full [perspective:1000px] z-0">
      <div 
        className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* --- FRONT SIDE --- */}
        <div className="relative w-full h-full [backface-visibility:hidden] z-20 border border-[#1c1917] rounded-2xl bg-white">
          
          {/* 🔴 EDIT BUTTON OVERLAY - Only shows when in "My Cards" view */}
          {isMyCardView && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents clicking the card background
                if (onEditCard) onEditCard();
              }}
              className="absolute top-4 left-4 z-[60] flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-full shadow-md hover:bg-stone-800 transition-colors active:scale-95"
            >
              <Pencil size={12} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-wider">Edit</span>
            </button>
          )}

          <FrontOfCard 
            {...props} 
            onFlip={() => setIsFlipped(true)}
            onOpenChannel={handleChannelClick}
            onOpenChat={onOpenChat}
          />
        </div>

        {/* --- BACK SIDE --- */}
        <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] z-0 border border-[#1c1917] rounded-2xl overflow-hidden">
          <BackOfCard 
            {...props} 
            onFlipBack={() => setIsFlipped(false)} 
          />
        </div>
      </div>
    </div>
  );
}