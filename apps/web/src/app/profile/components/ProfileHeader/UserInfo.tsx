"use client";
import { useRef } from "react";
import Link from "next/link";
import { Share2, Settings, MapPin, Camera, Twitter, Linkedin, Instagram, Github, Youtube, Globe, Eye, TrendingUp } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";
import { useSettingsStore } from "@/store/settings/settings.store";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter, linkedin: Linkedin, instagram: Instagram,
  github: Github, youtube: Youtube, website: Globe,
};

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000)      return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
};

export default function UserInfo() {
  const { profileData, updateAvatar, uniqueVisitorIds, weeklyViews } = useProfileStore();
  const { name, username, avatarUrl, bio } = profileData;
  const { socialLinks } = useSettingsStore();
  const activeSocialLinks = Object.entries(socialLinks).filter(([, url]) => url.trim());
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">

      {/* Avatar + Actions row */}
      <div className="flex items-start justify-between">

        {/* Avatar with upload */}
        <div className="-mt-14 relative z-10">
          <div
            className="h-24 w-24 rounded-2xl bg-stone-100 border-[3px] border-white shadow-lg overflow-hidden relative group cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-white" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200 text-stone-400 text-[11px] rounded-xl hover:bg-stone-50 hover:text-stone-500 transition-all active:scale-95">
            <Share2 size={12} /> Share
          </button>
          <Link href="/settings" className="group outline-none">
            <div className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-all active:scale-95">
              <Settings size={14} className="text-stone-400 group-hover:text-stone-500 group-hover:rotate-45 transition-all duration-500" />
            </div>
          </Link>
        </div>
      </div>

      {/* Name + Handle */}
      <div className="mt-3 mb-4">
        <h2 className="text-[17px] font-semibold text-stone-700 tracking-tight leading-none">
          {name}
        </h2>
        <span className="text-[12px] text-stone-400 mt-1.5 block leading-none">
          @{username}
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Location */}
        {bio.location && (
          <>
            <div className="flex items-center gap-1 text-stone-400">
              <MapPin size={11} className="shrink-0" />
              <span className="text-[12px] font-medium">{bio.location}</span>
            </div>
            <span className="text-stone-200 text-[12px]">·</span>
          </>
        )}

        {/* Profile Visits — unique users who opened this profile */}
        <div
          className="flex items-center gap-1.5"
          title="Unique users who have visited this profile"
        >
          <Eye size={12} className="text-stone-400 shrink-0" />
          <span className="font-bold text-stone-700 text-[13px]">{fmt(uniqueVisitorIds.length)}</span>
          <span className="text-stone-400 text-[12px] font-medium">Visits</span>
        </div>

        <span className="text-stone-200 text-[12px]">·</span>

        {/* Weekly Views — total views across cards, channels & posts this week */}
        <div
          className="flex items-center gap-1.5"
          title="Total views across your cards, channels and posts this week"
        >
          <TrendingUp size={12} className="text-stone-400 shrink-0" />
          <span className="font-bold text-stone-700 text-[13px]">{fmt(weeklyViews)}</span>
          <span className="text-stone-400 text-[12px] font-medium">Weekly Views</span>
        </div>

        {/* Social links */}
        {activeSocialLinks.length > 0 && <span className="text-stone-200 text-[12px]">·</span>}
        {activeSocialLinks.map(([platform, url]) => {
          const Icon = SOCIAL_ICONS[platform];
          return Icon ? (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" title={platform} className="text-stone-400 hover:text-[#1c1917] transition-colors">
              <Icon size={13} />
            </a>
          ) : null;
        })}

      </div>
    </div>
  );
}
