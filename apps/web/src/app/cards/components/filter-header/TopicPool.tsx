"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import GridContainer from "./interest-grid/GridContainer";

export default function TopicPool() {
  const {
    interestPool, refreshInterestPool,
    activeFilter, setActiveFilter,
    myCards, followedCards,
    myInterests, addInterest, removeInterest,
  } = useCardsFeedStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsModalOpen(false);
    }
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  useEffect(() => {
    if (interestPool.length === 0) refreshInterestPool();
  }, []);

  const handleTopicSelect = (topic: string) => {
    addInterest(topic);
    setActiveFilter(topic);
    setIsModalOpen(false);
  };

  const handleRemovePinned = (e: React.MouseEvent, topic: string) => {
    e.stopPropagation();
    removeInterest(topic);
    if (activeFilter === topic) setActiveFilter("For You");
  };

  return (
    <div className="flex items-center w-full gap-3 py-1 relative z-20">

      {/* LEFT: HORIZONTAL PINNED TABS */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button onClick={() => setActiveFilter("For You")} className={`px-4 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${activeFilter === "For You" ? "bg-stone-900 text-white border-stone-900 shadow-sm" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}>
          For You
        </button>

        <button onClick={() => setActiveFilter("Trending")} className={`px-4 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${activeFilter === "Trending" ? "bg-stone-900 text-white border-stone-900 shadow-sm" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}>
          Trending
        </button>

        {followedCards.length > 0 && (
          <button onClick={() => setActiveFilter("Following")} className={`px-4 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${activeFilter === "Following" ? "bg-stone-900 text-white border-stone-900 shadow-sm" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}>
            Following
          </button>
        )}

        {myCards.length > 0 && (
          <button onClick={() => setActiveFilter("My Cards")} className={`px-4 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${activeFilter === "My Cards" ? "bg-stone-900 text-white border-stone-900 shadow-sm" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}>
            My Cards
          </button>
        )}

        {myInterests.map((topic) => {
          const isActive = activeFilter === topic;
          return (
            <button key={topic} onClick={() => setActiveFilter(topic)} className={`flex items-center gap-1.5 pl-4 pr-1.5 py-1 rounded-full text-[11px] font-medium border shrink-0 transition-all group ${isActive ? "bg-stone-900 text-white border-stone-900 shadow-sm" : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"}`}>
              <span className="mb-[1px]">{topic}</span>
              <div onClick={(e) => handleRemovePinned(e, topic)} className={`p-1 rounded-full transition-colors ${isActive ? "hover:bg-white/20 text-white" : "hover:bg-stone-100 text-stone-400"}`}>
                <X size={12} strokeWidth={3} />
              </div>
            </button>
          )
        })}
      </div>

      {/* RIGHT: DROPDOWN TRIGGER */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className={`shrink-0 flex items-center gap-2 px-3 py-1.5 border rounded-full font-medium transition-all shadow-sm ${isModalOpen ? "bg-stone-900 text-white border-stone-900" : "bg-gradient-to-tr from-amber-50 to-orange-50 border-amber-200 text-amber-500 hover:shadow-md"}`}
        >
          <Sparkles size={14} />
          <span className="text-[11px] pr-1">Interests</span>
        </button>

        {/* Modularized Dropdown Container */}
        <GridContainer
          isOpen={isModalOpen}
          myInterests={myInterests}
          handleTopicSelect={handleTopicSelect}
        />
      </div>
    </div>
  );
}
