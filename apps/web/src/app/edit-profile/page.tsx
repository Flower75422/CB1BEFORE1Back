"use client";

import { useState, useEffect } from "react";
import { UserCircle, ShieldCheck, ArrowLeft, Shield, Languages } from "lucide-react";
import Link from "next/link";
import Profile from "@/app/settings/components/settingscontent/Profile";
import Account from "@/app/settings/components/settingscontent/Account";
import { useProfileStore } from "@/store/profile/profile.store";
import { useSettingsStore } from "@/store/settings/settings.store";

const tabs = [
  { id: "profile", label: "Public Profile",  icon: UserCircle  },
  { id: "account", label: "Account Details", icon: ShieldCheck },
];

export default function EditProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { profileData } = useProfileStore();
  const { twoFAEnabled, language } = useSettingsStore();

  // Same overflow fix as settings page
  useEffect(() => {
    const rootMain = document.querySelector("main");
    if (rootMain) {
      const original = rootMain.style.overflow;
      rootMain.style.overflow = "hidden";
      return () => { rootMain.style.overflow = original; };
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col text-[#1c1917]">
      <div className="w-full max-w-7xl mx-auto flex-1 flex gap-8 h-full min-h-0 pb-2">

        {/* ── Left sidebar ── */}
        <aside className="w-64 flex-shrink-0 flex flex-col h-full gap-3">

          {/* Top bar */}
          <div className="flex items-center gap-3 mb-8 px-1">
            <Link
              href="/profile"
              className="p-1.5 rounded-xl bg-white hover:bg-stone-100 transition text-stone-500 border border-stone-200 shadow-sm active:scale-95"
            >
              <ArrowLeft size={15} strokeWidth={2} />
            </Link>
            <h1 className="text-[16px] font-semibold text-stone-700 leading-none">Edit Profile</h1>
          </div>

          {/* Nav tabs */}
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

          {/* Profile mini-card */}
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
            {twoFAEnabled && <Shield size={11} className="text-green-500 shrink-0" />}
          </button>

          {/* Language badge */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-100 rounded-xl shrink-0">
            <Languages size={11} className="text-stone-400 shrink-0" />
            <span className="text-[11px] text-stone-400 truncate">{language}</span>
          </div>

        </aside>

        {/* ── Right pane ── */}
        <section className="flex-1 bg-white border border-stone-200/60 rounded-[32px] shadow-sm flex flex-col overflow-hidden h-full transition-colors duration-200">
          <div className="flex-1 overflow-y-auto no-scrollbar p-7 lg:p-9">
            <div className="max-w-2xl w-full mx-auto animate-in fade-in duration-300">
              {activeTab === "profile" ? <Profile /> : <Account />}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
