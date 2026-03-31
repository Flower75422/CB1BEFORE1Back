"use client";

import { Camera, AlertCircle } from "lucide-react";
import { useRef, ChangeEvent, useState } from "react";
import { useCardsEditorStore } from "@/store/cards/cards.editor.store";

interface ProfileFormProps {
  card: any;
  updateCard: (updates: any) => void;
}

// 🔴 MOCK BACKEND: Handles that are already taken in the database
const TAKEN_HANDLES = ["admin", "dev_profile_123", "mike_builds", "system"];

export default function ProfileFormone({ card, updateCard }: ProfileFormProps) {
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [handleError, setHandleError] = useState("");

  // Bring in draftCards to check if you are using the same handle twice in your deck
  const { draftCards } = useCardsEditorStore();

  // 🔴 NAME RULE: Max 30 chars, Alphanumeric + Spaces ONLY
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 54);
    const channelData = card?.channel || {};
    updateCard({ channel: { ...channelData, name: sanitizedValue } });
  };

  // HANDLE RULE: Max 30 chars, Lowercase, Alphanumeric + Underscores ONLY
  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 54);

    let errorMsg = "";
    if (sanitizedValue.length > 0) {
      if (TAKEN_HANDLES.includes(sanitizedValue)) {
        errorMsg = "This handle is already taken.";
      } else {
        const isDuplicateInDrafts = draftCards.some(
          (c) => c.id !== card.id && c.channel?.id === sanitizedValue
        );
        if (isDuplicateInDrafts) errorMsg = "Handle already used in another draft.";
      }
    }
    setHandleError(errorMsg);

    const channelData = card?.channel || {};
    updateCard({ channel: { ...channelData, id: sanitizedValue } });
  };

  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateCard({ bio: e.target.value.slice(0, 225) });
  };

  const handleImg = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateCard({ profilePicUrl: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">

        {/* Profile Image Upload */}
        <div
          onClick={() => profileInputRef.current?.click()}
          className="w-28 h-28 shrink-0 bg-[#F5F5F4] rounded-[20px] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center group hover:border-stone-400 transition-all cursor-pointer relative overflow-hidden"
        >
          {card?.profilePicUrl ? (
            <img src={card.profilePicUrl} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <>
              <div className="p-2 bg-white rounded-full shadow-sm border border-stone-100 mb-1.5 group-hover:scale-110 transition-transform">
                <Camera className="text-stone-400" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-stone-400 font-black text-[8px] uppercase tracking-widest text-center px-1">
                Avatar
              </span>
            </>
          )}
          <input type="file" ref={profileInputRef} hidden accept="image/*" onChange={handleImg} />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {/* Card Name */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Card Name</label>
              <span className="text-[8px] font-bold text-stone-300">{card?.channel?.name?.length || 0}/54</span>
            </div>
            <input
              type="text"
              value={card?.channel?.name || ""}
              onChange={handleNameChange}
              className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-[12px] text-[#1c1917] placeholder-stone-300 focus:outline-none focus:border-black transition-colors shadow-sm"
              placeholder="e.g. Full Stack Dev"
            />
          </div>

          {/* Card Handle */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Card Handle</label>
              <span className={`text-[8px] font-bold ${handleError ? "text-red-400" : "text-stone-300"}`}>
                {card?.channel?.id?.length || 0}/54
              </span>
            </div>
            <div className="relative flex items-center">
              <span className={`absolute left-3 text-[12px] font-black ${handleError ? "text-red-400" : "text-stone-400"}`}>@</span>
              <input
                type="text"
                value={card?.channel?.id || ""}
                onChange={handleIdChange}
                className={`w-full pl-7 pr-3 py-2.5 bg-white border rounded-xl font-bold text-[12px] text-[#1c1917] placeholder-stone-300 focus:outline-none transition-colors shadow-sm ${
                  handleError ? "border-red-400 focus:border-red-500" : "border-stone-200 focus:border-black"
                }`}
                placeholder="dev_profile_123"
              />
            </div>
            {handleError && (
              <div className="flex items-center gap-1 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={10} className="text-red-500" strokeWidth={3} />
                <span className="text-[9px] font-bold text-red-500">{handleError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Card Bio</label>
          <span className="text-[8px] font-black text-stone-400 uppercase">{card?.bio?.length || 0}/225</span>
        </div>
        <textarea
          value={card?.bio || ""}
          onChange={handleBioChange}
          placeholder="Describe the purpose of this card..."
          className="w-full h-[72px] p-3 bg-white border border-stone-200 rounded-xl text-[12px] font-bold text-[#1c1917] focus:outline-none focus:border-black transition-all resize-none shadow-sm"
        />
      </div>
    </div>
  );
}
