"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import InterestModal from "./InterestModal";

// 🔴 Added Props Interface
interface TopicPoolProps {
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
}

export default function TopicPool({ activeTopic, setActiveTopic }: TopicPoolProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [myInterests, setMyInterests] = useState(["Following", "Technology", "Design", "Business"]);

  const toggleInterest = (interest: string) => {
    setMyInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const getButtonStyle = (isActive: boolean) => 
    `px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border whitespace-nowrap ${
      isActive
        ? "bg-[#1c1917] text-white border-[#1c1917]" 
        : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
    }`;

  return (
    <div className="flex items-center w-full gap-3">
      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        
        <button 
          onClick={() => setActiveTopic("Feed")}
          className={getButtonStyle(activeTopic === "Feed")}
        >
          Feed
        </button>

        {myInterests.map((topic) => (
          <button 
            key={topic} 
            onClick={() => setActiveTopic(topic)} 
            className={getButtonStyle(activeTopic === topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-200 rounded-full text-amber-600 font-bold active:scale-95 transition-all"
      >
        <Sparkles size={14} />
        <span className="text-[11px]">Interests</span>
      </button>

      <InterestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedInterests={myInterests}
        toggleInterest={toggleInterest}
      />
    </div>
  );
}