"use client";

import { ArrowLeft, Share2, MapPin, MessageSquare, UserPlus } from "lucide-react";
import UniversalStatItem from "./UniversalStatItem";

interface HeaderProps {
  user: any;
  onBack: () => void;
  isFollowing: boolean;
  setIsFollowing: (val: boolean) => void;
}

export default function UniversalProfileHeader({ user, onBack, isFollowing, setIsFollowing }: HeaderProps) {
  return (
    <>
      <div className="mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-black font-bold text-[13px] transition-colors group px-2 py-1 -ml-2 rounded-lg hover:bg-stone-100/50"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Search
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-8 -ml-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8 relative border border-stone-200/60 transition-all duration-300">
        <div className="w-full -mt-6 -ml-2 flex gap-6 items-start mb-10 relative z-10">
          
          <div className="pt-5 shrink-0">
            <div className="h-20 w-20 rounded-full bg-stone-200 border-[3px] border-white shadow-sm overflow-hidden flex items-center justify-center text-2xl font-black text-stone-400">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-5">
              <div className="flex flex-col pt-5">
                <h2 className="text-xl font-bold text-[#1c1917] tracking-tight leading-none">
                  {user?.name || "Unknown User"}
                </h2>
                <span className="text-[13px] font-bold text-stone-400 mt-2.5 leading-none">
                  {user?.handle || "@user"}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button className="flex items-center gap-2 px-4 py-2 border border-stone-200/60 text-stone-500 text-[11px] font-bold rounded-xl hover:bg-white hover:text-[#1c1917] transition-all active:scale-95 shadow-sm">
                  <Share2 size={14} /> Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F4] text-[#1c1917] text-[11px] font-bold rounded-xl hover:bg-stone-200 transition-all active:scale-95 shadow-sm border border-transparent">
                  <MessageSquare size={14} /> Message
                </button>
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-5 py-2 text-[11px] font-bold rounded-xl transition-all active:scale-95 shadow-sm border ${
                    isFollowing ? "bg-white border-stone-200/60 text-stone-500" : "bg-[#1c1917] border-[#1c1917] text-white"
                  }`}
                >
                  <UserPlus size={14} /> {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>

            <div className="flex gap-8 text-[13px]">
              <UniversalStatItem value="12.4k" label="Followers" />
              <UniversalStatItem value="842" label="Following" />
              <UniversalStatItem value="1.2m" label="Views" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-stone-400">
            <MapPin size={14} />
            <span className="text-[12px] font-bold tracking-tight">San Francisco, USA</span>
          </div>
          <p className="text-[14px] text-[#1c1917] leading-relaxed font-medium max-w-2xl">
            Digital creator and product builder. Currently exploring the intersection of design and emerging technology.
          </p>
          <div className="pt-2 border-t border-stone-50">
            <p className="text-[12px] text-stone-500 leading-relaxed italic">
              <span className="font-bold not-italic text-stone-400 mr-1">Latest:</span>
              Updated design system components for Web3 Alpha.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}