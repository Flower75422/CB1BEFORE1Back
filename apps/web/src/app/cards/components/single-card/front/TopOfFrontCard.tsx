"use client";

import { useState, useRef, useEffect } from "react";
import {
  Check, MoreVertical, UserPlus, UserCheck,
  EyeOff, Settings, Eye, Zap, Share2, Copy, Clock, MapPin,
} from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useCardsFeedStore } from "@/store/cards/cards.feed.store";

// ── Streak = consecutive days with at least one active wall post ────────
function calcStreak(wallPosts: any[]): number {
  if (!wallPosts?.length) return 0;
  const daySet = new Set(
    wallPosts.map((p: any) => new Date(p.createdAt).toDateString())
  );
  let streak = 0;
  const d = new Date();
  while (daySet.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function TopOfFrontCard({
  id,
  name, handle, channelName, channelHandle,
  views, avatarUrl, mediaUrl, location,
  onFollowToggle, isMyCardView, onEditCard,
  onHideCard, primaryInterest,
  isFlipped, isPrivate, wallPosts,
}: any) {

  // ── Store connections ────────────────────────────────────────────
  const {
    subscribedChannelIds, subscribeChannel, unsubscribeChannel,
    requestSubscribeChannel, cancelChannelSubscribeRequest,
    pendingChannelSubscribeIds,
  } = useCommunitiesStore();

  const { setActiveFilter } = useCardsFeedStore();

  // ── Derived state — all from store, no local drift ───────────────
  const isFollowing = channelHandle ? subscribedChannelIds.includes(String(channelHandle)) : false;
  const isPending   = channelHandle ? pendingChannelSubscribeIds.includes(String(channelHandle)) : false;

  // ── Local UI state ───────────────────────────────────────────────
  const [showFollowBtn, setShowFollowBtn] = useState(!isMyCardView);
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [linkCopied, setLinkCopied]       = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Display values ───────────────────────────────────────────────
  const displayName   = channelName || name || "Card";
  // Show "owned by: username" below the channel name
  const rawHandle = handle
    ? handle.replace(/^@/, "")
    : (channelHandle ? String(channelHandle) : "unknown");
  const displayHandle = rawHandle;
  // Image priority: mediaUrl (card cover) → avatarUrl → generated placeholder
  const cardImage = mediaUrl || avatarUrl || null;

  // Impressions (views formatted)
  const impressions = views >= 1_000_000
    ? `${(views / 1_000_000).toFixed(1)}m`
    : views >= 1000
    ? `${(views / 1000).toFixed(1)}k`
    : String(views || 0);

  // Streak — consecutive days with posts
  const streak = calcStreak(wallPosts);

  // ── Effects ──────────────────────────────────────────────────────

  // Auto-hide quick-follow button after subscribing; re-show on unsubscribe
  useEffect(() => {
    if (isFollowing) {
      const t = setTimeout(() => setShowFollowBtn(false), 1500);
      return () => clearTimeout(t);
    } else if (!isMyCardView) {
      setShowFollowBtn(true);
    }
  }, [isFollowing, isMyCardView]);

  // Close menu when card flips
  useEffect(() => {
    if (isFlipped) setIsMenuOpen(false);
  }, [isFlipped]);

  // Click-outside closes menu — only attached when open
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // ── Handlers ─────────────────────────────────────────────────────

  // Quick '+' subscribe button
  const handleQuickSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!channelHandle || isFollowing || isPending) return;
    if (isPrivate) {
      requestSubscribeChannel(String(channelHandle));
    } else {
      subscribeChannel(String(channelHandle));
      onFollowToggle?.();
    }
  };

  // Dropdown subscribe/unsubscribe/cancel-pending
  const handleSubscribeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!channelHandle) return;
    if (isFollowing) {
      unsubscribeChannel(String(channelHandle));
      onFollowToggle?.();
    } else if (isPending) {
      cancelChannelSubscribeRequest(String(channelHandle));
    } else if (isPrivate) {
      requestSubscribeChannel(String(channelHandle));
    } else {
      subscribeChannel(String(channelHandle));
      onFollowToggle?.();
    }
    setIsMenuOpen(false);
  };

  // Hide card
  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHideCard?.();
    setIsMenuOpen(false);
  };

  // Share card
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/cards?id=${id}`;
    if (navigator.share) {
      navigator.share({ title: displayName, url }).catch(() => {});
      setIsMenuOpen(false);
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
        setIsMenuOpen(false);
      }, 2000);
    }
  };

  // Copy card link
  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/cards?id=${id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    setIsMenuOpen(false);
  };

  // ── Subscribe button label helper ─────────────────────────────────
  const subscribeLabel = isFollowing ? "Subscribed" : isPending ? "Pending" : isPrivate ? "Request" : "Subscribe";
  const subscribeIcon = isFollowing
    ? <UserCheck size={14} className="text-green-600" />
    : isPending
    ? <Clock size={14} className="text-amber-500" />
    : <UserPlus size={14} />;

  return (
    <div className="flex items-start justify-between w-full gap-2 relative z-50">

      {/* ── LEFT: Identity ──────────────────────────────────────── */}
      <div className="flex gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-full border-2 border-[#dbdbdb] shadow-sm overflow-hidden relative group"
            style={{ background: "linear-gradient(135deg, #f0f0f0 0%, #c7c7c7 100%)" }}
          >
            {cardImage ? (
              <img
                src={cardImage}
                alt={displayName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              /* Instagram-style silhouette fallback */
              <div className="w-full h-full flex items-end justify-center pb-0 overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-[72%] h-[72%] text-white" fill="currentColor">
                  {/* Head */}
                  <circle cx="50" cy="35" r="18" />
                  {/* Body / shoulders */}
                  <ellipse cx="50" cy="85" rx="30" ry="22" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col pt-0.5 min-w-0">
          <h3 className="font-bold text-[#1c1917] text-[14px] leading-tight tracking-tight truncate pr-1">
            {displayName}
          </h3>

          {/* Impressions + Streak icon */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <Eye size={12} className="text-stone-400" />
            <span className="text-[11px] font-bold text-stone-400">{impressions} impressions</span>
            {streak >= 3 && (
              <Zap size={12} className="text-amber-400 fill-amber-400" />
            )}
          </div>

        </div>
      </div>

      {/* ── RIGHT: Actions + Menu ───────────────────────────────── */}
      <div className="flex items-center shrink-0 relative ml-1" ref={menuRef}>

        {/* 3-dot menu trigger */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen((v) => !v); }}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
            isMenuOpen ? "bg-[#F5F5F4] text-[#1c1917]" : "text-[#a8a29e] hover:bg-[#F5F5F4]"
          }`}
        >
          <MoreVertical size={18} />
        </button>

        {/* ── DROPDOWN ────────────────────────────────────────── */}
        {isMenuOpen && (
          <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-[#E7E5E4] z-[999] py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

            {/* ── LOCATION INFO ROW — shown in both menus ── */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-stone-100">
              <MapPin size={13} className="text-stone-300 shrink-0" />
              <span className="text-[11px] font-bold text-stone-400">
                {location?.enabled && location?.name ? location.name : "Global"}
              </span>
            </div>

            {isMyCardView ? (
              /* ── OWNER menu ───────────────────────────────────── */
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEditCard?.(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
                >
                  <Settings size={14} /> Edit Settings
                </button>
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
                >
                  <Share2 size={14} /> Share Card
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
                >
                  {linkCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {linkCopied ? "Copied!" : "Copy Link"}
                </button>
              </>

            ) : (
              /* ── VIEWER menu ──────────────────────────────────── */
              <>
                {/* Share Card */}
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
                >
                  {linkCopied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                  {linkCopied ? "Link Copied!" : "Share Card"}
                </button>

                {/* Subscribe / Subscribed / Pending / Request */}
                <button
                  onClick={handleSubscribeToggle}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
                >
                  {subscribeIcon}
                  {subscribeLabel}
                </button>

                {/* Hide */}
                <button
                  onClick={handleHide}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-[#57534e] hover:bg-[#FDFBF7] hover:text-[#1c1917] transition-colors"
                >
                  <EyeOff size={14} /> Hide
                </button>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
