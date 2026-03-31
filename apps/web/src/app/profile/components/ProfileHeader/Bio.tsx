"use client";
import { MapPin } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";

export default function Bio() {
  const { profileData } = useProfileStore();
  const { location, text } = profileData.bio;

  return (
    <div className="flex flex-col gap-2.5">

      {/* Bio text */}
      <p className="text-[13px] text-stone-500 leading-relaxed max-w-2xl">
        {text}
      </p>

    </div>
  );
}
