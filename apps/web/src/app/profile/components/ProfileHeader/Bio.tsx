"use client";
import { useProfileStore } from "@/store/profile/profile.store";
import { User } from "@/store/users/users.store";

export default function Bio({ viewingUser }: { viewingUser?: User }) {
  const { profileData } = useProfileStore();
  const { text } = profileData.bio;

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13px] text-stone-500 leading-relaxed max-w-2xl">
        {viewingUser ? (viewingUser.bio ?? "") : text}
      </p>
    </div>
  );
}
