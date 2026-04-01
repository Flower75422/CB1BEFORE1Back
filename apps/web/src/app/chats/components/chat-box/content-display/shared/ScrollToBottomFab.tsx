"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface ScrollToBottomFabProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  newMessageCount?: number;
  onScrolledToBottom?: () => void;
}

export default function ScrollToBottomFab({ scrollRef, newMessageCount = 0, onScrolledToBottom }: ScrollToBottomFabProps) {
  const [isVisible, setIsVisible] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsVisible(distFromBottom > 200);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [scrollRef, checkScroll]);

  const handleClick = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    onScrolledToBottom?.();
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-6 h-10 w-10 rounded-full bg-white border border-stone-200 shadow-lg flex items-center justify-center z-20 hover:bg-stone-50 hover:shadow-xl transition-all active:scale-95 animate-in fade-in zoom-in-95 duration-200"
    >
      <ChevronDown size={20} className="text-stone-600" />
      {newMessageCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 bg-stone-800 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
          {newMessageCount > 99 ? "99+" : newMessageCount}
        </span>
      )}
    </button>
  );
}
