"use client";

import { Settings as SettingsIcon, Bell, Shield, HelpCircle, Languages } from "lucide-react";
import SettingsTopBar from "../settingstopbar/SettingsTopBar";
import Preferences from "./Preferences";
import Privacy from "./Privacy";
import Security from "./Security";
import HelpFeedback from "./HelpFeedback";
import { useProfileStore } from "@/store/profile/profile.store";
import { useSettingsStore } from "@/store/settings/settings.store";

export default function SettingsContent({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { profileData } = useProfileStore();
  const { language, twoFAEnabled } = useSettingsStore();

  const tabs = [
    { id: "preferences", label: "Preferences",     icon: SettingsIcon },
    { id: "privacy",     label: "Privacy",         icon: Bell         },
    { id: "security",    label: "Security",        icon: Shield       },
    { id: "help",        label: "Help & Feedback", icon: HelpCircle   },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "preferences": return <Preferences />;
      case "privacy":     return <Privacy />;
      case "security":    return <Security />;
      case "help":        return <HelpFeedback />;
      default:            return <Preferences />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex-1 flex gap-8 h-full min-h-0 pb-2">

      {/* ── Left sidebar ─────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 flex flex-col h-full gap-3">
        <SettingsTopBar />

        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                }`}
              >
                <tab.icon size={15} strokeWidth={1.8} />
                <span className="text-[13px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Live Profile Mini-Card ──────────────────────────────── */}
        <button
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 p-3 bg-white border border-stone-100 rounded-2xl hover:border-stone-300 transition-all active:scale-[0.98] text-left group shrink-0"
        >
          <div className="h-9 w-9 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
            <img src={profileData.avatarUrl} alt={profileData.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-stone-700 truncate leading-none">{profileData.name}</p>
            <p className="text-[10px] text-stone-400 truncate mt-0.5">@{profileData.username}</p>
          </div>
          {twoFAEnabled && (
            <Shield size={11} className="text-green-500 shrink-0" />
          )}
        </button>

        {/* Language badge */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl shrink-0">
          <Languages size={11} className="text-stone-400 shrink-0" />
          <span className="text-[11px] text-stone-400 truncate">{language}</span>
        </div>

      </aside>

      {/* ── Right pane ───────────────────────────────────────────── */}
      <section className="flex-1 bg-white border border-stone-200/60 rounded-[32px] shadow-sm flex flex-col overflow-hidden h-full transition-colors duration-200">
        <div className="flex-1 overflow-y-auto no-scrollbar p-7 lg:p-9">
          <div className="max-w-2xl w-full mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </div>
      </section>

    </div>
  );
}
