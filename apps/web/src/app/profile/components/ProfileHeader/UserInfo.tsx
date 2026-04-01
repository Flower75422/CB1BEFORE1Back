"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Share2, Settings, MapPin, Camera, Twitter, Linkedin, Instagram, Github, Youtube, Globe, Eye, TrendingUp, Pencil, Check, MessageCircle, UserPlus, UserCheck } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";
import { useSettingsStore } from "@/store/settings/settings.store";
import { User, useUsersStore, formatLastSeen } from "@/store/users/users.store";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter, linkedin: Linkedin, instagram: Instagram,
  github: Github, youtube: Youtube, website: Globe,
};

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000)      return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
};

export default function UserInfo({ viewingUser }: { viewingUser?: User }) {
  const { profileData, updateAvatar, uniqueVisitorIds, weeklyViews } = useProfileStore();
  const { name, username, avatarUrl, bio } = profileData;
  const { socialLinks } = useSettingsStore();
  const { followingIds, follow, unfollow } = useUsersStore();
  const router = useRouter();
  const activeSocialLinks = Object.entries(socialLinks).filter(([, url]) => url.trim());
  const fileRef = useRef<HTMLInputElement>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const isFollowing = viewingUser ? followingIds.includes(viewingUser.id) : false;
  const handleFollowToggle = () => {
    if (!viewingUser) return;
    isFollowing ? unfollow(viewingUser.id) : follow(viewingUser.id);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ title: name, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // When viewing another user, use their data
  const displayName    = viewingUser ? viewingUser.name       : name;
  const displayHandle  = viewingUser ? viewingUser.handle     : `@${username}`;
  const displayAvatar  = viewingUser ? (viewingUser.avatarUrl ?? "") : avatarUrl;

  return (
    <div className="w-full">

      {/* Avatar + Actions row */}
      <div className="flex items-start justify-between">

        {/* Avatar */}
        <div className="-mt-14 relative z-10">
          <div
            className={`h-24 w-24 rounded-2xl bg-stone-100 border-[3px] border-white shadow-lg overflow-hidden relative ${!viewingUser ? "group cursor-pointer" : ""}`}
            onClick={() => !viewingUser && fileRef.current?.click()}
          >
            <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
            {!viewingUser && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-white" />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          {viewingUser ? (
            // Viewing another user — show Follow + Message buttons
            <>
              <button
                onClick={handleFollowToggle}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] rounded-xl transition-all active:scale-95 ${
                  isFollowing
                    ? "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    : "bg-stone-900 text-white hover:bg-black"
                }`}
              >
                {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button
                onClick={() => router.push("/chats")}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200 text-stone-500 text-[11px] rounded-xl hover:bg-stone-50 hover:text-stone-700 transition-all active:scale-95"
              >
                <MessageCircle size={12} /> Message
              </button>
            </>
          ) : (
            // Own profile — show Edit / Share / Settings
            <>
              <Link
                href="/edit-profile"
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200 text-stone-500 text-[11px] rounded-xl hover:bg-stone-50 hover:text-stone-700 transition-all active:scale-95"
              >
                <Pencil size={12} /> Edit Profile
              </Link>
              <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 border text-[11px] rounded-xl transition-all active:scale-95 ${shareCopied ? "border-green-200 bg-green-50 text-green-600" : "border-stone-200 text-stone-400 hover:bg-stone-50 hover:text-stone-500"}`}
              >
                {shareCopied ? <Check size={12} /> : <Share2 size={12} />}
                {shareCopied ? "Copied!" : "Share"}
              </button>
              <Link href="/settings" className="group outline-none">
                <div className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-all active:scale-95">
                  <Settings size={14} className="text-stone-400 group-hover:text-stone-500 group-hover:rotate-45 transition-all duration-500" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Name + Handle */}
      <div className="mt-3 mb-4">
        <h2 className="text-[17px] font-semibold text-stone-700 tracking-tight leading-none">
          {displayName}
        </h2>
        <span className="text-[12px] text-stone-400 mt-1.5 block leading-none">
          {displayHandle}
        </span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Location — own profile only */}
        {!viewingUser && bio.location && (
          <>
            <div className="flex items-center gap-1 text-stone-400">
              <MapPin size={11} className="shrink-0" />
              <span className="text-[12px] font-medium">{bio.location}</span>
            </div>
            <span className="text-stone-200 text-[12px]">·</span>
          </>
        )}

        {/* Online status — viewing another user */}
        {viewingUser && (
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${viewingUser.isOnline ? "bg-green-400" : "bg-stone-300"}`} />
            <span className="text-[12px] font-medium text-stone-400">
              {viewingUser.isOnline ? "Active now" : "Offline"}
            </span>
          </div>
        )}

        {/* Profile Visits — own profile only */}
        {!viewingUser && (
          <>
            <div className="flex items-center gap-1.5" title="Unique users who have visited this profile">
              <Eye size={12} className="text-stone-400 shrink-0" />
              <span className="font-bold text-stone-700 text-[13px]">{fmt(uniqueVisitorIds.length)}</span>
              <span className="text-stone-400 text-[12px] font-medium">Visits</span>
            </div>

            <span className="text-stone-200 text-[12px]">·</span>

            {/* Weekly Views */}
            <div className="flex items-center gap-1.5" title="Total views across your cards, channels and posts this week">
              <TrendingUp size={12} className="text-stone-400 shrink-0" />
              <span className="font-bold text-stone-700 text-[13px]">{fmt(weeklyViews)}</span>
              <span className="text-stone-400 text-[12px] font-medium">Weekly Views</span>
            </div>
          </>
        )}

        {/* Last seen — viewer profile only */}
        {viewingUser && !viewingUser.isOnline && (
          <span className="text-[12px] font-medium text-stone-400">{formatLastSeen(viewingUser)}</span>
        )}

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
