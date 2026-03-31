"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Trash2, ImagePlus, Pin, Clock, X, ImageOff, Play, Lock, Timer } from "lucide-react";

// Exact back-of-card body height (card 200px - padding - top - bottom sections)
const CARD_BODY_H = 121;

function isExpired(post: any): boolean {
  if (!post.expiresAt) return false;
  return Date.now() > new Date(post.expiresAt).getTime();
}

function timeUntilExpiry(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export default function WallPostsStep({ card, updateCard, onDelete }: any) {
  const [caption, setCaption]           = useState("");
  const [mediaData, setMediaData]       = useState<string | null>(null);
  const [mediaType, setMediaType]       = useState<"image" | "video" | null>(null);
  const [isPinned, setIsPinned]         = useState(false);
  const [expiresIn24h, setExpiresIn24h] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const posts = card.wallPosts || [];

  // ── Auto-clear expired posts every 60 seconds ──────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPosts: any[] = card.wallPosts || [];
      const hasExpired = currentPosts.some(isExpired);
      if (hasExpired) {
        updateCard({ wallPosts: currentPosts.filter((p: any) => !isExpired(p)) });
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [card.wallPosts, updateCard]);

  // ── Active post = non-expired post attached to this card
  const activePost = posts.find((p: any) => !isExpired(p)) ?? null;
  const hasActivePost = !!activePost;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaData(reader.result as string);
      setMediaType(isVideo ? "video" : "image");
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaData(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddPost = () => {
    if (!mediaData || hasActivePost) return;
    const post = {
      id: `post_${Date.now()}`,
      caption: caption.trim(),
      mediaUrl: mediaData,
      mediaType,
      isPinned,
      expiresAt: expiresIn24h
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null,
      createdAt: new Date().toISOString(),
    };
    updateCard({ wallPosts: [post, ...posts] });
    setCaption("");
    clearMedia();
    setIsPinned(false);
    setExpiresIn24h(false);
  };

  const deletePost = (id: string) =>
    updateCard({ wallPosts: posts.filter((p: any) => p.id !== id) });

  // All posts (expired ones shown in history for reference)
  const sortedPosts = [...posts].sort((a: any, b: any) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300 pb-2">

      {/* ── NEW WALL POST ─────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex justify-between">
          <span>Wall Post</span>
          {!hasActivePost && !mediaData && (
            <span className="text-red-400 font-bold">Media required*</span>
          )}
          {hasActivePost && (
            <span className="text-amber-500 font-bold">1 post per card</span>
          )}
        </label>

        {/* ── LOCKED STATE — active post exists ── */}
        {hasActivePost ? (
          <div className="flex flex-col gap-2 bg-[#F5F5F4] p-3 rounded-xl border border-stone-200">

            {/* Active post preview */}
            <div
              className="w-full relative rounded-lg overflow-hidden border border-stone-200 bg-black"
              style={{ height: CARD_BODY_H }}
            >
              {activePost.mediaType === "video" ? (
                <video src={activePost.mediaUrl} className="absolute inset-0 w-full h-full object-cover opacity-90" muted />
              ) : (
                <img src={activePost.mediaUrl} alt="Active post" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1 z-10">
                {activePost.isPinned && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400 text-amber-950 text-[8px] font-black uppercase rounded-md">
                    <Pin size={8} className="fill-amber-950" /> Pinned
                  </span>
                )}
                {activePost.expiresAt && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black uppercase rounded-md">
                    <Timer size={8} /> {timeUntilExpiry(activePost.expiresAt)}
                  </span>
                )}
              </div>

              {/* Lock overlay badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full z-10">
                <Lock size={9} className="text-white" />
                <span className="text-[8px] font-black text-white uppercase">Active</span>
              </div>

              {/* Caption overlay */}
              {activePost.caption && (
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-black/50 backdrop-blur-sm">
                  <p className="text-[10px] text-white font-medium leading-tight line-clamp-2">{activePost.caption}</p>
                </div>
              )}
            </div>

            {/* Info + delete */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] font-bold text-[#1c1917]">
                  {activePost.expiresAt
                    ? `Auto-removes in ${timeUntilExpiry(activePost.expiresAt)}`
                    : "No expiry set — delete to replace"}
                </p>
                <p className="text-[9px] text-stone-400 font-medium uppercase tracking-wide">
                  Delete this post to upload a new one
                </p>
              </div>
              <button
                onClick={() => deletePost(activePost.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors active:scale-95 shrink-0"
              >
                <Trash2 size={11} strokeWidth={2.5} /> Delete
              </button>
            </div>
          </div>

        ) : (
          /* ── UPLOAD STATE — no active post ── */
          <div className="flex flex-col gap-2 bg-[#F5F5F4] p-3 rounded-xl border border-stone-200 focus-within:border-black transition-colors">

            {/* Media preview — exact card back body dimensions */}
            {mediaData ? (
              <div
                className="w-full relative rounded-lg overflow-hidden border border-stone-200 bg-black"
                style={{ height: CARD_BODY_H }}
              >
                {mediaType === "video" ? (
                  <video src={mediaData} className="absolute inset-0 w-full h-full object-cover opacity-90" controls />
                ) : (
                  <img src={mediaData} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  {isPinned && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400 text-amber-950 text-[8px] font-black uppercase rounded-md">
                      <Pin size={8} className="fill-amber-950" /> Pinned
                    </span>
                  )}
                  {expiresIn24h && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-black uppercase rounded-md">
                      <Clock size={8} /> 24H
                    </span>
                  )}
                </div>
                {/* Remove */}
                <button
                  onClick={clearMedia}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                >
                  <X size={12} strokeWidth={3} />
                </button>
                {/* Caption overlay at bottom */}
                {caption && (
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-black/50 backdrop-blur-sm">
                    <p className="text-[10px] text-white font-medium leading-tight line-clamp-2">{caption}</p>
                  </div>
                )}
              </div>
            ) : (
              /* Empty upload area — same card body height */
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ height: CARD_BODY_H }}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 hover:border-black hover:bg-stone-100 transition-colors"
              >
                <ImagePlus size={22} className="text-stone-400" />
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">Upload Image or Video</span>
                <span className="text-[9px] text-stone-300 font-medium">This is the exact size shown on card</span>
              </button>
            )}

            <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleFileSelect} />

            {/* Caption input */}
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 43))}
                placeholder="Add a caption... (optional)"
                maxLength={43}
                className="w-full bg-transparent text-[12px] font-medium text-[#1c1917] outline-none resize-none h-9 placeholder:text-stone-400 pr-8"
              />
              <span className={`absolute bottom-0 right-0 text-[9px] font-bold tabular-nums ${caption.length >= 43 ? "text-red-400" : "text-stone-300"}`}>
                {caption.length}/43
              </span>
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <div className="flex items-center gap-1">
                {mediaData && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-stone-500 hover:text-black hover:bg-stone-200 rounded-lg transition-colors"
                    title="Change media"
                  >
                    <ImagePlus size={15} />
                  </button>
                )}
                <div className="h-3.5 w-[1px] bg-stone-300 mx-0.5" />
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className={`p-1.5 rounded-lg transition-colors ${isPinned ? "bg-amber-100 text-amber-700" : "text-stone-400 hover:bg-stone-200"}`}
                  title="Pin to top"
                >
                  <Pin size={14} className={isPinned ? "fill-amber-700" : ""} />
                </button>
                <button
                  onClick={() => setExpiresIn24h(!expiresIn24h)}
                  className={`p-1.5 rounded-lg transition-colors ${expiresIn24h ? "bg-blue-100 text-blue-700" : "text-stone-400 hover:bg-stone-200"}`}
                  title="Expire in 24h"
                >
                  <Clock size={14} />
                </button>
              </div>

              <button
                onClick={handleAddPost}
                disabled={!mediaData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors active:scale-95"
              >
                <Send size={11} strokeWidth={2.5} /> Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── POST HISTORY (expired posts) ─────────────────────────────── */}
      {sortedPosts.some((p: any) => isExpired(p)) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Expired Posts</label>
            <span className="text-[9px] font-black text-stone-300">{sortedPosts.filter((p: any) => isExpired(p)).length} expired</span>
          </div>
          <div className="flex flex-col gap-2">
            {sortedPosts.filter((p: any) => isExpired(p)).map((post: any) => (
              <div key={post.id} className="group flex gap-3 bg-white border border-stone-200 rounded-xl p-2 opacity-50 hover:opacity-70 transition-opacity items-start">
                <div className="shrink-0 w-[72px] h-[48px] rounded-lg overflow-hidden relative bg-stone-100 border border-stone-100">
                  {post.mediaUrl ? (
                    post.mediaType === "video" ? (
                      <video src={post.mediaUrl} className="absolute inset-0 w-full h-full object-cover" muted />
                    ) : (
                      <img src={post.mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <ImageOff size={16} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {post.caption ? (
                    <p className="text-[11px] font-medium text-[#1c1917] leading-tight line-clamp-2">{post.caption}</p>
                  ) : (
                    <p className="text-[10px] text-stone-300 italic">No caption</p>
                  )}
                  <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-stone-100 text-stone-400 rounded-md w-fit">Expired</span>
                </div>
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DANGER ZONE ──────────────────────────────── */}
      {onDelete && (
        <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Danger Zone</label>
          <div className="p-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between shadow-sm hover:border-stone-300 transition-colors group">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#1c1917]">Delete Card</span>
              <span className="text-[9px] font-medium text-stone-500 uppercase tracking-tight mt-0.5">Permanently remove this identity</span>
            </div>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 bg-white text-stone-500 font-bold text-[10px] uppercase tracking-wider hover:bg-[#1c1917] hover:text-white rounded-lg shadow-sm transition-colors border border-stone-200 group-hover:border-[#1c1917] active:scale-95"
            >
              <Trash2 size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
