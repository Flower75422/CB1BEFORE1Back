"use client";

import { useState, useEffect } from "react";
import SuccessScreen from "../SuccessScreen";
import CreateChannelTopBar from "./createchanneltopbar/CreateChannelTopBar";
import CreateChannelContent from "./createchannelcontent/CreateChannelContent";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

export default function CreateChannelController({ onClose }: { onClose: () => void }) {
  const { addChannel } = useCommunitiesStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    id: `channel_${Date.now()}`,
    title: "",
    description: "",
    channelId: "",
    category: "Technology",
    isPrivate: true,
    links: [] as any[],
    pool: [] as string[],
    avatarUrl: "",
    permissions: {} as Record<string, any>,
    step: 1,
    isSuccess: false,
    isPublished: false,
  });

  const updateData = (updates: any) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const setStep = (newStep: number | ((s: number) => number)) =>
    setFormData((prev) => ({
      ...prev,
      step: typeof newStep === "function" ? newStep(prev.step) : newStep,
    }));

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overscrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="w-full max-w-6xl h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-200">

      <CreateChannelTopBar onClose={onClose} />

      {formData.isSuccess ? (
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-stone-200/60 p-12 flex items-center justify-center animate-in zoom-in-95 duration-300 mb-6">
          <SuccessScreen
            type="channel"
            name={formData.title || "Your New Channel"}
            onFinish={onClose}
          />
        </div>
      ) : (
        <CreateChannelContent
          step={formData.step}
          setStep={setStep}
          formData={formData}
          updateData={updateData}
          setIsSuccess={(val: boolean) => {
            updateData({ isSuccess: val, isPublished: val });
            if (val) {
              const ownerSlug = (user?.handle || "wasim").replace(/^@/, "").toLowerCase();
              const contentSlug = formData.channelId
                ? formData.channelId.toLowerCase()
                : (formData.title || "channel").toLowerCase().replace(/[^a-z0-9_]/g, "").replace(/\s+/g, "_");

              addChannel({
                id: formData.id,
                name: formData.title || "Untitled Channel",
                handle: `@${contentSlug}/ch/${ownerSlug}`,
                links: formData.links || [],
                members: 1,
                desc: formData.description || "",
                isPrivate: formData.isPrivate ?? true,
                category: formData.category || "General",
                ownerId: user?.id || "u_1",
                avatarUrl: formData.avatarUrl || undefined,
                pool: formData.pool || [],
                permissions: {
                  allowComments: formData.permissions?.allowComments !== false,
                  allowReactions: formData.permissions?.allowReactions !== false,
                  tier: formData.permissions?.tier || "Free",
                  reachability: formData.permissions?.reachability || "Global",
                  searchIndexing: formData.permissions?.searchIndexing !== false,
                  isNSFW: formData.permissions?.isNSFW || false,
                },
              });
            }
          }}
          onClose={onClose}
        />
      )}

    </div>
  );
}
