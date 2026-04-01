"use client";
import { Users, TrendingUp, Sparkles, Star } from "lucide-react";

interface ChannelBodyProps {
  desc: string;
  trending?: boolean;
  isFeatured?: boolean;
  youMightLike?: boolean;
  monthlyActiveViewers?: number;
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
};

export default function ChannelBody({
  desc,
  trending,
  isFeatured,
  youMightLike,
  monthlyActiveViewers = 0,
}: ChannelBodyProps) {
  return (
    <div className="flex flex-col gap-2 py-1">

      {/* Stats row — Featured badge OR monthly active viewers with optional icons */}
      {isFeatured ? (
        /* Featured replaces the MAV line entirely */
        <div className="flex items-center gap-1.5">
          <Star size={11} className="text-amber-500 shrink-0 fill-amber-400" />
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            Featured
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <Users size={11} className="text-stone-400 shrink-0" />
          <span className="text-[10px] font-semibold text-stone-400">
            {fmt(monthlyActiveViewers)}
          </span>
          <span className="text-[9px] font-medium text-stone-300 uppercase tracking-wide">
            monthly active
          </span>

          {/* Trending icon — amber TrendingUp */}
          {trending && (
            <span title="Trending">
              <TrendingUp
                size={11}
                className="text-amber-500 shrink-0 ml-0.5"
              />
            </span>
          )}

          {/* You might like icon — purple Sparkles */}
          {youMightLike && !trending && (
            <span title="You might like">
              <Sparkles
                size={11}
                className="text-purple-400 shrink-0 ml-0.5"
              />
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-[11px] text-stone-500 leading-relaxed line-clamp-3 break-words px-0.5 min-h-[54px]">
        {desc || <span className="text-stone-300 italic">No description added.</span>}
      </p>
    </div>
  );
}
