"use client";

import { ArrowLeft } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export default function CreateGroupTopBar({ onClose }: { onClose: () => void }) {
  const { myGroups } = useCommunitiesStore();
  const count = myGroups.length;

  return (
    <div className="flex items-center justify-between mb-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-stone-200 transition text-[#1c1917] bg-white border border-stone-200 shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <h1 className="text-[19px] font-black text-[#1c1917] tracking-tight leading-none">
          Create Group
        </h1>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">
          My Groups
        </span>
        <div className="text-[13px] font-black text-[#1c1917] bg-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {count}
        </div>
      </div>
    </div>
  );
}
