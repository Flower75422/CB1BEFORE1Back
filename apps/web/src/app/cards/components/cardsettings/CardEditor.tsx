"use client";

import { useState } from "react";
import { SquareUser, Layers, Users, LockKeyhole, SlidersHorizontal } from "lucide-react";

import ProfileFormone from "./ProfileFormone";
import ProfileFormtwo from "./ProfileFormtwo";
import PoolFormone from "./PoolFormone";
import PoolFormtwo from "./PoolFormtwo";
import TeamFormone from "./TeamFormone";
import TeamFormtwo from "./TeamFormtwo";
import PermissionsFormone from "./PermissionsFormone";
import PermissionsFormtwo from "./PermissionsFormtwo";
import MoreFormone from "./MoreFormone";
import MoreFormtwo from "./MoreFormtwo";

export default function CardEditor({ user, card, updateCard, onDelete }: any) {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: "Profile", icon: SquareUser },
    { id: 2, label: "Pool", icon: Layers },
    { id: 3, label: "Team", icon: Users },
    { id: 4, label: "Perms", icon: LockKeyhole },
    { id: 5, label: "More", icon: SlidersHorizontal }
  ];

  return (
    // 🔴 Removed bottom margins to save screen space
    <div className="w-full">
      
      {/* OUTER BOX: Thinner padding (p-3 sm:p-4) to save vertical space on your laptop screen */}
      <div className="w-full bg-white p-3 sm:p-4 rounded-[32px] border border-stone-200/60 shadow-sm">
        
        {/* 🔴 INNER BOX: Hard-locked to h-[330px]. 
            This forces it to be short enough to fit entirely on your screen! */}
        <div className="flex w-full h-[330px] bg-white border border-stone-200/60 rounded-[24px] shadow-sm overflow-hidden relative">
          
          {/* 🔴 THE SIDEBAR: Made narrower (76px) and uses `justify-center`. 
              justify-center GUARANTEES the top gap and bottom gap are mathematically exactly the same! */}
          <div className="w-[76px] shrink-0 border-r border-stone-100 bg-stone-50/50 flex flex-col items-center justify-center gap-1.5 z-10">
            {steps.map((s) => {
              const isActive = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  // 🔴 Smaller buttons (60px), smaller padding (py-2) to fit the new shorter height
                  className={`w-[60px] py-2 flex flex-col items-center gap-1 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-black text-white shadow-md scale-105" 
                      : "text-stone-400 hover:bg-stone-200/50 hover:text-[#1c1917]"
                  }`}
                >
                  {/* 🔴 Smaller icons (16) and smaller text (8px) */}
                  <s.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[8px] font-black uppercase tracking-wider leading-none">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* THE CONTENT AREA: Still uses absolute positioning to scroll inside the new 330px height */}
          <div className="flex-1 relative bg-white">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar p-5">
              <div className="max-w-3xl w-full mx-auto pb-6">
                
                {step === 1 && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <ProfileFormone card={card} updateCard={updateCard} user={user} />
                    <div className="border-t border-stone-100 pt-4"><ProfileFormtwo card={card} updateCard={updateCard} /></div>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <PoolFormtwo card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-4"><PoolFormone card={card} updateCard={updateCard} /></div>
                  </div>
                )}
                {step === 3 && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <TeamFormone card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-4"><TeamFormtwo card={card} updateCard={updateCard} /></div>
                  </div>
                )}
                {step === 4 && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <PermissionsFormone card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-4"><PermissionsFormtwo card={card} updateCard={updateCard} /></div>
                  </div>
                )}
                {step === 5 && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
                    <MoreFormone card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-4"><MoreFormtwo card={card} updateCard={updateCard} onDelete={onDelete} /></div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}