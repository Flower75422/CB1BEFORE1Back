"use client";

import { useState } from "react";
import { Play, Eye, Heart, X, Layers } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";

export default function WallpostsGrid() {
  const { wallposts } = useProfileStore();
  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <>
      {/* 🔴 THE FIX: Enforced exactly grid-cols-3 on desktop so it is always 1 row of 3 boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
        
        {wallposts.map((post) => (
          <div 
            key={post.id} 
            onClick={() => setSelectedPost(post)}
            className="group relative aspect-[4/3] bg-stone-100 rounded-[24px] border border-stone-200/60 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
            ) : (
              <img src={post.mediaUrl} alt={post.facet} className="w-full h-full object-cover" />
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
                  <div className="flex items-center gap-1.5"><Heart size={18} fill="currentColor" className="text-white group-hover:text-red-500 transition-colors duration-300" /> {post.stats?.likes ?? 0}</div>
                </div>
                <span className="text-[12px] font-medium text-stone-300">{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox logic remains exactly the same... */}
      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          <button onClick={() => setSelectedPost(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"><X size={24} /></button>
          <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
            <div className="w-full flex-1 min-h-0 rounded-2xl overflow-hidden shadow-2xl bg-[#1c1917] flex items-center justify-center border border-white/10">
              {selectedPost.mediaType === "video" ? (
                <video src={selectedPost.mediaUrl} controls autoPlay className="max-w-full max-h-[80vh] object-contain" />
              ) : (
                <img src={selectedPost.mediaUrl} alt="Expanded memory" className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}