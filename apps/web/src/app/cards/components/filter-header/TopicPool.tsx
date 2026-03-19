"use client";
import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import GridContainer from "./interest-grid/GridContainer"; 

export default function TopicPool({ activeFilter, onFilterChange }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myInterests, setMyInterests] = useState(["Following", "Trending", "Technology", "Design"]);
  
  // 1. Ref to track the whole component (button + menu)
  const menuRef = useRef<HTMLDivElement>(null);

  // 2. Click Outside Logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If the click is NOT inside our menuRef, close the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const toggleInterest = (interest: string) => {
    setMyInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  return (
    <div className="flex items-center w-full gap-3 py-1">
      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        
        {/* Core Filter: For You */}
        <button 
          onClick={() => onFilterChange("For You")}
          className={`px-4 py-1.5 rounded-full text-[11px] font-bold border shrink-0 ${
            activeFilter === "For You" ? "bg-black text-white border-black" : "bg-white border-stone-200 text-stone-500"
          }`}
        >
          For You
        </button>

        {/* 🔴 Core Filter: My Cards */}
        <button 
          onClick={() => onFilterChange("My Cards")}
          className={`px-4 py-1.5 rounded-full text-[11px] font-bold border shrink-0 ${
            activeFilter === "My Cards" ? "bg-black text-white border-black" : "bg-white border-stone-200 text-stone-500"
          }`}
        >
          My Cards
        </button>

        {/* Dynamic Interest Filters */}
        {myInterests.map((topic) => (
          <button 
            key={topic} 
            onClick={() => onFilterChange(topic)} 
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold border shrink-0 ${
              activeFilter === topic ? "bg-black text-white border-black" : "bg-white border-stone-200 text-stone-500"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* 3. Wrap button and container in the Ref div */}
      <div className="relative shrink-0" ref={menuRef}>
        <button 
          // 4. Toggle behavior (Click same icon to close)
          onClick={() => setIsModalOpen(!isModalOpen)}
          className={`shrink-0 flex items-center gap-2 px-3 py-1.5 border rounded-full font-bold transition-all shadow-sm ${
            isModalOpen 
            ? "bg-black text-white border-black" 
            : "bg-gradient-to-tr from-amber-50 to-orange-50 border-amber-200 text-amber-600"
          }`}
        >
          <Sparkles size={14} />
          <span className="text-[11px]">Interests</span>
        </button>

        <GridContainer 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          selectedInterests={myInterests}
          toggleInterest={toggleInterest}
        />
      </div>
    </div>
  );
}