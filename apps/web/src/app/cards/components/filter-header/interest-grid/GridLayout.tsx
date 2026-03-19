"use client";
import { Check } from "lucide-react";
import { ALL_INTERESTS_600 } from "./GridData";

export default function GridLayout({ selectedInterests, toggleInterest }: any) {
  const itemsPerUnit = 24; 
  const units = [];
  
  for (let i = 0; i < ALL_INTERESTS_600.length; i += itemsPerUnit) {
    units.push(ALL_INTERESTS_600.slice(i, i + itemsPerUnit));
  }

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth bg-white p-2">
      <div className="flex flex-col gap-5 pb-10">
        {units.map((unitItems, uIdx) => (
          <div key={uIdx} className="flex flex-col gap-3">
            
            {/* 🔴 MASONRY FLOW: Uses flex-grow to fill all empty space */}
            <div className="flex flex-wrap gap-1 items-stretch">
              {unitItems.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    // // flex-grow: 1 makes short words stretch to fill gaps
                    // // min-width: calculated so words don't get too squished
                    className={`
                      flex-grow flex items-center justify-center gap-1
                      px-2 py-1 text-[8px] font-black uppercase border border-black 
                      transition-all duration-75 active:scale-95 min-w-[40px]
                      ${isSelected ? "bg-black text-white" : "bg-white text-black hover:bg-stone-100"}
                    `}
                    style={{ 
                      // // Subtle logic: longer words get more "weight" in the row
                      flexBasis: `${interest.length * 6}px` 
                    }}
                  >
                    {interest}
                    {isSelected && <Check size={7} strokeWidth={4} />}
                  </button>
                );
              })}
            </div>

            {/* UNIT SEPARATOR */}
            {uIdx !== units.length - 1 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="h-[1.5px] flex-1 bg-black" />
                <span className="text-[8px] font-black text-black">UNTI {uIdx + 1}</span>
                <div className="h-[1.5px] w-6 bg-black" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}