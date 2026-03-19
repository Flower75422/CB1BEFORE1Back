"use client";
import { Radio, Users } from "lucide-react";

export default function TypeSelector({ onSelect, onClose }: { onSelect: (t: "channel" | "group") => void, onClose: () => void }) {
  return (
    // 1. COMPACT: Width reduced to w-64, padding to p-3, and rounded corners refined
    <div className="bg-white w-64 rounded-[20px] border border-stone-200/60 p-3 shadow-2xl ring-1 ring-black/5">
      
      {/* Header: More compact margins */}
      <div className="px-1.5 mb-2.5">
        <h2 className="text-[13px] font-bold tracking-tight text-[#1c1917]">
          Create New
        </h2>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
          Select Type
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {/* Option: Channel */}
        <button 
          onClick={() => onSelect("channel")}
          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-all text-left"
        >
          {/* Icon size and padding reduced */}
          <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-[#1c1917] group-hover:text-white transition-colors">
            <Radio size={14} />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-[12.5px] text-[#1c1917] leading-none">
              Channel
            </p>
            <p className="text-[10px] text-stone-400 font-medium mt-1 leading-none">
              Create Content
            </p>
          </div>
        </button>

        {/* Option: Group */}
        <button 
          onClick={() => onSelect("group")}
          className="group flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-all text-left"
        >
          <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-[#1c1917] group-hover:text-white transition-colors">
            <Users size={14} />
          </div>
          <div className="flex flex-col">
            <p className="font-bold text-[12.5px] text-[#1c1917] leading-none">
              Group
            </p>
            <p className="text-[10px] text-stone-400 font-medium mt-1 leading-none">
              Start Discussion
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}