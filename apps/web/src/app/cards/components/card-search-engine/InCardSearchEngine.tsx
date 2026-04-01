"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import InputDisplayStyle from "./InputDisplayStyle";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useUsersStore } from "@/store/users/users.store";
import { useRouter } from "next/navigation";
import { Hash, Users2 } from "lucide-react";

// kept for backward compat (OutputDisplayStyle still imports it)
export type FilterType = "people" | "channels" | "groups" | "interests";
type TabKey = "all" | "people" | "channels" | "groups";

export default function InCardSearchEngine() {
  const { openChannel, openProfile } = useCardsSearchStore();
  const { globalFeed } = useCardsFeedStore();
  const { myChannels, myGroups } = useCommunitiesStore();
  const { users } = useUsersStore();
  const router = useRouter();

  const [query, setQuery]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setSubmitted(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── People: real users + global-feed cards ─────────────────────────────────
  const allPeople = useMemo(() => {
    const fromUsers = users.map((u) => ({
      id:        u.id,
      name:      u.name,
      handle:    u.handle.startsWith("@") ? u.handle : `@${u.handle}`,
      avatarUrl: u.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=F5F5F4&color=78716c`,
      bio:      u.bio || "",
      tags:     [] as string[],
      // profile overlay fields — not available for raw users
      wallPosts: undefined as any,
      views: undefined as any,
      location: undefined as any,
      mediaUrl: undefined as any,
      channelName: undefined as any,
      channelHandle: undefined as any,
      isPrivate: false,
    }));
    const fromFeed = globalFeed.map((c) => ({
      id:        c.id,
      name:      c.name,
      handle:    c.handle?.startsWith("@") ? c.handle : `@${c.handle || c.id}`,
      avatarUrl: c.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || "U")}&background=F5F5F4&color=78716c`,
      bio:      c.bio || "",
      tags:     (c.pool || []) as string[],
      wallPosts:     c.wallPosts,
      views:         c.stats?.views,
      location:      c.location,
      mediaUrl:      c.backMediaUrl,
      channelName:   c.channel?.name,
      channelHandle: c.channel?.id,
      isPrivate:     !(c.channel?.isPublic ?? true),
    }));
    const seen = new Set<string>();
    return [...fromUsers, ...fromFeed].filter((p) => {
      if (seen.has(String(p.id))) return false;
      seen.add(String(p.id));
      return true;
    });
  }, [users, globalFeed]);

  // ── Channels ───────────────────────────────────────────────────────────────
  const allChannels = useMemo(() => {
    const fromMine = myChannels.map((c) => ({
      id:        c.id,
      name:      c.name,
      handle:    c.handle,
      members:   c.members >= 1000 ? `${(c.members / 1000).toFixed(1)}k` : String(c.members),
      avatarUrl: c.avatarUrl,
      bio:       c.desc || "",
      tags:      (c.pool || []) as string[],
      category:  c.category || "",
      isPrivate: c.isPrivate,
      isOwner:   true,
    }));
    const fromFeed = globalFeed
      .filter((c) => c.channel?.name)
      .map((c) => ({
        id:        c.channel?.id || c.id,
        name:      c.channel?.name || c.name,
        handle:    `@${c.channel?.id || c.id}`,
        members:   c.stats?.views >= 1000
          ? `${(c.stats.views / 1000).toFixed(1)}k`
          : String(c.stats?.views || 0),
        avatarUrl: c.avatarUrl,
        bio:       c.bio || "",
        tags:      (c.pool || []) as string[],
        category:  "",
        isPrivate: !(c.channel?.isPublic ?? true),
        isOwner:   false,
      }));
    const seen = new Set<string>();
    return [...fromMine, ...fromFeed].filter((c) => {
      if (seen.has(String(c.id))) return false;
      seen.add(String(c.id));
      return true;
    });
  }, [myChannels, globalFeed]);

  // ── Groups ─────────────────────────────────────────────────────────────────
  const allGroups = useMemo(() =>
    myGroups.map((g) => ({
      id:        g.id,
      name:      g.name,
      handle:    g.handle,
      members:   g.members >= 1000 ? `${(g.members / 1000).toFixed(1)}k` : String(g.members),
      bio:       g.desc || "",
      tags:      (g.pool || []) as string[],
      category:  g.category || "",
      activity:  g.activity || "Active",
      isPrivate: !g.permissions?.isPublic,
    })),
  [myGroups]);

  // ── Unified search ─────────────────────────────────────────────────────────
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { people: [], channels: [], groups: [] };

    return {
      people: allPeople
        .filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.handle.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 3),

      channels: allChannels
        .filter((c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 3),

      groups: allGroups
        .filter((g) =>
          g.name.toLowerCase().includes(q) ||
          g.handle.toLowerCase().includes(q) ||
          g.id.toLowerCase().includes(q) ||
          g.bio.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 3),
    };
  }, [query, allPeople, allChannels, allGroups]);

  const counts = {
    people:   results.people.length,
    channels: results.channels.length,
    groups:   results.groups.length,
  };

  // ── Click handlers ─────────────────────────────────────────────────────────
  const handlePersonClick = (item: typeof allPeople[0]) => {
    setSubmitted(false);
    setQuery("");
    openProfile({
      name:          item.name,
      handle:        item.handle,
      avatarUrl:     item.avatarUrl,
      bio:           item.bio,
      wallPosts:     item.wallPosts,
      views:         item.views,
      location:      item.location,
      mediaUrl:      item.mediaUrl,
      channelName:   item.channelName,
      channelHandle: item.channelHandle,
      isPrivate:     item.isPrivate,
    });
  };

  const handleChannelClick = (item: typeof allChannels[0]) => {
    setSubmitted(false);
    setQuery("");
    openChannel({
      channelName: item.name,
      handle:      item.handle,
      bio:         item.bio,
      avatarUrl:   item.avatarUrl,
      isPrivate:   item.isPrivate,
      isOwner:     item.isOwner,
    });
  };

  const handleGroupClick = () => {
    setSubmitted(false);
    setQuery("");
    router.push("/communities");
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "people",   label: "People"   },
    { key: "channels", label: "Channels" },
    { key: "groups",   label: "Groups"   },
  ];

  const hasAny = counts.people > 0 || counts.channels > 0 || counts.groups > 0;

  return (
    <div ref={containerRef} className="relative w-64 hidden lg:block font-sans z-50">
      <InputDisplayStyle
        query={query}
        onQueryChange={(val) => { setQuery(val); setSubmitted(false); }}
        onFocus={() => {}}
        onEnter={() => { if (query.trim()) { setSubmitted(true); setActiveTab("all"); } }}
      />

      {/* ── Phase 1: typing preview — vertical sections, 2 results each ── */}
      {!submitted && query.trim() && hasAny && (
        <div className="absolute top-full mt-2 w-[320px] right-0 bg-white border border-stone-200 shadow-lg rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2">

            {/* People */}
            {results.people.length > 0 && (
              <div className="mb-1">
                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">People</p>
                {results.people.slice(0, 2).map((item) => (
                  <PreviewRow
                    key={item.id}
                    icon={<Avatar name={item.name} avatarUrl={item.avatarUrl} />}
                    title={item.name}
                    subtitle={item.handle}
                    onClick={() => handlePersonClick(item)}
                  />
                ))}
              </div>
            )}

            {/* Channels */}
            {results.channels.length > 0 && (
              <div className="mb-1">
                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">Channels</p>
                {results.channels.slice(0, 2).map((item) => (
                  <PreviewRow
                    key={item.id}
                    icon={<IconBox><Hash size={13} /></IconBox>}
                    title={item.name}
                    subtitle={`${item.members} members`}
                    onClick={() => handleChannelClick(item)}
                  />
                ))}
              </div>
            )}

            {/* Groups */}
            {results.groups.length > 0 && (
              <div className="mb-1">
                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">Groups</p>
                {results.groups.slice(0, 2).map((item) => (
                  <PreviewRow
                    key={item.id}
                    icon={<IconBox><Users2 size={13} /></IconBox>}
                    title={item.name}
                    subtitle={`${item.members} members`}
                    onClick={handleGroupClick}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Enter hint */}
          <div className="border-t border-stone-100 px-4 py-2 flex items-center justify-end gap-1.5">
            <span className="text-[10px] text-stone-300">Press</span>
            <kbd className="text-[10px] text-stone-400 bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5 font-mono leading-none">↵ Enter</kbd>
            <span className="text-[10px] text-stone-300">to see all results</span>
          </div>
        </div>
      )}

      {/* ── Phase 2: full tabbed panel (after Enter) ── */}
      {submitted && query.trim() && (
        <div className="absolute top-full mt-2 w-[480px] right-0 bg-white border border-stone-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

          {/* Horizontal tabs */}
          <div className="flex border-b border-stone-100 px-2 pt-2 gap-0.5">
            {TABS.map(({ key, label }) => {
              const count = key === "all"
                ? counts.people + counts.channels + counts.groups
                : counts[key as keyof typeof counts];
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative px-3.5 py-2.5 text-[12px] font-semibold transition-colors rounded-t-lg ${
                    activeTab === key ? "text-stone-800" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === key ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-400"
                    }`}>
                      {count}
                    </span>
                  )}
                  {activeTab === key && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-stone-800 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab body */}
          <div className="p-2 max-h-[360px] overflow-y-auto no-scrollbar">

            {/* All tab — top 3 per section */}
            {activeTab === "all" && (
              !hasAny
                ? <EmptyState label="results" query={query} />
                : <>
                  {results.people.length > 0 && (
                    <AllSection label="People">
                      {results.people.slice(0, 3).map((item) => (
                        <TabRow key={item.id}
                          icon={<Avatar name={item.name} avatarUrl={item.avatarUrl} />}
                          title={item.name} subtitle={item.handle}
                          onClick={() => handlePersonClick(item)} />
                      ))}
                    </AllSection>
                  )}
                  {results.channels.length > 0 && (
                    <AllSection label="Channels">
                      {results.channels.slice(0, 3).map((item) => (
                        <TabRow key={item.id}
                          icon={<IconBox><Hash size={14} /></IconBox>}
                          title={item.name} subtitle={`${item.members} members`}
                          onClick={() => handleChannelClick(item)} />
                      ))}
                    </AllSection>
                  )}
                  {results.groups.length > 0 && (
                    <AllSection label="Groups">
                      {results.groups.slice(0, 3).map((item) => (
                        <TabRow key={item.id}
                          icon={<IconBox><Users2 size={14} /></IconBox>}
                          title={item.name} subtitle={`${item.members} members · ${item.activity}`}
                          onClick={handleGroupClick} />
                      ))}
                    </AllSection>
                  )}
                </>
            )}

            {/* People tab */}
            {activeTab === "people" && (
              results.people.length === 0
                ? <EmptyState label="people" query={query} />
                : results.people.map((item) => (
                  <TabRow key={item.id}
                    icon={<Avatar name={item.name} avatarUrl={item.avatarUrl} />}
                    title={item.name} subtitle={item.handle}
                    onClick={() => handlePersonClick(item)} />
                ))
            )}

            {/* Channels tab */}
            {activeTab === "channels" && (
              results.channels.length === 0
                ? <EmptyState label="channels" query={query} />
                : results.channels.map((item) => (
                  <TabRow key={item.id}
                    icon={<IconBox><Hash size={14} /></IconBox>}
                    title={item.name} subtitle={`${item.members} members`}
                    onClick={() => handleChannelClick(item)} />
                ))
            )}

            {/* Groups tab */}
            {activeTab === "groups" && (
              results.groups.length === 0
                ? <EmptyState label="groups" query={query} />
                : results.groups.map((item) => (
                  <TabRow key={item.id}
                    icon={<IconBox><Users2 size={14} /></IconBox>}
                    title={item.name} subtitle={`${item.members} members · ${item.activity}`}
                    onClick={handleGroupClick} />
                ))
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PreviewRow({ icon, title, subtitle, onClick }: {
  icon: React.ReactNode; title: string; subtitle: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-stone-50 active:bg-stone-100 transition-colors text-left"
    >
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-stone-800 truncate">{title}</p>
        <p className="text-[11px] text-stone-400 truncate">{subtitle}</p>
      </div>
    </button>
  );
}

function TabRow({ icon, title, subtitle, onClick }: {
  icon: React.ReactNode; title: string; subtitle: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 active:bg-stone-100 transition-colors text-left"
    >
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-stone-800 truncate">{title}</p>
        <p className="text-[11px] text-stone-400 truncate">{subtitle}</p>
      </div>
    </button>
  );
}

function AllSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">{label}</p>
      {children}
    </div>
  );
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden flex items-center justify-center text-[12px] font-bold text-stone-500 shrink-0">
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        : name.charAt(0)}
    </div>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
      {children}
    </div>
  );
}

function EmptyState({ label, query }: { label: string; query: string }) {
  return (
    <div className="py-8 text-center text-[11px] text-stone-300 font-bold uppercase tracking-widest">
      No {label} found for &ldquo;{query}&rdquo;
    </div>
  );
}
