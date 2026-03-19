"use client";

import { LayoutGrid, MessageSquare } from "lucide-react";

interface EmptyStateProps {
  type: "channel" | "group";
  name: string;
}

export default function UniversalEmptyCommunityState({ type, name }: EmptyStateProps) {
  return (
    <div className="w-full py-20 px-6 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[40px] bg-stone-50/50 group transition-all hover:border-stone-300">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 relative z-10">
          {type === "channel" ? <LayoutGrid className="text-stone-400" size={28} /> : <MessageSquare className="text-stone-400" size={28} />}
        </div>
      </div>
      <h3 className="text-[15px] font-bold text-[#1c1917] mb-1">
        No Public {type === "channel" ? "Channels" : "Groups"}
      </h3>
      <p className="text-[12px] text-stone-400 font-medium mb-8 max-w-[220px] text-center leading-relaxed">
        {name || "This user"} hasn't created any public {type === "channel" ? "channels" : "groups"} yet.
      </p>
    </div>
  );
}