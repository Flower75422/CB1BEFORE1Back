"use client";

import { useState, useEffect } from "react";
import UniversalProfileHeader from "./UniversalProfileHeader";
import UniversalOtherUserWallposts from "./UniversalOtherUserWallposts";
import UniversalEmptyCommunityState from "./UniversalEmptyCommunityState";

interface OtherUserProfileProps {
  user: any;
  onBack: () => void;
}

type Tab = "Posts" | "Channels" | "Groups";

export default function OtherUserProfileView({ user, onBack }: OtherUserProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Posts");
  const tabs: Tab[] = ["Posts", "Channels", "Groups"];

  useEffect(() => {
    setActiveTab("Posts");
  }, [user?.handle, user?.name]);

  return (
    <div className="w-full animate-in fade-in duration-300">

      {/* Header — mirrors owner's ProfileHeader style exactly */}
      <UniversalProfileHeader user={user} onBack={onBack} />

      {/* Body — identical structure to ProfileBody */}
      <div className="w-full">

        {/* Tab bar — exact same markup as ProfileBody */}
        <div className="border-b border-stone-200/60 -ml-4">
          <div className="flex gap-8 px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 transition-all text-[14px] font-medium ${
                  activeTab === tab ? "text-stone-800" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-stone-800 rounded-full z-10" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content — same spacing as ProfileBody */}
        <div className="min-h-[400px] mt-6">
          {activeTab === "Posts"    && <UniversalOtherUserWallposts wallPosts={user?.wallPosts || []} />}
          {activeTab === "Channels" && <UniversalEmptyCommunityState type="channel" name={user?.name} />}
          {activeTab === "Groups"   && <UniversalEmptyCommunityState type="group"   name={user?.name} />}
        </div>

      </div>
    </div>
  );
}
