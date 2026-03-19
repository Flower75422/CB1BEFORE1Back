"use client";

import { useState, useRef } from "react";
import { Send, Trash2, ImagePlus, Pin, Clock, X, Image as ImageIcon, Film } from "lucide-react";

export default function WallPostsStep({ card, updateCard }: any) {
  const [newPostContent, setNewPostContent] = useState("");
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  
  const [isPinned, setIsPinned] = useState(false);
  const [expiresIn24h, setExpiresIn24h] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const posts = card.wallPosts || [];

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

  const removePendingMedia = () => {
    setMediaData(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddPost = () => {
    if (!mediaData) return;
    
    const post = {
      id: `post_${Date.now()}`,
      content: newPostContent.trim(),
      mediaUrl: mediaData,
      mediaType: mediaType,
      isPinned: isPinned,
      expiresIn24h: expiresIn24h,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    updateCard({ wallPosts: [post, ...posts] });
    
    setNewPostContent("");
    removePendingMedia();
    setIsPinned(false);
    setExpiresIn24h(false);
  };

  const togglePostSetting = (id: string, setting: "isPinned" | "expiresIn24h") => {
    const updatedPosts = posts.map((p: any) => 
      p.id === id ? { ...p, [setting]: !p[setting] } : p
    );
    updateCard({ wallPosts: updatedPosts });
  };

  const handleDeletePost = (id: string) => {
    updateCard({ wallPosts: posts.filter((p: any) => p.id !== id) });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300 h-full pb-6 mt-2">
      
      {/* ADD NEW POST SECTION */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex justify-between">
          <span>New Wall Post</span>
          {!mediaData && <span className="text-red-400">Media Required*</span>}
        </label>
        
        <div className="flex flex-col gap-3 bg-[#F5F5F4] p-3 rounded-xl border border-stone-200 focus-within:border-black transition-colors">
          
          <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Add a caption... (Image or Video is required to post)"
            className="w-full bg-transparent text-[13px] font-bold text-[#1c1917] outline-none resize-none h-12 placeholder:text-stone-400"
          />

          {mediaData && (
            <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden border border-stone-200 group">
              {mediaType === "video" ? (
                <video src={mediaData} className="w-full h-full object-cover opacity-90" controls />
              ) : (
                <img src={mediaData} alt="Preview" className="w-full h-full object-cover" />
              )}
              <button 
                onClick={removePendingMedia}
                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-stone-500 hover:text-black hover:bg-stone-200 rounded-lg transition-colors"
                title="Add Image or Video"
              >
                <ImagePlus size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*,video/*" 
                onChange={handleFileSelect} 
              />

              <div className="h-4 w-[1px] bg-stone-300 mx-1"></div>
              
              <button 
                onClick={() => setIsPinned(!isPinned)}
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${isPinned ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:bg-stone-200'}`}
                title="Pin to top"
              >
                <Pin size={14} className={isPinned ? "fill-amber-700" : ""} />
              </button>
              
              <button 
                onClick={() => setExpiresIn24h(!expiresIn24h)}
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${expiresIn24h ? 'bg-blue-100 text-blue-700' : 'text-stone-400 hover:bg-stone-200'}`}
                title="Display for 1 day only"
              >
                <Clock size={14} />
              </button>
            </div>

            <button 
              onClick={handleAddPost}
              disabled={!mediaData}
              className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors active:scale-95"
            >
              <Send size={12} strokeWidth={2.5} /> Post
            </button>
          </div>
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* POSTS HISTORY SECTION */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Post History</label>
          <span className="text-[9px] font-black text-stone-400 uppercase">{posts.length} Posts</span>
        </div>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1 pb-4">
          {sortedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-stone-300 gap-2 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
              <ImageIcon size={24} strokeWidth={1.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">No media posted yet</span>
            </div>
          ) : (
            sortedPosts.map((post: any) => (
              <div key={post.id} className="group flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-stone-300 transition-colors shadow-sm">
                
                <div className="relative w-full h-48 bg-stone-100 border-b border-stone-100">
                  {post.mediaType === "video" ? (
                    <video src={post.mediaUrl} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={post.mediaUrl} alt="Post media" className="w-full h-full object-cover" />
                  )}
                  
                  <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                    {post.isPinned && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-400 text-amber-950 text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
                        <Pin size={10} className="fill-amber-950" /> Pinned
                      </span>
                    )}
                    {post.expiresIn24h && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
                        <Clock size={10} /> 24H
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-2">
                  {post.content && (
                    <p className="text-[12px] font-medium text-[#1c1917] leading-relaxed break-words">
                      {post.content}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-stone-100">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tight">{post.createdAt}</span>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => togglePostSetting(post.id, "isPinned")}
                        className={`p-1.5 rounded hover:bg-stone-100 transition-colors ${post.isPinned ? "text-amber-600" : "text-stone-400"}`}
                        title={post.isPinned ? "Unpin post" : "Pin post"}
                      >
                        <Pin size={14} className={post.isPinned ? "fill-amber-600" : ""} />
                      </button>
                      
                      <button 
                        onClick={() => togglePostSetting(post.id, "expiresIn24h")}
                        className={`p-1.5 rounded hover:bg-stone-100 transition-colors ${post.expiresIn24h ? "text-blue-600" : "text-stone-400"}`}
                        title={post.expiresIn24h ? "Remove 1-day limit" : "Set to expire in 1 day"}
                      >
                        <Clock size={14} />
                      </button>
                      
                      <div className="w-[1px] h-4 bg-stone-200 mx-1"></div>

                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                        title="Delete post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}