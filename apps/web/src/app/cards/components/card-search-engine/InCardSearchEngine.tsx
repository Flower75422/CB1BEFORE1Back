"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import InputDisplayStyle from "./InputDisplayStyle";
import OutputDisplayStyle from "./OutputDisplayStyle";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export type FilterType = "people" | "channels" | "interest pool";

export default function InCardSearchEngine() {
  const { openChannel, openProfile } = useCardsSearchStore();
  const { globalFeed, followedCards, interestPool } = useCardsFeedStore();
  const { myChannels } = useCommunitiesStore();

  const [query, setQuery]             = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("people");
  const [isOpen, setIsOpen]           = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── People: all global-feed cards ──────────────────────────────────────────
  const allPeople = useMemo(() =>
    [...globalFeed, ...followedCards].map((c) => ({
      id:       c.id,
      name:     c.name,
      handle:   c.handle?.startsWith("@") ? c.handle : `@${c.handle || c.id}`,
      avatarUrl: c.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || "U")}&background=F5F5F4&color=78716c`,
      bio:      c.bio,
      wallPosts: c.wallPosts,
      views:    c.stats?.views,
      location: c.location,
      mediaUrl: c.backMediaUrl,
      channelName:   c.channel?.name,
      channelHandle: c.channel?.id,
      isPrivate:     !(c.channel?.isPublic ?? true),
    })),
  [globalFeed, followedCards]);

  // ── Channels: communities store + global-feed channel names ──────────────
  const allChannels = useMemo(() => {
    const fromCommunities = myChannels.map((c) => ({
      id:      c.id,
      name:    c.name,
      handle:  c.handle,
      members: c.members >= 1000 ? `${(c.members / 1000).toFixed(1)}k` : String(c.members),
      avatarUrl: c.avatarUrl,
      bio:     c.desc,
      isPrivate: c.isPrivate,
      isOwner: true,
    }));
    const fromFeed = globalFeed
      .filter((c) => c.channel?.name)
      .map((c) => ({
        id:      c.channel?.id || c.id,
        name:    c.channel?.name || c.name,
        handle:  `@${c.channel?.id || c.id}`,
        members: c.stats?.views
          ? c.stats.views >= 1000 ? `${(c.stats.views / 1000).toFixed(1)}k` : String(c.stats.views)
          : "0",
        avatarUrl: c.avatarUrl,
        bio:     c.bio,
        isPrivate: !(c.channel?.isPublic ?? true),
        isOwner: false,
      }));
    // Deduplicate by id
    const seen = new Set<string>();
    return [...fromCommunities, ...fromFeed].filter((c) => {
      if (seen.has(String(c.id))) return false;
      seen.add(String(c.id));
      return true;
    });
  }, [myChannels, globalFeed]);

  // ── Interest pool: from store, fallback to master list ───────────────────
  const MASTER = ["Artificial Intelligence", "UI/UX Design", "Web3", "SaaS", "Venture Capital",
    "Machine Learning", "Frontend", "Backend", "DevOps", "Crypto", "Digital Art", "Startups"];
  const allInterests = useMemo(() => {
    const pool = interestPool.length > 0 ? interestPool : MASTER;
    return pool.map((name, i) => {
      // Stable deterministic post count from name hash
      let h = 0;
      for (let j = 0; j < name.length; j++) h = (h * 31 + name.charCodeAt(j)) & 0xffff;
      const postCount = 100 + (h % 9900);
      return {
        id:    `int_${i}`,
        name,
        posts: postCount >= 1000 ? `${(postCount / 1000).toFixed(1)}k` : String(postCount),
      };
    });
  }, [interestPool]);

  // ── Search ─────────────────────────────────────────────────────────────────
  const getResults = () => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    if (activeFilter === "people")
      return allPeople
        .filter((p) => p.name?.toLowerCase().includes(q) || p.handle?.toLowerCase().includes(q))
        .slice(0, 6);
    if (activeFilter === "channels")
      return allChannels
        .filter((c) => c.name?.toLowerCase().includes(q) || c.handle?.toLowerCase().includes(q))
        .slice(0, 6);
    if (activeFilter === "interest pool")
      return allInterests
        .filter((i) => i.name.toLowerCase().includes(q))
        .slice(0, 6);
    return [];
  };

  const handleItemClick = (item: any) => {
    setIsOpen(false);
    setQuery("");

    if (activeFilter === "people") {
      openProfile({
        name:      item.name,
        handle:    item.handle,
        avatarUrl: item.avatarUrl,
        bio:       item.bio,
        wallPosts: item.wallPosts,
        views:     item.views,
        location:  item.location,
        mediaUrl:  item.mediaUrl,
        channelName:   item.channelName,
        channelHandle: item.channelHandle,
        isPrivate:     item.isPrivate,
      });
    } else if (activeFilter === "channels") {
      openChannel({
        channelName: item.name,
        handle:      item.handle,
        bio:         item.bio,
        avatarUrl:   item.avatarUrl,
        isPrivate:   item.isPrivate,
        isOwner:     item.isOwner ?? false,
      });
    }
    // interest pool: no overlay yet — could open a topic feed in future
  };

  return (
    <div ref={containerRef} className="relative w-64 hidden lg:block font-sans z-50">
      <InputDisplayStyle
        query={query}
        onQueryChange={(val) => { setQuery(val); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="absolute top-full mt-2 w-[320px] right-0 bg-white border border-stone-200 shadow-xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex p-1.5 gap-1 bg-stone-50 border-b border-stone-100">
            {(["people", "channels", "interest pool"] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeFilter === filter
                    ? "bg-white text-[#1c1917] shadow-sm border border-stone-200/60"
                    : "text-stone-400 hover:text-[#1c1917] hover:bg-stone-200/30 border border-transparent"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="p-2 max-h-64 overflow-y-auto no-scrollbar">
            <OutputDisplayStyle
              results={getResults()}
              query={query}
              activeFilter={activeFilter}
              onResultClick={handleItemClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
