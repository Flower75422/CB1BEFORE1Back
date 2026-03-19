"use client";
import { X } from "lucide-react";
import GridLayout from "./GridLayout";

export default function GridContainer({ isOpen, onClose, selectedInterests, toggleInterest }: any) {
  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    /* 🔴 Removed the 'absolute' positioning from here and moved it to the parent wrapper in TopicPool 
       to ensure the click detection doesn't fail */
    <div className="absolute right-0 top-full mt-2 z-[500] animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-[340px] h-[280px] bg-white border-[3px] border-black shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-black text-white shrink-0 relative z-10">
          <span className="text-[9px] font-black uppercase tracking-widest">Interest Pool</span>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevents conflict with the TopicPool toggle
              onClose();
            }} 
            className="hover:scale-110 active:scale-90 transition-all"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        {/* The Grid Content */}
        <div className="flex-1 overflow-hidden relative">
          <GridLayout 
            selectedInterests={selectedInterests} 
            toggleInterest={toggleInterest} 
          />
        </div>
      </div>
    </div>
  );
}