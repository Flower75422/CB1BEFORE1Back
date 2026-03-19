"use client";

import { useState } from "react";
import { Play, Eye, Heart, X, Layers } from "lucide-react";

// Mock Data: These are the expired "Back of Card" posts
const ARCHIVED_POSTS = [
  {
    id: "post_1",
    mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
    mediaType: "image",
    facet: "Software Dev",
    stats: { views: "2.4k", likes: 142 },
    date: "Oct 12, 2025"
  },
  {
    id: "post_2",
    mediaUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_24fps.mp4",
    mediaType: "video",
    facet: "Startup Founder",
    stats: { views: "8.1k", likes: 890 },
    date: "Oct 05, 2025"
  },
  {
    id: "post_3",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    mediaType: "image",
    facet: "UI/UX Design",
    stats: { views: "1.2k", likes: 95 },
    date: "Sep 28, 2025"
  },
  {
    id: "post_4",
    mediaUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60",
    mediaType: "image",
    facet: "Software Dev",
    stats: { views: "3.4k", likes: 210 },
    date: "Sep 15, 2025"
  },
  {
    id: "post_5",
    mediaUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    mediaType: "image",
    facet: "AI Researcher",
    stats: { views: "5.5k", likes: 430 },
    date: "Sep 02, 2025"
  }
];

export default function WallpostsGrid() {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <>
      {/* --- THE GRID (Matched to Group Card Layout) --- */}
      {/* Changed to 1 col on mobile, 2 on tablet, 3 on desktop with larger gap-6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        
        {ARCHIVED_POSTS.map((post) => (
          <div 
            key={post.id} 
            onClick={() => setSelectedPost(post)}
            // Changed from aspect-square to aspect-[4/3] with rounded-[24px] to match Group Cards
            className="group relative aspect-[4/3] bg-stone-100 rounded-[24px] border border-stone-200/60 overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            {/* Media Render */}
            {post.mediaType === "video" ? (
              <video src={post.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
            ) : (
              <img src={post.mediaUrl} alt={post.facet} className="w-full h-full object-cover" />
            )}

            {/* Media Type Indicator (Top Right) */}
            <div className="absolute top-4 right-4 text-white drop-shadow-md z-10 bg-black/20 p-2 rounded-full backdrop-blur-md">
              {post.mediaType === "video" ? <Play size={16} fill="currentColor" /> : <Layers size={16} />}
            </div>

            {/* Hover Overlay (Stats & Info) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
              
              {/* Facet Badge */}
              <div className="flex justify-start">
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                  {post.facet}
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-white mt-auto">
                <div className="flex items-center gap-4 font-bold text-[14px]">
                  <div className="flex items-center gap-1.5">
                    <Eye size={18} /> {post.stats.views}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={18} fill="currentColor" className="text-white group-hover:text-red-500 transition-colors duration-300" /> {post.stats.likes}
                  </div>
                </div>
                <span className="text-[12px] font-medium text-stone-300">{post.date}</span>
              </div>

            </div>
          </div>
        ))}

        {/* Empty State (If they haven't uploaded anything yet) */}
        {ARCHIVED_POSTS.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[32px] text-stone-400 bg-stone-50/50">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 mb-4">
              <Layers size={28} className="text-stone-400" />
            </div>
            <p className="font-bold text-[#1c1917] text-[16px]">No Memories Yet</p>
            <p className="text-[13px] font-medium mt-1 max-w-[250px] text-center">Upload media to the back of your cards to archive them here.</p>
          </div>
        )}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          
          <button 
            onClick={() => setSelectedPost(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 flex flex-col items-center animate-in zoom-in-95 duration-300">
            
            {/* The Expanded Media */}
            <div className="w-full flex-1 min-h-0 rounded-2xl overflow-hidden shadow-2xl bg-[#1c1917] flex items-center justify-center border border-white/10">
              {selectedPost.mediaType === "video" ? (
                <video src={selectedPost.mediaUrl} controls autoPlay className="max-w-full max-h-[80vh] object-contain" />
              ) : (
                <img src={selectedPost.mediaUrl} alt="Expanded memory" className="max-w-full max-h-[80vh] object-contain" />
              )}
            </div>

            {/* Footer Data */}
            <div className="w-full mt-5 flex items-center justify-between text-white bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div>
                <p className="text-[15px] font-bold">Archived from <span className="text-stone-300">'{selectedPost.facet}'</span> card</p>
                <p className="text-[13px] text-stone-400 font-medium mt-0.5">{selectedPost.date}</p>
              </div>
              <div className="flex items-center gap-5 text-[15px] font-bold">
                <span className="flex items-center gap-2"><Eye size={18} className="text-stone-400" /> {selectedPost.stats.views}</span>
                <span className="flex items-center gap-2"><Heart size={18} className="text-red-500" fill="currentColor" /> {selectedPost.stats.likes}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}