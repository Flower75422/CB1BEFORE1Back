"use client";

import { Plus } from "lucide-react";

export default function ProfileForm({ data, update }: any) {
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[a-zA-Z0-9 ]*$/.test(val) && val.length <= 30) {
      update({ title: val });
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[a-zA-Z0-9_]*$/.test(val) && val.length <= 30) {
      update({ groupId: val });
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 150) {
      update({ description: val });
    }
  };

  return (
    // 🔴 Tighter overall spacing
    <div className="space-y-4">
      
      {/* 🔴 Reduced gap between image and inputs */}
      <div className="flex gap-4 items-start">
        
        {/* 🔴 Shrink image box to 112px (w-28 h-28) */}
        <div className="w-28 h-28 shrink-0 bg-[#F5F5F4] rounded-[20px] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center group hover:border-stone-400 transition-all cursor-pointer">
          <div className="p-2 bg-white rounded-full shadow-sm border border-stone-100 mb-1.5 group-hover:scale-110 transition-transform">
            <Plus className="text-stone-400" size={16} strokeWidth={2.5} />
          </div>
          <span className="text-stone-400 font-black text-[8px] uppercase tracking-widest text-center px-1">
            Cover
          </span>
        </div>

        {/* RIGHT: Name and ID Inputs */}
        <div className="flex-1 flex flex-col gap-3">
          
          <div className="space-y-1">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Group Name
            </label>
            <input 
              type="text"
              value={data.title || ""}
              onChange={handleNameChange}
              className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-[12px] text-[#1c1917] placeholder-stone-300 focus:outline-none focus:border-black transition-colors shadow-sm"
              placeholder="e.g. Nextjs Developers"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Group ID
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[12px] font-black text-stone-400">@</span>
              <input 
                type="text"
                value={data.groupId || ""}
                onChange={handleIdChange}
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-[12px] text-[#1c1917] placeholder-stone-300 focus:outline-none focus:border-black transition-colors shadow-sm"
                placeholder="nextjs_devs"
              />
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM: Bio */}
      <div className="space-y-1">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
            Group Bio
          </label>
          <span className="text-[8px] font-black text-stone-400 uppercase">
            {data.description?.length || 0} / 150
          </span>
        </div>
        <textarea
          value={data.description || ""}
          onChange={handleBioChange}
          placeholder="Describe the purpose..."
          // 🔴 Thinner text area (72px)
          className="w-full h-[72px] p-3 bg-white border border-stone-200 rounded-xl text-[12px] font-bold text-[#1c1917] focus:outline-none focus:border-black transition-all resize-none shadow-sm"
        />
      </div>

    </div>
  );
}