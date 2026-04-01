"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Hash, Users2 } from "lucide-react";
import { GLOBAL_DATABASE_CHANNELS } from "../display/channels/ChannelGrid";
import { GLOBAL_DATABASE_GROUPS }   from "../display/groups/GroupGrid";
import { useCommunitiesStore } from "@/store/communities/communities.store";

interface Props {
  onOpenChannelChat: (channel: any) => void;
  onOpenGroupChat:   (group: any)   => void;
}

export default function CommunitiesSearchEngine({ onOpenChannelChat, onOpenGroupChat }: Props) {
  const { myChannels, myGroups } = useCommunitiesStore();

  const [query,     setQuery]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "channels" | "groups">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setSubmitted(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── All channels: store + global ───────────────────────────────────────
  const allChannels = useMemo(() => {
    const fromMine = myChannels.map((c) => ({
      id:       String(c.id),
      title:    c.name,
      handle:   c.handle,
      subs:     c.members >= 1000 ? `${(c.members / 1000).toFixed(1)}k` : String(c.members),
      desc:     c.desc || "",
      tags:     (c.pool || []) as string[],
      category: c.category || "",
      isOwner:  true,
      avatarUrl: c.avatarUrl,
      _raw: c,
    }));
    const fromGlobal = GLOBAL_DATABASE_CHANNELS.map((c) => ({
      id:       String(c.id),
      title:    c.title,
      handle:   c.handle,
      subs:     c.subs,
      desc:     c.desc || "",
      tags:     ((c as any).topics || []) as string[],
      category: "",
      isOwner:  false,
      avatarUrl: c.avatarUrl,
      _raw: c,
    }));
    const seen = new Set<string>();
    return [...fromMine, ...fromGlobal].filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [myChannels]);

  // ── All groups: store + global ─────────────────────────────────────────
  const allGroups = useMemo(() => {
    const fromMine = myGroups.map((g) => ({
      id:       String(g.id),
      title:    g.name,
      handle:   g.handle,
      members:  g.members >= 1000 ? `${(g.members / 1000).toFixed(1)}k` : String(g.members),
      desc:     g.desc || "",
      tags:     (g.pool || []) as string[],
      category: g.category || "",
      activity: g.activity || "Active",
      isOwner:  true,
      _raw: g,
    }));
    const fromGlobal = GLOBAL_DATABASE_GROUPS.map((g) => ({
      id:       String(g.id),
      title:    g.title,
      handle:   g.handle,
      members:  g.members,
      desc:     g.desc || "",
      tags:     ((g as any).topics || []) as string[],
      category: "",
      activity: g.activity || "Active",
      isOwner:  false,
      _raw: g,
    }));
    const seen = new Set<string>();
    return [...fromMine, ...fromGlobal].filter((g) => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });
  }, [myGroups]);

  // ── Search ─────────────────────────────────────────────────────────────
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { channels: [], groups: [] };

    const matchCh = (c: typeof allChannels[0]) =>
      c.title.toLowerCase().includes(q) ||
      (c.handle || "").toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q));

    const matchGr = (g: typeof allGroups[0]) =>
      g.title.toLowerCase().includes(q) ||
      (g.handle || "").toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q) ||
      g.desc.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q));

    return {
      channels: allChannels.filter(matchCh).slice(0, 10),
      groups:   allGroups.filter(matchGr).slice(0, 10),
    };
  }, [query, allChannels, allGroups]);

  const counts = {
    channels: results.channels.length,
    groups:   results.groups.length,
    get all() { return this.channels + this.groups; },
  };
  const hasAny = counts.all > 0;

  const handleChannelClick = (item: typeof allChannels[0]) => {
    setSubmitted(false);
    setQuery("");
    // Normalize to the shape the chat container expects (title/subs/owner)
    const normalized = {
      ...item._raw,
      id: item._raw.id ?? item.id,
      title: item.title,
      subs: item.subs,
      owner: (item._raw as any).owner || (item._raw as any).ownerId || "Owner",
      desc: item.desc,
      handle: item.handle,
      avatarUrl: item.avatarUrl || (item._raw as any).avatarUrl,
      isPrivate: (item._raw as any).isPrivate ?? false,
    };
    onOpenChannelChat(normalized);
  };

  const handleGroupClick = (item: typeof allGroups[0]) => {
    setSubmitted(false);
    setQuery("");
    // Normalize to the shape the chat container expects (title/members/owner)
    const normalized = {
      ...item._raw,
      id: item._raw.id ?? item.id,
      title: item.title,
      members: item.members,
      owner: (item._raw as any).owner || (item._raw as any).ownerId || "Owner",
      desc: item.desc,
      handle: item.handle,
      avatarUrl: (item._raw as any).avatarUrl,
      activity: item.activity,
      isPrivate: (item._raw as any).isPrivate ?? false,
    };
    onOpenGroupChat(normalized);
  };

  const TABS: { key: "all" | "channels" | "groups"; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "channels", label: "Channels" },
    { key: "groups",   label: "Groups"   },
  ];

  return (
    <div ref={containerRef} className="relative w-60 hidden md:block font-sans z-50">

      {/* Input */}
      <div className="relative group">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-600 transition-colors pointer-events-none"
        />
        <input
          type="text"
          value={query}
          placeholder="Search channels & groups..."
          onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) { setSubmitted(true); setActiveTab("all"); }
            if (e.key === "Escape") { setSubmitted(false); }
          }}
          className="w-full pl-10 pr-4 py-2 bg-stone-200/40 border border-transparent hover:border-stone-200 focus:bg-white focus:border-stone-200 rounded-xl text-[13px] font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none transition-all"
        />
      </div>

      {/* ── Phase 1: typing preview ── */}
      {!submitted && query.trim() && hasAny && (
        <div className="absolute top-full mt-2 w-[320px] right-0 bg-white border border-stone-200 shadow-lg rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
          <div className="p-2">

            {results.channels.length > 0 && (
              <div className="mb-1">
                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">Channels</p>
                {results.channels.slice(0, 2).map((item) => (
                  <PreviewRow
                    key={item.id}
                    icon={<IconBox><Hash size={13} /></IconBox>}
                    title={item.title}
                    subtitle={`${item.subs} members`}
                    onClick={() => handleChannelClick(item)}
                  />
                ))}
              </div>
            )}

            {results.groups.length > 0 && (
              <div className="mb-1">
                <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">Groups</p>
                {results.groups.slice(0, 2).map((item) => (
                  <PreviewRow
                    key={item.id}
                    icon={<IconBox><Users2 size={13} /></IconBox>}
                    title={item.title}
                    subtitle={`${item.members} members`}
                    onClick={() => handleGroupClick(item)}
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

      {/* ── Phase 2: full tabbed panel ── */}
      {submitted && query.trim() && (
        <div className="absolute top-full mt-2 w-[400px] right-0 bg-white border border-stone-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">

          {/* Tabs */}
          <div className="flex border-b border-stone-100 px-2 pt-2 gap-0.5">
            {TABS.map(({ key, label }) => {
              const count = key === "all" ? counts.all : counts[key as "channels" | "groups"];
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
          <div className="p-2 max-h-[380px] overflow-y-auto no-scrollbar">

            {/* All */}
            {activeTab === "all" && (
              !hasAny
                ? <EmptyState label="results" query={query} />
                : <>
                  {results.channels.length > 0 && (
                    <Section label="Channels">
                      {results.channels.slice(0, 3).map((item) => (
                        <TabRow
                          key={item.id}
                          icon={<IconBox><Hash size={14} /></IconBox>}
                          title={item.title}
                          subtitle={`${item.subs} members`}
                          onClick={() => handleChannelClick(item)}
                        />
                      ))}
                    </Section>
                  )}
                  {results.groups.length > 0 && (
                    <Section label="Groups">
                      {results.groups.slice(0, 3).map((item) => (
                        <TabRow
                          key={item.id}
                          icon={<IconBox><Users2 size={14} /></IconBox>}
                          title={item.title}
                          subtitle={`${item.members} members · ${item.activity}`}
                          onClick={() => handleGroupClick(item)}
                        />
                      ))}
                    </Section>
                  )}
                </>
            )}

            {/* Channels */}
            {activeTab === "channels" && (
              results.channels.length === 0
                ? <EmptyState label="channels" query={query} />
                : results.channels.map((item) => (
                  <TabRow
                    key={item.id}
                    icon={<IconBox><Hash size={14} /></IconBox>}
                    title={item.title}
                    subtitle={`${item.subs} members`}
                    onClick={() => handleChannelClick(item)}
                  />
                ))
            )}

            {/* Groups */}
            {activeTab === "groups" && (
              results.groups.length === 0
                ? <EmptyState label="groups" query={query} />
                : results.groups.map((item) => (
                  <TabRow
                    key={item.id}
                    icon={<IconBox><Users2 size={14} /></IconBox>}
                    title={item.title}
                    subtitle={`${item.members} members · ${item.activity}`}
                    onClick={() => handleGroupClick(item)}
                  />
                ))
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
      {children}
    </div>
  );
}

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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-widest text-stone-300">{label}</p>
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
