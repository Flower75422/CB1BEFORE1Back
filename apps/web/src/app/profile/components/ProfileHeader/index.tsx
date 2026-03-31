"use client";
import { useRef } from "react";
import { Camera } from "lucide-react";
import UserInfo from "./UserInfo";
import Bio from "./Bio";
import { useProfileStore } from "@/store/profile/profile.store";

export default function ProfileHeader() {
  const { profileData, updateBanner } = useProfileStore();
  const { bannerUrl } = profileData;
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateBanner(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm mb-8 border border-stone-200/60 overflow-hidden">

      {/* Cover Banner */}
      <div
        className="h-28 relative z-0 overflow-hidden group cursor-pointer"
        onClick={() => bannerFileRef.current?.click()}
      >
        {bannerUrl ? (
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-100 to-[#FDFBF7]">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-stone-300/20 blur-3xl" />
            <div className="absolute left-1/3 -top-4 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white/20 to-transparent" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={20} className="text-white" />
        </div>
      </div>
      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />

      {/* Content — relative z-10 ensures avatar sits above the banner */}
      <div className="px-8 pb-8 pt-4 relative z-10">
        <UserInfo />
        <div className="mt-5 border-t border-stone-100 pt-5">
          <Bio />
        </div>
      </div>

    </div>
  );
}