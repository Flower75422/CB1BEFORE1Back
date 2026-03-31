"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, BellOff, Twitter, Linkedin, Instagram, Github, Youtube, Globe, Check, X, Languages, Link2 } from "lucide-react";
import NotifChannelPrefs from "./NotifChannelPrefs";
import { useSettingsStore } from "@/store/settings/settings.store";

const SOCIAL_PLATFORMS = [
  { key: "twitter",   label: "Twitter / X",  icon: Twitter,   placeholder: "https://twitter.com/username" },
  { key: "linkedin",  label: "LinkedIn",     icon: Linkedin,  placeholder: "https://linkedin.com/in/username" },
  { key: "instagram", label: "Instagram",    icon: Instagram, placeholder: "https://instagram.com/username" },
  { key: "github",    label: "GitHub",       icon: Github,    placeholder: "https://github.com/username" },
  { key: "youtube",   label: "YouTube",      icon: Youtube,   placeholder: "https://youtube.com/@channel" },
  { key: "website",   label: "Website",      icon: Globe,     placeholder: "https://yourwebsite.com" },
];

const LANGUAGES = [
  "English (US)",
  "English (UK)",
  "Hindi",
  "Spanish",
  "French",
];

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${value ? "bg-stone-800" : "bg-stone-200"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function SectionBlock({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 bg-stone-50/60 border border-stone-100 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-stone-100">
          <Icon size={11} className="text-stone-500" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function Preferences() {
  const { emailNotifications, toggleEmailNotifications, language, setLanguage, socialLinks, setSocialLink } = useSettingsStore();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [inputVal, setInputVal]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeKey) {
      setInputVal(socialLinks[activeKey] || "");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [activeKey]);

  const handleSave = () => {
    if (activeKey) setSocialLink(activeKey, inputVal.trim());
    setActiveKey(null);
  };
  const handleClear = () => {
    if (activeKey) setSocialLink(activeKey, "");
    setInputVal("");
    setActiveKey(null);
  };

  const linkedCount = Object.values(socialLinks).filter(v => v?.trim()).length;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-stone-700">Preferences</h2>
        <p className="text-[12px] text-stone-400 mt-0.5">Language, notifications and social links</p>
      </div>

      {/* ── Language ─────────────────────────────────────────────────── */}
      <SectionBlock icon={Languages} label="Language">
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-2.5 rounded-xl border text-[12px] font-medium text-left transition-all active:scale-95 ${
                language === lang
                  ? "bg-stone-800 border-stone-800 text-white"
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-400"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </SectionBlock>

      {/* ── Social Links (UNCHANGED) ─────────────────────────────────── */}
      <SectionBlock icon={Link2} label={`Social Links${linkedCount > 0 ? ` · ${linkedCount} linked` : ""}`}>

        {/* Icons row */}
        <div className="flex items-center gap-2 flex-wrap">
          {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon }) => {
            const hasLink = !!(socialLinks[key]?.trim());
            const isActive = activeKey === key;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(isActive ? null : key)}
                title={label}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                  hasLink
                    ? "bg-[#1c1917] border-[#1c1917] text-white"
                    : isActive
                    ? "bg-stone-100 border-stone-400 text-[#1c1917]"
                    : "bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-400 hover:text-[#1c1917]"
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Inline input */}
        {activeKey && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <input
              ref={inputRef}
              type="url"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setActiveKey(null); }}
              placeholder={SOCIAL_PLATFORMS.find(p => p.key === activeKey)?.placeholder}
              className="flex-1 px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-[12px] text-stone-600 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
            />
            <button onClick={handleSave} className="h-8 w-8 rounded-lg bg-[#1c1917] flex items-center justify-center text-white hover:bg-black active:scale-95 transition-all shrink-0">
              <Check size={13} />
            </button>
            {socialLinks[activeKey]?.trim() && (
              <button onClick={handleClear} className="h-8 w-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-100 active:scale-95 transition-all shrink-0">
                <X size={13} />
              </button>
            )}
          </div>
        )}

      </SectionBlock>

      {/* ── Notifications ────────────────────────────────────────────── */}
      <SectionBlock icon={Bell} label="Notifications">

        {/* Email notifications */}
        <div className={`flex items-center justify-between px-3.5 py-3 rounded-xl border transition-colors ${emailNotifications ? "bg-white border-stone-200" : "bg-white border-stone-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg transition-colors ${emailNotifications ? "bg-stone-800" : "bg-stone-100"}`}>
              {emailNotifications
                ? <Bell size={13} className="text-white" />
                : <BellOff size={13} className="text-stone-400" />
              }
            </div>
            <div>
              <p className="text-[13px] text-stone-600 font-medium">Email Notifications</p>
              <p className="text-[11px] text-stone-400">Updates, alerts and activity digests</p>
            </div>
          </div>
          <Toggle value={emailNotifications} onChange={toggleEmailNotifications} />
        </div>

        {/* Push (coming soon) */}
        <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-stone-100 bg-stone-50/80 opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-stone-100">
              <Bell size={13} className="text-stone-400" />
            </div>
            <div>
              <p className="text-[13px] text-stone-500 font-medium">Push Notifications</p>
              <p className="text-[11px] text-stone-400">Browser and mobile push alerts</p>
            </div>
          </div>
          <span className="text-[10px] text-stone-300 bg-stone-100 border border-stone-200 px-2 py-1 rounded-lg">Soon</span>
        </div>

      </SectionBlock>

      {/* ── Per-channel / per-group Notification Prefs ──────────────── */}
      <SectionBlock icon={Bell} label="Channel & Group Notifications">
        <NotifChannelPrefs />
      </SectionBlock>

    </div>
  );
}
