"use client";
import { MessageSquare, TrendingUp, MoveUpRight } from "lucide-react";

interface GroupBodyProps {
  desc: string;
  lastActiveDays?: number;
  activity: string;
}

export default function GroupBody({ desc, lastActiveDays, activity }: GroupBodyProps) {
  const isTrending      = lastActiveDays !== undefined && lastActiveDays <= 2;
  const isActiveRecently = lastActiveDays !== undefined && lastActiveDays >= 3 && lastActiveDays <= 6;

  return (
    <div className="flex flex-col gap-2 py-1">

      {/* Activity row + inline trend/active icon */}
      <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold">
        <MessageSquare size={12} className="shrink-0" />
        <span>{activity}</span>
        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse shrink-0" />
        {isTrending && (
          <TrendingUp size={11} className="text-amber-500 shrink-0 ml-0.5" />
        )}
        {isActiveRecently && !isTrending && (
          <MoveUpRight size={11} className="text-stone-400 shrink-0 ml-0.5" />
        )}
      </div>

      <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-3 px-0.5 min-h-[54px]">
        {desc}
      </p>

    </div>
  );
}
