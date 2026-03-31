"use client";

import { ArrowLeft, Info, Phone, Search, Video } from "lucide-react";

export default function ChatHeader({ user, onBack, onToggleInfo, isInfoOpen, onToggleSearch, isSearchOpen }: any) {
  return (
    <div className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggleInfo}>
          <div className="h-10 w-10 bg-stone-100 rounded-full flex items-center justify-center overflow-hidden border border-stone-200 group-hover:border-stone-300 transition-colors">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[14px] font-black text-stone-500">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] font-black text-[#1c1917] leading-none tracking-tight">
              {user?.name || "Unknown User"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-stone-400 text-[11px] font-bold">
              {user?.handle || "@user"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors">
          <Phone size={18} />
        </button>
        <button className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors">
          <Video size={18} />
        </button>
        <button
          onClick={onToggleSearch}
          className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'bg-black text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-black'}`}
        >
          <Search size={18} />
        </button>
        <button
          onClick={onToggleInfo}
          className={`p-2 rounded-full transition-colors ${isInfoOpen ? 'bg-black text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-black'}`}
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
}