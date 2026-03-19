"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Plus, 
  Check, 
  MoreVertical, 
  Heart, 
  FileText, 
  UserPlus, 
  ShieldAlert, 
  Ban,
  EyeOff,
  Eye
} from "lucide-react";

export default function TopOfFrontCard({ 
  name, 
  handle, 
  views, 
  likes, 
  posts, 
  avatarUrl,
  isFollowed,       // 👈 NEW: Received from Feed.tsx
  onFollowToggle    // 👈 NEW: Received from Feed.tsx
}: any) {
  
  // 1. Initialize state based on whether we already follow them
  const [isFollowing, setIsFollowing] = useState(isFollowed || false);
  const [showFollowBtn, setShowFollowBtn] = useState(!isFollowed); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const safeName = name || "User";
  const safeHandle = handle || "@unknown";
  
  const finalAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=F5F5F4&color=78716c`;

  // 2. Hide button 1.5 seconds after following
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFollowing && showFollowBtn) {
      timer = setTimeout(() => {
        setShowFollowBtn(false);
      }, 1500); 
    }
    return () => clearTimeout(timer);
  }, [isFollowing, showFollowBtn]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. The Click Handler
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the card from flipping when you click follow
    setIsFollowing(true);
    
    // Trigger the global state update in Feed.tsx
    if (onFollowToggle) {
      onFollowToggle(); 
    }
  };

  return (
    <div className="flex items-start justify-between w-full gap-2 relative z-50">
      
      {/* LEFT SIDE: Avatar + Text */}
      <div className="flex gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full border border-[#E7E5E4] shadow-sm overflow-hidden bg-stone-100 relative group">
             <img 
               src={finalAvatar} 
               alt={safeName}
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             />
          </div>
        </div>

        <div className="flex flex-col pt-0.5 min-w-0">
          <h3 className="font-bold text-[#1c1917] text-[14px] leading-tight tracking-tight truncate pr-1">
            {safeName}
          </h3>
          <p className="text-[11px] text-[#a8a29e] font-medium mb-1.5 truncate">
            {safeHandle}
          </p>
          <div className="flex items-center gap-2.5 text-[#a8a29e] text-[10px] font-bold tracking-tight">
            <div className="flex items-center gap-1 group shrink-0">
              <Eye size={12} className="text-[#d6d3d1]" />
              <span>{views || 0}</span>
            </div>
            <div className="w-[2px] h-[2px] rounded-full bg-[#E7E5E4] shrink-0"></div>
            <div className="flex items-center gap-1 group shrink-0">
              <Heart size={12} className="text-[#d6d3d1]" />
              <span>{likes || 0}</span>
            </div>
            <div className="w-[2px] h-[2px] rounded-full bg-[#E7E5E4] shrink-0"></div>
            <div className="flex items-center gap-1 group shrink-0">
              <FileText size={12} className="text-[#d6d3d1]" />
              <span>{posts || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Buttons */}
      <div className="flex items-center gap-0 shrink-0 relative" ref={menuRef}>
        
        {/* Follow Button */}
        <div className={`transition-all duration-500 ${showFollowBtn ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0'}`}>
          {showFollowBtn && (
            <button 
              onClick={handleFollowClick} // 👈 USING THE NEW HANDLER HERE
              disabled={isFollowing}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 -mr-2 relative z-10 ${
                isFollowing 
                  ? "bg-[#1c1917] text-white shadow-sm cursor-default" 
                  : "text-[#a8a29e] hover:bg-[#F5F5F4] hover:text-[#1c1917]"
              }`}
            >
              {isFollowing ? <Check size={16} strokeWidth={2.5} /> : <Plus size={18} />}
            </button>
          )}
        </div>
        
        {/* Menu Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents card flip when opening menu
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
            isMenuOpen ? "bg-[#F5F5F4] text-[#1c1917]" : "text-[#a8a29e] hover:bg-[#F5F5F4]"
          }`}
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl border border-[#E7E5E4] z-[999] py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors">
              <Heart size={14} /> Like
            </button>
            
            {/* If they are already followed, show 'Unfollow' in the menu instead of Connect */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onFollowToggle) onFollowToggle(); // Triggers unfollow
                setIsFollowing(false);
                setShowFollowBtn(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
            >
              <UserPlus size={14} /> {isFollowed || isFollowing ? "Unfollow" : "Connect"}
            </button>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors">
              <EyeOff size={14} /> Hide
            </button>
            
            <div className="h-px bg-[#E7E5E4] my-1 mx-2"></div>
            
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 transition-colors">
              <ShieldAlert size={14} /> Spam
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 transition-colors">
              <Ban size={14} /> Block
            </button>
          </div>
        )}
      </div>
    </div>
  );
}