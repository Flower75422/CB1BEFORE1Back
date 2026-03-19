"use client";

import { useState, useEffect } from "react";
import SettingsContent from "./components/settingscontent/SettingsContent";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // 🔴 THE FIX: Reach up into RootLayout and freeze its <main> tag!
  useEffect(() => {
    const rootMain = document.querySelector("main");
    
    if (rootMain) {
      // Save the original so we don't permanently break the rest of the app
      const originalOverflow = rootMain.style.overflow;
      
      // Freeze the root layout!
      rootMain.style.overflow = "hidden";
      
      return () => {
        // Unlock when leaving the Settings page
        rootMain.style.overflow = originalOverflow;
      };
    }
  }, []);

  return (
    // 🔴 THE FIX: Removed 'min-h-screen/100vh'. We use 'h-full' so it obeys your layout's p-8 padding!
    <div className="w-full h-full flex flex-col text-[#1c1917]">
      <SettingsContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}