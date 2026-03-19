"use client";
import { Heart, Eye, FileText, TrendingUp } from "lucide-react";

interface ChannelBodyProps {
  desc: string;
  trending?: boolean;
}

export default function ChannelBody({ desc, trending }: ChannelBodyProps) {
  return (
    <div className="flex flex-col gap-2 py-1">
      {/* 1. Stats Row - Now above Bio */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold">
          <Heart size={12} className="text-rose-400/70" /> 1.8k
        </div>
        <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold">
          <Eye size={12} /> 1.2k
        </div>
        <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold">
          <FileText size={12} /> 5
        </div>
      </div>
      
      {/* 2. Bio/Description */}
      <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2 px-0.5">
        {desc}
      </p>

      {/* 3. Trending Badge */}
      {trending && (
        <div className="flex items-center gap-1 w-fit bg-amber-50/60 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100/40">
           <TrendingUp size={10} />
           <span className="text-[8px] font-black uppercase tracking-tighter">Trending Today</span>
        </div>
      )}
    </div>
  );
}