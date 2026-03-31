"use client";

import { useState, useEffect, useRef } from "react";
import FrontOfCard from "./front/FrontOfCard";
import BackOfCard from "./back/BackOfCard";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";

export default function SingleCard(props: any) {
  const [isFlipped, setIsFlipped]           = useState(false);
  const [hintActive, setHintActive]         = useState(false);
  const [hintVisible, setHintVisible]       = useState(false);
  const [isHoveringFlip, setIsHoveringFlip] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tiltRef     = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const { incrementCardViews } = useCardsFeedStore();

  // ── Hover-based flip hint — fires every 3 s while cursor is on Flip button
  useEffect(() => {
    if (!isHoveringFlip || isFlipped) {
      // Clean up when hover ends or card is already flipped
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tiltRef.current)     clearTimeout(tiltRef.current);
      setHintActive(false);
      setHintVisible(false);
      return;
    }

    // Play once immediately when hover starts
    const playOnce = () => {
      setHintActive(true);
      setHintVisible(true);
      tiltRef.current = setTimeout(() => setHintActive(false), 700); // snap back
    };

    playOnce();
    // Then repeat every 3 s
    intervalRef.current = setInterval(playOnce, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tiltRef.current)     clearTimeout(tiltRef.current);
    };
  }, [isHoveringFlip, isFlipped]);

  const handleFlip = () => {
    setIsFlipped(true);
    setIsHoveringFlip(false);
    setHintActive(false);
    setHintVisible(false);
    if (props.id) incrementCardViews(props.id);
  };

  return (
    <div className="group w-full h-full [perspective:1000px] z-0">
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] ${
          isFlipped
            ? "transition-all duration-500 [transform:rotateY(180deg)]"
            : hintActive
            ? "transition-all duration-300 [transform:rotateY(18deg)]"
            : "transition-all duration-500"
        }`}
      >
        {/* ── FRONT ─────────────────────────────────────────────── */}
        <div className="relative w-full h-full [backface-visibility:hidden] z-20 border border-[#1c1917] rounded-2xl bg-white overflow-hidden">
          <FrontOfCard
            {...props}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onOpenChannel={props.onOpenChannel}
            onFlipHoverStart={() => setIsHoveringFlip(true)}
            onFlipHoverEnd={()   => setIsHoveringFlip(false)}
          />

          {/* Flip hint badge — fades in above the bottom buttons during tilt */}
          {hintVisible && !isFlipped && (
            <div
              className={`absolute inset-0 flex items-end justify-center pb-9 pointer-events-none transition-opacity duration-300 ${
                hintActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1c1917]/80 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Flip</span>
                <span className="text-white text-[11px] leading-none">↻</span>
              </div>
            </div>
          )}
        </div>

        {/* ── BACK ──────────────────────────────────────────────── */}
        <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] z-0 border border-[#1c1917] rounded-2xl overflow-hidden">
          <BackOfCard {...props} onFlipBack={() => setIsFlipped(false)} />
        </div>
      </div>
    </div>
  );
}
