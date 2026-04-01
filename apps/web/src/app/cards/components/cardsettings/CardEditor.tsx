"use client";

import { useState, useEffect } from "react";
import { SquareUser, Layers, Link2, LockKeyhole, Users, ScrollText } from "lucide-react";

import ProfileFormone from "./ProfileFormone";
import ProfileFormtwo from "./ProfileFormtwo";
import TeamFormone from "./TeamFormone";
import TeamFormtwo from "./TeamFormtwo";
import PoolFormone from "./PoolFormone";
import PoolFormtwo from "./PoolFormtwo";
import LinksFormone from "./LinksFormone";
import LinksFormtwo from "./LinksFormtwo";
import PermissionsFormone from "./PermissionsFormone";
import PermissionsFormtwo from "./PermissionsFormtwo";
import WallPostsStep from "./WallPostsStep";

export default function CardEditor({ user, card, updateCard, onDelete }: any) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(1);
  }, [card?.id]);

  const steps = [
    { id: 1, label: "Profile", icon: SquareUser },
    { id: 2, label: "Team",    icon: Users },
    { id: 3, label: "Pool",    icon: Layers },
    { id: 4, label: "Links",   icon: Link2 },
    { id: 5, label: "Perms",   icon: LockKeyhole },
    { id: 6, label: "Wall",    icon: ScrollText },
  ];

  return (
    <div className="w-full">

      <div className="w-full bg-white p-3 sm:p-4 rounded-[32px] border border-stone-200/60 shadow-sm">

        <div className="flex w-full h-[330px] bg-white border border-stone-200/60 rounded-[24px] shadow-sm overflow-hidden relative">

          {/* Sidebar — 6 steps fit cleanly at gap-1.5 */}
          <div className="w-[76px] shrink-0 border-r border-stone-100 bg-stone-50/50 flex flex-col items-center justify-center gap-1.5 z-10">
            {steps.map((s) => {
              const isActive = step === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`w-[60px] py-2 flex flex-col items-center gap-1 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white shadow-md scale-105"
                      : "text-stone-400 hover:bg-stone-200/50 hover:text-[#1c1917]"
                  }`}
                >
                  <s.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[8px] font-black uppercase tracking-wider leading-none">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content area */}
          <div className="flex-1 relative bg-white">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar p-4">
              <div className="max-w-3xl w-full mx-auto pb-2">

                {/* Step 1 — Profile */}
                {step === 1 && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
                    <ProfileFormone card={card} updateCard={updateCard} user={user} />
                    <div className="border-t border-stone-100 pt-3">
                      <ProfileFormtwo card={card} updateCard={updateCard} />
                    </div>
                  </div>
                )}

                {/* Step 2 — Team */}
                {step === 2 && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
                    <TeamFormone card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-3">
                      <TeamFormtwo card={card} updateCard={updateCard} />
                    </div>
                  </div>
                )}

                {/* Step 3 — Pool */}
                {step === 3 && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
                    <PoolFormtwo card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-3">
                      <PoolFormone card={card} updateCard={updateCard} />
                    </div>
                  </div>
                )}

                {/* Step 4 — Links */}
                {step === 4 && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
                    <LinksFormone card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-3">
                      <LinksFormtwo card={card} updateCard={updateCard} />
                    </div>
                  </div>
                )}

                {/* Step 5 — Permissions */}
                {step === 5 && (
                  <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-200">
                    <PermissionsFormone card={card} updateCard={updateCard} />
                    <div className="border-t border-stone-100 pt-3">
                      <PermissionsFormtwo card={card} updateCard={updateCard} />
                    </div>
                  </div>
                )}

                {/* Step 6 — Wall Posts + Delete */}
                {step === 6 && (
                  <WallPostsStep card={card} updateCard={updateCard} onDelete={onDelete} />
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
