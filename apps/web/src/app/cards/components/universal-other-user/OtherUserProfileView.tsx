"use client";

import { useState } from "react";
import UniversalProfileHeader from "./UniversalProfileHeader";
import UniversalOtherUserWallposts from "./UniversalOtherUserWallposts";
import UniversalEmptyCommunityState from "./UniversalEmptyCommunityState";

interface OtherUserProfileProps {
  user: any;
  onBack: () => void;
}

type Tab = "Wallposts" | "Channels" | "Groups";

export default function OtherUserProfileView({ user, onBack }: OtherUserProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Wallposts");
  const [isFollowing, setIsFollowing] = useState(false);
  
  const tabs: Tab[] = ["Wallposts", "Channels", "Groups"];

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      
      {/* 1. Header (Includes Back Button, Stats, and Bio) */}
      <UniversalProfileHeader 
        user={user} 
        onBack={onBack} 
        isFollowing={isFollowing} 
        setIsFollowing={setIsFollowing} 
      />

      {/* 2. Tabs and Body */}
      <div className="w-full">
        <div className="mb-8 border-b border-stone-200/60 -ml-4">
          <div className="flex gap-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 transition-all text-[15px] font-bold tracking-tight ${
                  activeTab === tab ? "text-[#1c1917]" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2.5px] bg-[#1c1917] rounded-full z-10" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Router */}
        <div className="min-h-[400px]">
          {activeTab === "Wallposts" && <UniversalOtherUserWallposts />}
          {activeTab === "Channels" && <UniversalEmptyCommunityState type="channel" name={user?.name} />}
          {activeTab === "Groups" && <UniversalEmptyCommunityState type="group" name={user?.name} />}
        </div>
      </div>

    </div>
  );
}