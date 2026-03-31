"use client";
import { useState, useRef } from "react";
import { Plus, X, Share2, ImagePlus, Film, Check } from "lucide-react";
import WallpostsGrid from "./wallposts/WallpostsGrid";
import ControllerChannel from "./channels/controllerchannel";
import ControllerGroup from "./groups/controllergroup";
import { Channel } from "@/app/communities/components/display/channels/card";
import { Group } from "@/app/communities/components/display/groups/card";
import { useProfileStore } from "@/store/profile/profile.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";

type Tab = "Posts" | "Channels" | "Groups";

interface ProfileBodyProps {
  onOpenChannelChat: (channel: Channel) => void;
  onOpenGroupChat: (group: Group) => void;
}

export default function ProfileBody({ onOpenChannelChat, onOpenGroupChat }: ProfileBodyProps) {
  const [activeTab, setActiveTab]           = useState<Tab>("Posts");
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [mediaData, setMediaData]           = useState<string | null>(null);
  const [mediaType, setMediaType]           = useState<"image" | "video" | null>(null);
  const [caption, setCaption]               = useState("");
  const [posted, setPosted]                 = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { addWallpost } = useProfileStore();
  const { myCards, saveSingleCard } = useCardsFeedStore();
  const tabs: Tab[] = ["Posts", "Channels", "Groups"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader  = new FileReader();
    reader.onloadend = () => {
      setMediaData(reader.result as string);
      setMediaType(isVideo ? "video" : "image");
    };
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!mediaData || !mediaType) return;

    // 1. Add to profile wallposts grid (own profile page)
    addWallpost({
      mediaUrl: mediaData,
      mediaType,
      facet: caption.trim() || "Post",
    });

    // 2. Sync to every card's wallPosts so the back of card + viewer profile also shows it
    const newCardPost = {
      id: `cp_${Date.now()}`,
      mediaUrl: mediaData,
      mediaType,
      caption: caption.trim() || "",
      isPinned: false,
      createdAt: new Date().toISOString(),
    };
    myCards.forEach((card: any) => {
      saveSingleCard({
        ...card,
        wallPosts: [newCardPost, ...(card.wallPosts || [])],
      });
    });

    setPosted(true);
    setTimeout(() => {
      setPosted(false);
      closePanel();
    }, 1200);
  };

  const closePanel = () => {
    setShowSharePanel(false);
    setMediaData(null);
    setMediaType(null);
    setCaption("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const tabs_list = tabs;

  return (
    <div className="w-full">

      {/* ── Primary tab bar ── */}
      <div className="border-b border-stone-200/60 -ml-4">
        <div className="flex gap-8 px-4">
          {tabs_list.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 transition-all text-[14px] font-medium ${
                activeTab === tab
                  ? "text-stone-800"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-stone-800 rounded-full z-10" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Secondary bar — only under Posts tab ── */}
      {activeTab === "Posts" && (
        <div className="flex flex-col">
          <div className="flex items-center justify-end py-2.5">
            <button
              onClick={() => setShowSharePanel(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all active:scale-95 ${
                showSharePanel
                  ? "bg-[#1c1917] text-white border-[#1c1917]"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200"
              }`}
            >
              <Plus size={11} className={showSharePanel ? "rotate-45 transition-transform" : "transition-transform"} />
              <Share2 size={11} />
              Share New Posts
            </button>
          </div>

          {/* ── Inline dropdown ── */}
          {showSharePanel && (
            <div className="mb-4 bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">

              {/* ── Media area ── */}
              {mediaData ? (
                /* Preview once file is picked */
                <div className="relative w-full rounded-xl overflow-hidden bg-black border border-stone-200" style={{ height: 140 }}>
                  {mediaType === "video"
                    ? <video src={mediaData} className="absolute inset-0 w-full h-full object-contain" controls />
                    : <img src={mediaData} alt="Preview" className="absolute inset-0 w-full h-full object-contain" />
                  }
                  <button
                    onClick={() => { setMediaData(null); setMediaType(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                /* Label wraps hidden input — most reliable way to open file picker */
                <label
                  htmlFor="profile-post-file"
                  className="flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-stone-300 hover:border-[#1c1917] hover:bg-white transition-colors cursor-pointer"
                  style={{ height: 140 }}
                >
                  <div className="flex gap-2 pointer-events-none">
                    <ImagePlus size={22} className="text-stone-300" />
                    <Film size={22} className="text-stone-300" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wide pointer-events-none">
                    Pick photo or video
                  </span>
                </label>
              )}

              {/* Hidden file input — linked via id to the label above */}
              <input
                id="profile-post-file"
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={handleFileSelect}
              />

              {/* Caption + char counter */}
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.slice(0, 43))}
                  placeholder="Add a caption... (optional)"
                  rows={2}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 pb-5 text-[12px] font-medium text-[#1c1917] placeholder:text-stone-400 outline-none focus:border-[#1c1917] resize-none transition-colors"
                />
                <span className={`absolute bottom-2 right-2.5 text-[9px] font-bold pointer-events-none ${caption.length >= 43 ? "text-red-400" : "text-stone-300"}`}>
                  {caption.length}/43
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={closePanel}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-500 text-[11px] font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePost}
                  disabled={!mediaData || posted}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1c1917] hover:bg-black text-white text-[11px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
                >
                  {posted
                    ? <><Check size={12} /> Posted!</>
                    : <><Share2 size={12} /> Post</>
                  }
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ── Dynamic content ── */}
      <div className={`min-h-[400px] ${activeTab !== "Posts" ? "mt-6" : ""}`}>
        {activeTab === "Posts"    && <WallpostsGrid />}
        {activeTab === "Channels" && <ControllerChannel onOpenChat={onOpenChannelChat} />}
        {activeTab === "Groups"   && <ControllerGroup  onOpenChat={onOpenGroupChat}  />}
      </div>

    </div>
  );
}
