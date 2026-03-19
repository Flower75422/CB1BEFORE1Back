"use client";
import { useState } from "react";
import WallpostsGrid from "./wallposts/WallpostsGrid";
import ControllerChannel from "./channels/controllerchannel";
import ControllerGroup from "./groups/controllergroup";

type Tab = "Wallposts" | "Channels" | "Groups";

export default function ProfileBody() {
  const [activeTab, setActiveTab] = useState<Tab>("Wallposts");
  const tabs: Tab[] = ["Wallposts", "Channels", "Groups"];

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="mb-8 border-b border-stone-200/60 -ml-4">
        <div className="flex gap-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 transition-all text-[15px] font-bold tracking-tight ${
                activeTab === tab 
                  ? "text-[#1c1917]" 
                  : "text-stone-400 hover:text-stone-600"
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

      {/* Dynamic Content Display */}
      <div className="min-h-[400px]">
        {activeTab === "Wallposts" && <WallpostsGrid />}
        {activeTab === "Channels" && <ControllerChannel />}
        {activeTab === "Groups" && <ControllerGroup />}
      </div>
    </div>
  );
}