"use client";
import { Plus } from "lucide-react";

export default function CreateButton() {
  return (
    <button className="group relative outline-none">
      {/* 1. OUTER GRADIENT RING: 
          - p-[1.5px] creates the thin metallic border
      */}
      <div className="rounded-full p-[1.5px] bg-gradient-to-tr from-stone-200 via-stone-400 to-stone-200 shadow-sm active:scale-95 transition-transform">
        
        {/* 2. INNER MASK: 
            - bg-[#FDFBF7] blends with page 
            - w-9 h-9 forces a PERFECT ROUND SHAPE (matches Settings/Profile button)
            - justify-center centers the content
        */}
        <div className="bg-[#FDFBF7] w-9 h-9 rounded-full group-hover:bg-stone-50 transition-colors flex items-center justify-center gap-0.5">
          
          {/* The Plus Icon: 
              - size={11}: Very small
              - strokeWidth={3.5}: Extra thick to stay visible at small size
          */}
          <Plus 
            size={11} 
            className="text-[#1c1917] stroke-[3.5px] group-hover:rotate-90 transition-transform duration-300" 
          />
          
          {/* The 'C' Letter */}
          <span className="text-[#1c1917] font-bold text-[15px] leading-none pt-0.5">
            C
          </span>
        </div>
      </div>
    </button>
  );
}