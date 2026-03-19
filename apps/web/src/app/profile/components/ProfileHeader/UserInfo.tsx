"use client";
import Link from "next/link";
import { Share2, Settings } from "lucide-react";

interface UserInfoProps {
  name: string;
  username: string;
  followers: string | number;
  following: string | number;
  views: string | number;
}

export default function UserInfo({ name, username, followers, following, views }: UserInfoProps) {
  return (
    // 1. POSITIONING: -mt-6 pulls block up. 
    // 2. Added '-ml-2' to move the entire identity block slightly to the left.
    <div className="w-full -mt-6 -ml-2 flex gap-6 items-start mb-10 relative z-10">
      
      {/* --- AVATAR: Moved down using 'pt-5' to align with the name --- */}
      <div className="pt-5 shrink-0">
        <div className="h-20 w-20 rounded-full bg-stone-200 border border-stone-200/60 shadow-sm overflow-hidden" />
      </div>
      
      <div className="flex-1">
        
        {/* --- IDENTITY & ACTIONS ROW --- */}
        <div className="flex items-start justify-between mb-5">
          
          {/* Identity: Aligned with Avatar via pt-5 */}
          <div className="flex flex-col pt-5">
            <h2 className="text-xl font-bold text-[#1c1917] tracking-tight leading-none">
              {name}
            </h2>
            <span className="text-[13px] font-bold text-stone-400 mt-2.5 leading-none">
              @{username}
            </span>
          </div>

          {/* ACTIONS: Stay at the very top (pt-1) */}
          <div className="flex items-center gap-3 pt-1">
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-200/60 text-stone-500 text-[11px] font-bold rounded-xl hover:bg-white hover:text-[#1c1917] transition-all active:scale-95 shadow-sm">
              <Share2 size={14} />
              Share
            </button>

            <Link href="/settings" className="group relative outline-none">
              <div className="rounded-full p-[1.5px] bg-gradient-to-tr from-stone-200 via-stone-400 to-stone-200 shadow-sm active:scale-95 transition-transform">
                <div className="bg-[#FDFBF7] w-9 h-9 rounded-full group-hover:bg-stone-50 transition-colors flex items-center justify-center">
                  <Settings 
                    size={18} 
                    className="text-[#1c1917] opacity-80 group-hover:opacity-100 group-hover:rotate-45 transition-transform duration-500" 
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* --- STATS AREA --- */}
        <div className="flex gap-8 text-[13px]">
          <StatItem value={followers} label="Followers" />
          <StatItem value={following} label="Following" />
          <StatItem value={views} label="Views" />
        </div>

      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-bold text-[#1c1917] text-base leading-none">
        {value}
      </span> 
      <span className="text-stone-400 font-bold text-[10px] uppercase tracking-widest mt-1.5">
        {label}
      </span>
    </div>
  );
}