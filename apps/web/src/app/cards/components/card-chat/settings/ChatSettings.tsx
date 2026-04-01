"use client";

import { useState, useEffect } from "react";
import { X, User, BellOff, Image as ImageIcon, ShieldAlert, UserMinus } from "lucide-react";

export default function ChatSettings({ user, onCloseInfo }: any) {
  const muteKey = `chat_muted_${user?.handle || "unknown"}`;
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(muteKey) === "true";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(muteKey, String(isMuted));
    }
  }, [isMuted, muteKey]);

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-100 shrink-0 bg-white z-20">
        <h3 className="text-[14px] font-black text-[#1c1917] uppercase tracking-wide">
          Chat Details
        </h3>
        <button onClick={onCloseInfo} className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95">
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        
        {/* Profile Info */}
        <div className="p-6 flex flex-col items-center text-center border-b border-stone-100">
          <div className="h-24 w-24 bg-stone-100 border border-stone-200 rounded-full flex items-center justify-center text-3xl font-black text-[#1c1917] mb-4 shadow-sm overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (user?.name || "U").charAt(0).toUpperCase()
            )}
          </div>
          <h2 className="text-[18px] font-black text-[#1c1917] tracking-tight">{user?.name || "User"}</h2>
          <span className="text-[12px] font-semibold text-stone-400 mt-1">{user?.handle || "@user"}</span>

          {(user?.bio || user?.description) && (
            <p className="text-[12px] text-stone-500 mt-3 leading-relaxed">{user.bio || user.description}</p>
          )}

          <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-200 rounded-full text-[11px] font-black uppercase tracking-widest text-[#1c1917] hover:bg-stone-100 transition-colors">
            <User size={14} /> View Full Profile
          </button>
        </div>

        {/* Toggles & Options */}
        <div className="p-6 pb-20 flex flex-col gap-2">
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Settings & Media</h4>
          
          <button onClick={() => setIsMuted(!isMuted)} className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors flex justify-between items-center group">
              <div className="flex items-center gap-3"><BellOff size={16} className="text-stone-500 group-hover:text-black" /><span className="text-[13px] font-bold text-[#1c1917]">Mute Notifications</span></div>
              <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isMuted ? 'bg-stone-300' : 'bg-green-500'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? 'left-1' : 'translate-x-5'}`}></div></div>
          </button>

          <div className="flex flex-col gap-1 mt-2">
            <button className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-stone-50 hover:border-stone-200 shadow-sm text-[#1c1917]"><div className="flex items-center gap-3"><div className="p-1.5 rounded-lg bg-stone-100 text-stone-500"><ImageIcon size={16} /></div><span className="text-[12px] font-bold">Shared Media</span></div></button>
          </div>

          <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 px-1 mt-6">Danger Zone</h4>
          
          <div className="flex flex-col gap-1">
            <button className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-red-50 hover:border-red-100 shadow-sm text-red-500"><div className="flex items-center gap-3"><div className="p-1.5 rounded-lg bg-red-100 text-red-500"><UserMinus size={16} /></div><span className="text-[12px] font-bold">Block User</span></div></button>
            <button className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-red-50 hover:border-red-100 shadow-sm text-red-500"><div className="flex items-center gap-3"><div className="p-1.5 rounded-lg bg-red-100 text-red-500"><ShieldAlert size={16} /></div><span className="text-[12px] font-bold">Report User</span></div></button>
          </div>

        </div>
      </div>
    </div>
  );
}