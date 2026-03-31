"use client";

import Link from "next/link";
import { Repeat, User } from "lucide-react";

export default function BottomOfBackCard({
  onFlipBack,
  allowFullProfile = true,
  isMyCardView,
  onOpenProfile,
  name,
  handle,
  avatarUrl,
  description,
  wallPosts,
  views,
  location,
  mediaUrl,
  channelName,
  channelHandle,
  isPrivate,
}: any) {

  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenProfile) {
      onOpenProfile({
        name, handle, avatarUrl,
        bio: description,
        wallPosts,
        views,
        location,
        mediaUrl,       // used as banner in profile view
        channelName,
        channelHandle,
        isPrivate,
      });
    }
  };

  const btnBase =
    "flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-bold transition active:scale-95";

  return (
    <div className="w-full flex flex-col pt-1 relative z-20 shrink-0">
      <div className="h-px bg-stone-200/50 w-full mb-1" />

      <div className="flex gap-2">

        {/* VIEW — my own card → internal link to /profile; viewer → overlay */}
        {allowFullProfile && (
          isMyCardView ? (
            <Link
              href="/profile"
              onClick={(e) => e.stopPropagation()}
              className={`${btnBase} bg-[#1c1917] hover:bg-black text-white`}
            >
              <User size={11} /> My Profile
            </Link>
          ) : (
            <button
              onClick={handleViewProfile}
              className={`${btnBase} bg-[#1c1917] hover:bg-black text-white`}
            >
              <User size={11} /> View Profile
            </button>
          )
        )}

        {/* FLIP BACK */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFlipBack?.();
          }}
          className={`${btnBase} bg-stone-100 hover:bg-stone-200 text-stone-700 ${allowFullProfile ? "" : "flex-1"}`}
        >
          <Repeat size={11} /> Flip
        </button>

      </div>
    </div>
  );
}
