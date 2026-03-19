"use client";

import { SquareUser, Layers, Users, LockKeyhole, SlidersHorizontal } from "lucide-react";

import ProfileForm from "./ProfileForm";
import ProfileFormtwo from "./ProfileFormtwo";
import PoolFormone from "./PoolFormone";
import PoolFormtwo from "./PoolFormtwo";
import TeamFormone from "./TeamFormone";
import TeamFormtwo from "./TeamFormtwo";
import PermissionsForm from "./PermissionsForm";
import PermissionsFormtwo from "./PermissionsFormtwo";
import Moreone from "./Moreone";
import Moretwo from "./Moretwo";

export default function CreateChannelContent({ step, setStep, formData, updateData, setIsSuccess, onClose }: any) {
  const steps = [
    { id: 1, label: "Profile", icon: SquareUser },
    { id: 2, label: "Pool", icon: Layers },
    { id: 3, label: "Team", icon: Users },
    { id: 4, label: "Perms", icon: LockKeyhole },
    { id: 5, label: "More", icon: SlidersHorizontal }
  ];

  return (
    <div className="w-full pb-10">
      
      {/* OUTER BOX: The thick white frame. */}
      <div className="w-full bg-white p-4 sm:p-5 rounded-[32px] border border-stone-200/60 shadow-sm">
        
        {/* 🔴 INNER BOX FIX: Replaced h-[380px] with h-fit.
            Now the box mathematically shrink-wraps the sidebar. No forced empty space! */}
        <div className="flex w-full h-fit bg-white border border-stone-200/60 rounded-[24px] shadow-sm overflow-hidden relative">
          
          {/* 🔴 THE SIDEBAR FIX: Using py-6 guarantees the gap at the top is exactly equal to the gap at the bottom. */}
          <div className="w-[84px] shrink-0 border-r border-stone-100 bg-stone-50/50 flex flex-col items-center py-6 gap-2.5 z-10">
            {steps.map((s) => {
              const isActive = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`w-[68px] py-2.5 flex flex-col items-center gap-1.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-black text-white shadow-md scale-105" 
                      : "text-stone-400 hover:bg-stone-200/50 hover:text-[#1c1917]"
                  }`}
                >
                  <s.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[9px] font-black uppercase tracking-tighter leading-none">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* THE CONTENT AREA: Still uses absolute positioning so it scrolls flawlessly inside the new exact height. */}
          <div className="flex-1 relative bg-white">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar p-6">
              <div className="max-w-3xl w-full mx-auto pb-6">
                
                {/* STEP 1: PROFILE */}
                {step === 1 && (
                  <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                    <ProfileForm data={formData} update={updateData} />
                    <div className="border-t border-stone-100 pt-5">
                      <ProfileFormtwo data={formData} update={updateData} />
                    </div>
                  </div>
                )}

                {/* STEP 2: POOL */}
                {step === 2 && (
                  <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                    <PoolFormtwo data={formData} update={updateData} />
                    <div className="border-t border-stone-100 pt-5">
                      <PoolFormone data={formData} update={updateData} />
                    </div>
                  </div>
                )}

                {/* STEP 3: TEAM */}
                {step === 3 && (
                  <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                    <TeamFormone data={formData} update={updateData} />
                    <div className="border-t border-stone-100 pt-5">
                      <TeamFormtwo data={formData} update={updateData} />
                    </div>
                  </div>
                )}

                {/* STEP 4: PERMISSIONS */}
                {step === 4 && (
                  <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                    <PermissionsForm data={formData} update={updateData} />
                    <div className="border-t border-stone-100 pt-5">
                      <PermissionsFormtwo data={formData} update={updateData} />
                    </div>
                  </div>
                )}

                {/* STEP 5: MORE */}
                {step === 5 && (
                  <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                    <Moreone data={formData} update={updateData} setIsSuccess={setIsSuccess} />
                    <div className="border-t border-stone-100 pt-5">
                      <Moretwo data={formData} update={updateData} onClose={onClose} />
                    </div>
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