"use client";

import { UserCircle, ShieldCheck, Settings as SettingsIcon, Key, Bell } from "lucide-react";
import SettingsTopBar from "../settingstopbar/SettingsTopBar";
import Profile from "./Profile";
import Account from "./Account";
import Preferences from "./Preferences";
import Privacy from "./Privacy";
import Security from "./Security";

export default function SettingsContent({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  
  const tabs = [
    { id: "profile", label: "Public Profile", icon: UserCircle },
    { id: "account", label: "Account Details", icon: ShieldCheck },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
    { id: "privacy", label: "Privacy", icon: Key },
    { id: "security", label: "Security", icon: Bell }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <Profile />;
      case "account": return <Account />;
      case "preferences": return <Preferences />;
      case "privacy": return <Privacy />;
      case "security": return <Security />;
      default: return <Profile />;
    }
  };

  return (
    // 🔴 THE FIX: 'h-full flex-1 min-h-0' makes it perfectly fill the frozen space
    <div className="w-full max-w-7xl mx-auto flex-1 flex gap-8 h-full min-h-0 pb-2">
        
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-64 flex-shrink-0 flex flex-col h-full">
        
        <SettingsTopBar />

        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left ${
                  isActive 
                    ? "bg-[#1c1917] text-white shadow-md shadow-stone-200/50" 
                    : "text-stone-500 hover:bg-stone-100 hover:text-[#1c1917]"
                }`}
              >
                <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[13px] font-bold tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* --- RIGHT PANE: Massive White Canvas --- */}
      {/* 🔴 THE FIX: Make the wrapper a flex column with hidden overflow */}
      <section className="flex-1 bg-white border border-stone-200/60 rounded-[32px] shadow-sm flex flex-col overflow-hidden h-full">
        
        {/* 🔴 THE FIX: Only this specific inner div is allowed to scroll vertically */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-10 lg:p-14">
          <div className="max-w-3xl w-full mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </div>

      </section>

    </div>
  );
}