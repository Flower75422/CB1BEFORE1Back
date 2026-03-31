"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Shuffle } from "lucide-react";

const COMMUNITY_TOPICS = [
  "Technology", "Business", "Design", "Marketing",
  "Web3", "Science", "Health", "Finance",
  "Education", "Art", "Gaming", "Crypto",
];

const DEFAULT_PINNED = ["Technology", "Design", "Business"];

interface TopicPoolProps {
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  activeType: "Groups" | "Channels";
}

export default function TopicPool({ activeTopic, setActiveTopic, activeType }: TopicPoolProps) {
  const [isPoolOpen, setIsPoolOpen] = useState(false);

  // ── Separate pinned topics per view type ──────────────────────────
  const [pinnedByType, setPinnedByType] = useState<Record<"Groups" | "Channels", string[]>>({
    Groups: [...DEFAULT_PINNED],
    Channels: [...DEFAULT_PINNED],
  });

  const [shuffledTopics, setShuffledTopics] = useState([...COMMUNITY_TOPICS]);
  const [isAnimating, setIsAnimating] = useState(false);
  const poolRef = useRef<HTMLDivElement>(null);

  // Current type's pinned list
  const pinnedTopics = pinnedByType[activeType];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (poolRef.current && !poolRef.current.contains(e.target as Node)) {
        setIsPoolOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic "My" tab
  const myTab = activeType === "Channels" ? "My Channels" : "My Groups";
  const CORE_TABS = ["Feed", "Following", myTab];

  // Add topic — stays open so user can pick multiple
  const addTopic = (topic: string) => {
    if (!pinnedTopics.includes(topic)) {
      setPinnedByType((prev) => ({
        ...prev,
        [activeType]: [...prev[activeType], topic],
      }));
    }
    setActiveTopic(topic);
    // ← pool stays open intentionally
  };

  // Remove pinned topic
  const removeTopic = (topic: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedByType((prev) => ({
      ...prev,
      [activeType]: prev[activeType].filter((t) => t !== topic),
    }));
    if (activeTopic === topic) setActiveTopic("Feed");
  };

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setShuffledTopics((prev) => [...prev].sort(() => Math.random() - 0.5));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const availableTopics = shuffledTopics.filter((t) => !pinnedTopics.includes(t));

  return (
    <div className="flex items-center w-full gap-3">

      {/* ── Pill row ─────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">

        {/* Core tabs — no X */}
        {CORE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={(e) => { setActiveTopic(tab); e.currentTarget.blur(); }}
            className={`px-4 py-1.5 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap focus:outline-none ${
              activeTopic === tab
                ? "bg-stone-900 text-white border-stone-900 hover:bg-stone-900 hover:border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
            }`}
          >
            {tab}
          </button>
        ))}

        {/* Pinned topics for this view type — with X to unpin */}
        {pinnedTopics.map((topic) => (
          <button
            key={topic}
            onClick={(e) => { setActiveTopic(topic); e.currentTarget.blur(); }}
            className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap focus:outline-none ${
              activeTopic === topic
                ? "bg-stone-900 text-white border-stone-900 hover:bg-stone-900 hover:border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
            }`}
          >
            {topic}
            <span
              onClick={(e) => removeTopic(topic, e)}
              className={`rounded-full p-0.5 transition-colors ${
                activeTopic === topic ? "hover:bg-white/20" : "hover:bg-stone-100"
              }`}
            >
              <X size={9} />
            </span>
          </button>
        ))}
      </div>

      {/* ── Sparkles trigger + inline dropdown ────────────────────── */}
      <div className="shrink-0 relative" ref={poolRef}>
        <button
          onClick={() => setIsPoolOpen((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium active:scale-95 transition-all text-[11px] ${
            isPoolOpen
              ? "bg-amber-50 border-amber-300 text-amber-600"
              : "bg-gradient-to-tr from-amber-50 to-orange-50 border-amber-200 text-amber-600 hover:border-amber-300"
          }`}
        >
          <Sparkles size={14} />
          <span>Interests</span>
        </button>

        {/* Dropdown pool */}
        {isPoolOpen && (
          <div className="absolute right-0 top-full mt-2 w-[300px] bg-white border border-stone-200 shadow-2xl rounded-2xl p-4 z-[999] animate-in fade-in zoom-in-95 duration-200 origin-top-right">

            {/* Header + Shuffle */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                <span className="text-[11px] font-medium text-stone-600 uppercase tracking-widest">Discover Topics</span>
              </div>
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1.5 text-[10px] font-medium text-stone-500 hover:text-stone-900 transition-colors bg-stone-50 border border-stone-200 hover:border-stone-300 px-2.5 py-1.5 rounded-lg shadow-sm active:scale-95"
              >
                <Shuffle size={11} className={isAnimating ? "animate-spin" : ""} /> Shuffle
              </button>
            </div>

            {/* Topic pills */}
            <div className={`flex flex-wrap gap-2 transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              {availableTopics.map((topic, i) => (
                <button
                  key={topic}
                  onClick={() => addTopic(topic)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium border bg-white text-stone-700 border-stone-200 hover:border-stone-900 hover:bg-stone-50 transition-all shadow-sm animate-in fade-in zoom-in-95 duration-200"
                  style={{ animationDelay: `${i * 5}ms` }}
                >
                  {topic}
                </button>
              ))}
              {availableTopics.length === 0 && (
                <span className="text-[11px] text-stone-400 py-1">All topics pinned!</span>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-stone-100 text-center">
              <span className="text-[9px] font-medium text-stone-400 uppercase tracking-widest">
                Select topics to pin · click outside to close
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
