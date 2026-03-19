"use client";

import Link from "next/link";
import { Repeat, User } from "lucide-react";

export default function BottomOfBackCard({ id, onFlipBack, allowFullProfile = true }: any) {
  return (
    <div className="w-full flex flex-col mt-auto pt-4 relative z-20">
      <div className="h-px bg-stone-200/50 w-full mb-3" />
      
      <div className="flex gap-2">
        {/* VIEW PROFILE LINK: Navigates to the actual profile page */}
        {allowFullProfile && (
          <Link 
            href={`/profile/${id || 'default'}`} // Replace 'default' with actual routing logic later
            onClick={(e) => e.stopPropagation()} // Prevent the card from flipping when clicking the link
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#1c1917] hover:bg-black text-white text-[12px] font-bold transition shadow-sm active:scale-95"
          >
            <User size={14} /> View
          </Link>
        )}
        
        {/* FLIP BUTTON */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onFlipBack) onFlipBack();
          }} 
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[12px] font-bold transition shadow-sm active:scale-95"
        >
          <Repeat size={14} /> Flip
        </button>
      </div>
    </div>
  );
}