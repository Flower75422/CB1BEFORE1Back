"use client";

import { SquareUser, Layers, Users, LockKeyhole, SlidersHorizontal } from "lucide-react";

import ProfileForm from "./ProfileForm";
import ProfileFormtwo from "./ProfileFormtwo";
import PoolFormone from "./PoolFormone";
import PoolFormtwo from "./PoolFormtwo";
import MembersForm from "./MembersForm";
import PermissionsForm from "./PermissionsForm";
import PermissionsFormtwo from "./PermissionsFormtwo";
import Moreone from "./Moreone";
import Moretwo from "./Moretwo";

export default function CreateGroupContent({ step, setStep, formData, updateData, setIsSuccess, onClose }: any) {
  const steps = [
    { id: 1, label: "Profile", icon: SquareUser },
    { id: 2, label: "Pool",    icon: Layers },
    { id: 3, label: "Members", icon: Users },
    { id: 4, label: "Perms",   icon: LockKeyhole },
    { id: 5, label: "More",    icon: SlidersHorizontal },
  ];

  return (
    <div className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar select-auto overscroll-contain bg-white border border-stone-200/60 rounded-[32px] shadow-sm p-6 mb-6">
      <div className="flex w-full h-full bg-white border border-stone-200/60 rounded-3xl shadow-sm overflow-hidden">
        
        {/* MINI SIDEBAR (Width locked at 72px) */}
        <div className="w-[72px] flex-shrink-0 border-r border-stone-100 bg-stone-50/50 flex flex-col items-center justify-center gap-1.5">
          {steps.map((s) => {
            const isActive = step === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`w-[56px] py-2 flex flex-col items-center gap-1.5 rounded-xl transition-all duration-200 ${
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

        {/* RIGHT PANE: Ultra Compact Forms (Size locked and untouched) */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            <div className="max-w-2xl w-full h-full mx-auto">
              
              {step === 1 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                  <ProfileForm data={formData} update={updateData} />
                  <div className="border-t border-stone-100 pt-4">
                    <ProfileFormtwo data={formData} update={updateData} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                  <PoolFormtwo data={formData} update={updateData} />
                  <div className="border-t border-stone-100 pt-4">
                    <PoolFormone data={formData} update={updateData} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                  <MembersForm data={formData} update={updateData} />
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                  <PermissionsForm data={formData} update={updateData} />
                  <div className="border-t border-stone-100 pt-4">
                    <PermissionsFormtwo data={formData} update={updateData} />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-200">
                  <Moreone data={formData} update={updateData} setIsSuccess={setIsSuccess} />
                  <div className="border-t border-stone-100 pt-4">
                    <Moretwo data={formData} update={updateData} onClose={onClose} />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}