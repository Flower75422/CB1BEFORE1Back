"use client";

import { ArrowLeft, Hash, Info, Search } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export default function ChannelChatTop({ channel, onClose, onToggleInfo, isInfoOpen, onToggleSearch, isSearchOpen }: any) {
  const { myChannels } = useCommunitiesStore();
  const storeChannel = myChannels.find(c => c.id === String(channel?.id));
  const avatarUrl = storeChannel?.avatarUrl ?? channel.avatarUrl;
  const displayTitle = storeChannel?.name ?? channel.title;

  return (
    <div className="h-16 bg-white border-b border-stone-100 flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onClose}
          className="p-2 text-stone-400 hover:bg-stone-100 hover:text-black rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={onToggleInfo}>
          <div className="h-10 w-10 bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayTitle} className="w-full h-full object-cover" />
              : <Hash size={20} className="text-stone-500" />
            }
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] font-black text-[#1c1917] leading-none tracking-tight">
              {displayTitle}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-stone-400">{channel.subs} Subscribers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
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