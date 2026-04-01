"use client";

import { useState, useEffect } from "react";
import SettingsContent from "./components/settingscontent/SettingsContent";

export default function SettingsPage() {
  // Always initialize with "preferences" so server and client render the same HTML
  // — avoids the React hydration mismatch on the active sidebar button class.
  const [activeTab, setActiveTab] = useState<string>("preferences");

  useEffect(() => {
    const saved = localStorage.getItem("settings-last-tab");
    if (saved && saved !== "profile" && saved !== "account") {
      setActiveTab(saved);
    }
  }, []);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("settings-last-tab", tab);
    }
  };


  return (
    // 🔴 THE FIX: Removed 'min-h-screen/100vh'. We use 'h-full' so it obeys your layout's p-8 padding!
    <div className="w-full h-full flex flex-col text-[#1c1917]">
      <SettingsContent activeTab={activeTab} setActiveTab={handleSetActiveTab} />
    </div>
  );
}