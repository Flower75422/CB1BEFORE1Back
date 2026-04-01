"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import UniversalChannelHeader from "./UniversalChannelHeader";
import UniversalChannelBody from "./UniversalChannelBody";
import UniversalChannelActionBar from "./UniversalChannelActionBar";
import UniversalChannelInfoPanel from "./UniversalChannelInfoPanel";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";
import type { ChannelData } from "./channel.types";

interface UniversalChannelContainerProps {
  channel: ChannelData;
  isOwner: boolean;
  onBack: () => void;
}

export default function UniversalChannelContainer({
  channel,
  isOwner,
  onBack,
}: UniversalChannelContainerProps) {
  const [showInfo, setShowInfo]       = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { channelBroadcasts } = useCommunitiesStore();
  const { closeAllViews }     = useCardsSearchStore();

  const allBroadcasts = channelBroadcasts[channel.id] || [];

  const filteredBroadcasts = useMemo(() => {
    if (!searchQuery.trim()) return allBroadcasts;
    const q = searchQuery.toLowerCase();
    return allBroadcasts.filter((m: any) => m.text.toLowerCase().includes(q));
  }, [allBroadcasts, searchQuery]);

  // Lock background scroll while open
  useEffect(() => {
    const rootMain = document.querySelector("main");
    if (rootMain) {
      const prev = rootMain.style.overflow;
      rootMain.style.overflow = "hidden";
      return () => { rootMain.style.overflow = prev; };
    } else {
      const prev = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, []);

  const handleSearchOpen = () => {
    setShowInfo(false);   // close the panel
    setShowSearch(true);  // open the search bar
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] max-h-full min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

      {/* ── MAIN / LEFT COLUMN ──────────────────────────────────────── */}
      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? "w-2/3 border-r border-stone-200" : "w-full"}`}>

        <UniversalChannelHeader
          channel={channel}
          onBack={onBack}
          onToggleInfo={() => setShowInfo((v) => !v)}
          isInfoOpen={showInfo}
          onToggleSearch={() => { setShowSearch((v) => !v); setSearchQuery(""); }}
          isSearchOpen={showSearch}
        />

        {/* Inline search bar */}
        {showSearch && (
          <div className="px-4 py-2 bg-white border-b border-stone-100 flex items-center gap-2 shrink-0 animate-in slide-in-from-top-2 duration-200">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search broadcasts..."
              className="flex-1 h-9 bg-stone-100 rounded-full px-4 text-[12px] font-bold text-[#1c1917] placeholder:text-stone-400 outline-none border border-transparent focus:border-stone-300 focus:bg-white transition-all"
            />
            <button
              onClick={() => { setShowSearch(false); setSearchQuery(""); }}
              className="text-stone-400 hover:text-[#1c1917] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <UniversalChannelBody messages={filteredBroadcasts} channelName={channel.name} />

        <UniversalChannelActionBar channel={channel} isOwner={isOwner} />
      </div>

      {/* ── RIGHT COLUMN: INFO PANEL ─────────────────────────────────── */}
      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative">
          <UniversalChannelInfoPanel
            channel={channel}
            isOwner={isOwner}
            onCloseInfo={() => setShowInfo(false)}
            onLeave={closeAllViews}
            onSearchOpen={handleSearchOpen}
          />
        </div>
      )}

    </div>
  );
}
