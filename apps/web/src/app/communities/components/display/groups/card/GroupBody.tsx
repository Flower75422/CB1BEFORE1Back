"use client";
import { MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";

interface GroupBodyProps {
  desc: string;
  isPrivate?: boolean;
  activity: string;
}

export default function GroupBody({ desc, isPrivate, activity }: GroupBodyProps) {
  return (
    <div className="flex flex-col gap-2 py-1">
      {/* 1. Stats Row - Now above Bio */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold">
          <MessageSquare size={12} /> {activity}
        </div>
        {/* Visual indicator of activity level */}
        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
      </div>
      
      {/* 2. Bio/Description */}
      <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-2 px-0.5">
        {desc}
      </p>

      {/* 3. Privacy Badge underneath Bio */}
      <div className="mt-0.5">
        {isPrivate ? (
          <div className="flex items-center gap-1 w-fit bg-amber-50/60 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100/40">
            <ShieldCheck size={10} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Private Group</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 w-fit bg-green-50/60 text-green-600 px-2 py-0.5 rounded-md border border-green-100/40">
            <TrendingUp size={10} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Public Community</span>
          </div>
        )}
      </div>
    </div>
  );
}