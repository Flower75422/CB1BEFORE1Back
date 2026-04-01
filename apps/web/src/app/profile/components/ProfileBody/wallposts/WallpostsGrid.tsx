"use client";

import { useState, useRef } from "react";
import { Play, Eye, Heart, X, Layers, MessageCircle, Share2, Bookmark, Send, Trash2, ImageIcon } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";

const fmt = (n: string | number) => {
  const v = typeof n === "string" ? parseFloat(n.replace(/[km]/gi, (m) => m.toLowerCase() === "k" ? "e3" : "e6")) : n;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
};

export default function WallpostsGrid() {
  const { wallposts, likePost, addComment, removeWallpost } = useProfileStore();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const commentInputRef = useRef<HTMLInputElement>(null);

  const openPost = (post: any) => {
    setSelectedPost(post);
    setCommentText("");
  };

  const closePost = () => {
    setSelectedPost(null);
    setCommentText("");
    setShareCopied(false);
  };

  const handleLike = (id: string) => {
    likePost(id);
    // Sync selectedPost so modal updates instantly
    setSelectedPost((prev: any) =>
      prev?.id === id
        ? {
            ...prev,
            likedByMe: !prev.likedByMe,
            stats: {
              ...prev.stats,
              likes: prev.likedByMe
                ? Math.max(0, (prev.stats.likes || 0) - 1)
                : (prev.stats.likes || 0) + 1,
            },
          }
        : prev
    );
  };

  const handleComment = () => {
    if (!commentText.trim() || !selectedPost) return;
    addComment(selectedPost.id, commentText.trim());
    // Sync selectedPost
    setSelectedPost((prev: any) => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          id: `c_${Date.now()}`,
          userId: "u_1",
          username: "You",
          text: commentText.trim(),
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        },
      ],
    }));
    setCommentText("");
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url).catch(() => {});
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleSave = (id: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Keep selectedPost in sync with store (e.g. after like)
  const livePost = selectedPost
    ? wallposts.find((p) => p.id === selectedPost.id) ?? selectedPost
    : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
        {wallposts.map((post) => (
          <div
            key={post.id}
            onClick={() => openPost(post)}
            className="group relative aspect-[4/3] bg-stone-100 rounded-[24px] border border-stone-200/60 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
            ) : post.mediaUrl ? (
              <img src={post.mediaUrl} alt={post.facet} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                <ImageIcon size={24} className="text-stone-300" />
              </div>
            )}

            <div className="absolute top-4 right-4 text-white drop-shadow-md z-10 bg-black/20 p-2 rounded-full backdrop-blur-md">
              {post.mediaType === "video" ? <Play size={16} fill="currentColor" /> : <Layers size={16} />}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
              <div className="flex justify-start">
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                  {post.facet}
                </span>
              </div>
              <div className="flex items-center justify-between text-white mt-auto">
                <div className="flex items-center gap-4 font-bold text-[14px]">
                  <div className="flex items-center gap-1.5"><Eye size={18} /> {post.stats?.views ?? 0}</div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} fill={post.likedByMe ? "currentColor" : "none"} className={post.likedByMe ? "text-red-400" : "text-white"} />
                    {post.stats?.likes ?? 0}
                  </div>
                  <div className="flex items-center gap-1.5"><MessageCircle size={18} /> {post.comments?.length ?? 0}</div>
                </div>
                <span className="text-[12px] font-medium text-stone-300">{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Post Detail Modal ── */}
      {livePost && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) closePost(); }}
        >
          <button onClick={closePost} className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10 active:scale-95">
            <X size={20} />
          </button>

          <div className="relative w-full max-w-4xl mx-4 max-h-[92vh] bg-white rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200">

            {/* Left — media */}
            <div className="md:w-[55%] bg-black flex items-center justify-center min-h-[260px]">
              {livePost.mediaType === "video" ? (
                <video src={livePost.mediaUrl} controls autoPlay className="w-full h-full max-h-[600px] object-contain" />
              ) : (
                <img src={livePost.mediaUrl} alt={livePost.facet} className="w-full h-full max-h-[600px] object-contain" />
              )}
            </div>

            {/* Right — info, comments */}
            <div className="md:w-[45%] flex flex-col overflow-hidden">

              {/* Header */}
              <div className="px-5 pt-5 pb-3 border-b border-stone-100 flex items-start justify-between">
                <div>
                  <span className="inline-block bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg mb-2">
                    {livePost.facet}
                  </span>
                  {livePost.caption && (
                    <p className="text-[13px] text-stone-700 leading-relaxed max-w-xs">{livePost.caption}</p>
                  )}
                  <span className="text-[11px] text-stone-400 mt-1.5 block">{livePost.date}</span>
                </div>
              </div>

              {/* Stats + Actions */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-4">
                  {/* Like */}
                  <button
                    onClick={() => handleLike(livePost.id)}
                    className="flex items-center gap-1.5 text-[13px] font-medium transition-all active:scale-95 group"
                  >
                    <Heart
                      size={20}
                      fill={livePost.likedByMe ? "#ef4444" : "none"}
                      className={livePost.likedByMe ? "text-red-500" : "text-stone-400 group-hover:text-red-400"}
                    />
                    <span className={livePost.likedByMe ? "text-red-500" : "text-stone-500"}>
                      {fmt(livePost.stats?.likes ?? 0)}
                    </span>
                  </button>
                  {/* Comments count */}
                  <button
                    onClick={() => commentInputRef.current?.focus()}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span>{livePost.comments?.length ?? 0}</span>
                  </button>
                  {/* Views */}
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-stone-400">
                    <Eye size={18} />
                    <span>{fmt(livePost.stats?.views ?? 0)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Save */}
                  <button
                    onClick={() => handleSave(livePost.id)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors active:scale-95"
                  >
                    <Bookmark
                      size={18}
                      fill={savedPosts.has(livePost.id) ? "#1c1917" : "none"}
                      className={savedPosts.has(livePost.id) ? "text-stone-900" : "text-stone-400"}
                    />
                  </button>
                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className={`p-1.5 rounded-lg transition-colors active:scale-95 ${shareCopied ? "text-green-500 bg-green-50" : "hover:bg-stone-100 text-stone-400"}`}
                  >
                    <Share2 size={18} />
                  </button>
                  {/* Delete (own posts only) */}
                  <button
                    onClick={() => { removeWallpost(livePost.id); closePost(); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-stone-300 hover:text-red-400 transition-colors active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-3 flex flex-col gap-3">
                {(livePost.comments?.length ?? 0) === 0 && (
                  <p className="text-[12px] text-stone-300 text-center mt-6">No comments yet. Be the first!</p>
                )}
                {(livePost.comments || []).map((c: any) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                      {c.avatarUrl
                        ? <img src={c.avatarUrl} alt={c.username} className="w-full h-full object-cover" />
                        : <span className="w-full h-full flex items-center justify-center text-[10px] font-bold text-stone-500">{c.username?.[0]}</span>
                      }
                    </div>
                    <div className="flex-1 bg-stone-50 rounded-xl px-3 py-2">
                      <span className="text-[11px] font-bold text-stone-700">{c.username} </span>
                      <span className="text-[12px] text-stone-600">{c.text}</span>
                      <p className="text-[10px] text-stone-400 mt-0.5">{c.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div className="px-4 pb-4 pt-2 border-t border-stone-100 flex items-center gap-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  placeholder="Add a comment..."
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-[12px] font-medium text-stone-700 placeholder:text-stone-400 outline-none focus:border-stone-400 transition-colors"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="p-2 rounded-xl bg-stone-900 text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
