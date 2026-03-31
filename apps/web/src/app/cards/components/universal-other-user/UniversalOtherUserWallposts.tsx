"use client";

import { useState } from "react";
import { Play, Eye, Heart, Layers, Pin, X, ImageIcon } from "lucide-react";

interface WallPost {
  id: string;
  mediaUrl?: string;
  mediaType?: string;
  caption?: string;
  isPinned?: boolean;
  expiresAt?: string;
  createdAt?: string;
}

function isExpired(p: WallPost): boolean {
  if (!p.expiresAt) return false;
  return Date.now() > new Date(p.expiresAt).getTime();
}

export default function UniversalOtherUserWallposts({ wallPosts = [] }: { wallPosts?: WallPost[] }) {
  const [selected, setSelected] = useState<WallPost | null>(null);

  const visible = (wallPosts || [])
    .filter((p) => !isExpired(p) && !!p.mediaUrl)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  if (visible.length === 0) {
    return (
      <div className="w-full py-20 px-6 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[40px] bg-stone-50/50 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 mb-6">
          <ImageIcon className="text-stone-400" size={28} />
        </div>
        <h3 className="text-[15px] font-bold text-[#1c1917] mb-1">No Posts Yet</h3>
        <p className="text-[12px] text-stone-400 font-medium max-w-[220px] text-center">
          This user hasn't shared any posts yet.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Same grid style as WallpostsGrid on owner's profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
        {visible.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelected(post)}
            className="group relative aspect-[4/3] bg-stone-100 rounded-[24px] border border-stone-200/60 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {/* Media */}
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
            ) : (
              <img src={post.mediaUrl} alt={post.caption || "Post"} className="w-full h-full object-cover" />
            )}

            {/* Top-right type icon */}
            <div className="absolute top-4 right-4 text-white drop-shadow-md z-10 bg-black/20 p-2 rounded-full backdrop-blur-md">
              {post.mediaType === "video" ? <Play size={16} fill="currentColor" /> : <Layers size={16} />}
            </div>

            {/* Pinned badge */}
            {post.isPinned && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-0.5 bg-amber-400/90 text-amber-950 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                <Pin size={8} className="fill-amber-950" /> Pinned
              </div>
            )}

            {/* Hover overlay — caption + likes placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
              <div className="flex justify-start">
                {post.caption && (
                  <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20 shadow-sm line-clamp-1 max-w-[80%]">
                    {post.caption}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-white mt-auto">
                <div className="flex items-center gap-4 font-bold text-[14px]">
                  <div className="flex items-center gap-1.5"><Eye size={18} /> 0</div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} fill="currentColor" className="text-white group-hover:text-red-400 transition-colors duration-300" /> 0
                  </div>
                </div>
                {post.createdAt && (
                  <span className="text-[12px] font-medium text-stone-300">
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox — same as WallpostsGrid */}
      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
          >
            <X size={24} />
          </button>
          <div
            className="relative w-full max-w-5xl max-h-[90vh] mx-4 flex flex-col items-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-[#1c1917] flex items-center justify-center border border-white/10">
              {selected.mediaType === "video" ? (
                <video src={selected.mediaUrl} controls autoPlay className="max-w-full max-h-[80vh] object-contain" />
              ) : (
                <img src={selected.mediaUrl} alt={selected.caption || "Post"} className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>
            {selected.caption && (
              <div className="mt-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <p className="text-white text-[13px] font-medium">{selected.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
