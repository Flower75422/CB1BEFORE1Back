"use client";

import { useState, useEffect } from "react";
import SuccessScreen from "../SuccessScreen";
import CreateGroupTopBar from "./creategrouptopbar/CreateGroupTopBar";
import CreateGroupContent from "./creategroupcontent/CreateGroupContent";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

export default function CreateGroupController({ onClose }: { onClose: () => void }) {
  const { addGroup } = useCommunitiesStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    id: `group_${Date.now()}`,
    title: "",
    description: "",
    groupId: "",
    category: "Technology",
    isPrivate: true,
    allowInvites: true,
    pool: [] as string[],
    avatarUrl: "",
    members: [] as Array<{ handle: string; role: string; name?: string }>,
    adminRights: ["content", "users"] as string[],
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

      <CreateGroupTopBar onClose={onClose} />

      {formData.isSuccess ? (
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-stone-200/60 p-12 flex items-center justify-center animate-in zoom-in-95 duration-300 mb-6">
          <SuccessScreen
            type="group"
            name={formData.title || "Your New Group"}
            onFinish={onClose}
          />
        </div>
      ) : (
        <CreateGroupContent
          step={formData.step}
          setStep={setStep}
          formData={formData}
          updateData={updateData}
          setIsSuccess={(val: boolean) => {
            updateData({ isSuccess: val, isPublished: val });
            if (val) {
              const ownerSlug = (user?.handle || "wasim").replace(/^@/, "").toLowerCase();
              const contentSlug = formData.groupId
                ? formData.groupId.toLowerCase()
                : (formData.title || "group").toLowerCase().replace(/[^a-z0-9_]/g, "").replace(/\s+/g, "_");

              addGroup({
                id: formData.id,
                name: formData.title || "Untitled Group",
                handle: `@${contentSlug}/gr/${ownerSlug}`,
                members: 1,
                desc: formData.description || "",
                isPrivate: formData.isPrivate ?? true,
                category: formData.category || "General",
                ownerId: user?.id || "u_1",
                activity: "Active",
                admins: [user?.id || "u_1"],
                avatarUrl: formData.avatarUrl || undefined,
                pool: formData.pool || [],
                groupMembers: formData.members || [],
                adminRights: formData.adminRights || [],
                permissions: {
                  isPublic: formData.permissions?.isPublic || false,
                  allowMessages: formData.permissions?.allowMessages !== false,
                  allowMedia: formData.permissions?.allowMedia !== false,
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
