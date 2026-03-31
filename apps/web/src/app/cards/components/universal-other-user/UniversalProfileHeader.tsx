"use client";

import { ArrowLeft, Share2, MessageSquare, MapPin, Clock, UserCheck } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useCardsSearchStore } from "@/store/cards/cards.search.store";

interface HeaderProps {
  user: any;
  onBack: () => void;
}

function fmtNum(v: number): string {
  if (!v) return "0";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return String(v);
}

export default function UniversalProfileHeader({ user, onBack }: HeaderProps) {
  const {
    subscribedChannelIds,
    pendingChannelSubscribeIds,
    subscribeChannel,
    unsubscribeChannel,
    requestSubscribeChannel,
    cancelChannelSubscribeRequest,
  } = useCommunitiesStore();

  const { openChat } = useCardsSearchStore();

  const channelHandle = user?.channelHandle ? String(user.channelHandle) : null;
  const isFollowing   = channelHandle ? subscribedChannelIds.includes(channelHandle) : false;
  const isPending     = channelHandle ? pendingChannelSubscribeIds.includes(channelHandle) : false;
  const isPrivate     = !!user?.isPrivate;

  const handleSubscribe = () => {
    if (!channelHandle) return;
    if (isFollowing) {
      unsubscribeChannel(channelHandle);
    } else if (isPending) {
      cancelChannelSubscribeRequest(channelHandle);
    } else if (isPrivate) {
      requestSubscribeChannel(channelHandle);
    } else {
      subscribeChannel(channelHandle);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/cards?id=${user?.channelHandle || ""}`;
    if (navigator.share) {
      navigator.share({ title: user?.name || "Profile", url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).catch(() => {});
    }
  };

  const handleMessage = () => {
    if (user) openChat(user);
  };

  const subscribeLabel = isFollowing ? "Subscribed" : isPending ? "Pending" : isPrivate ? "Request" : "Subscribe";

  // Use card's back media as banner, fallback to gradient
  const bannerUrl = user?.mediaUrl || null;
  const location  = user?.location?.enabled && user?.location?.name ? user.location.name : null;
  const views     = user?.views ?? 0;
  const bio       = user?.bio || "";
  const name      = user?.name || "Unknown User";
  const handle    = user?.handle ? (user.handle.startsWith("@") ? user.handle : `@${user.handle}`) : "@user";
  const avatarUrl = user?.avatarUrl || null;

  return (
    <>
      {/* ── Back button ── */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-black font-bold text-[13px] transition-colors group px-2 py-1 -ml-2 rounded-lg hover:bg-stone-100/50"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      {/* ── Profile card — mirrors owner's ProfileHeader exactly ── */}
      <div className="bg-white rounded-[32px] shadow-sm mb-8 border border-stone-200/60 overflow-hidden">

        {/* Banner */}
        <div className="h-28 relative z-0 overflow-hidden">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-100 to-[#FDFBF7]">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-stone-300/20 blur-3xl" />
              <div className="absolute left-1/3 -top-4 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-4 relative z-10">

          {/* Avatar + actions row */}
          <div className="flex items-start justify-between">

            {/* Avatar — same size/shape as owner, no edit */}
            <div className="-mt-14 relative z-10">
              <div className="h-24 w-24 rounded-2xl bg-stone-100 border-[3px] border-white shadow-lg overflow-hidden flex items-center justify-center text-2xl font-black text-stone-400">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span>{name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>

            {/* Viewer actions: Share + Message + Subscribe */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200 text-stone-400 text-[11px] rounded-xl hover:bg-stone-50 hover:text-stone-500 transition-all active:scale-95"
              >
                <Share2 size={12} /> Share
              </button>
              <button
                onClick={handleMessage}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 text-stone-600 text-[11px] font-bold rounded-xl hover:bg-stone-200 transition-all active:scale-95 border border-transparent"
              >
                <MessageSquare size={12} /> Message
              </button>
              <button
                onClick={handleSubscribe}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold rounded-xl transition-all active:scale-95 border ${
                  isFollowing
                    ? "bg-white border-stone-200 text-stone-500"
                    : isPending
                    ? "bg-amber-50 border-amber-200 text-amber-600"
                    : "bg-[#1c1917] border-[#1c1917] text-white"
                }`}
              >
                {isFollowing
                  ? <><UserCheck size={12} /> Subscribed</>
                  : isPending
                  ? <><Clock size={12} /> Pending</>
                  : subscribeLabel
                }
              </button>
            </div>
          </div>

          {/* Name + handle */}
          <div className="mt-3 mb-4">
            <h2 className="text-[17px] font-semibold text-stone-700 tracking-tight leading-none">
              {name}
            </h2>
            <span className="text-[12px] text-stone-400 mt-1.5 block leading-none">
              {handle}
            </span>
          </div>

          {/* Stats row — impressions + location */}
          <div className="flex items-center gap-3 flex-wrap">
            {location && (
              <>
                <div className="flex items-center gap-1 text-stone-400">
                  <MapPin size={11} className="shrink-0" />
                  <span className="text-[12px] font-medium">{location}</span>
                </div>
                <span className="text-stone-200 text-[12px]">·</span>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-700 text-[14px]">{fmtNum(views)}</span>
              <span className="text-stone-400 text-[12px] font-medium">Impressions</span>
            </div>
          </div>

          {/* Bio — same divider + text style as owner */}
          {bio && (
            <div className="mt-5 border-t border-stone-100 pt-5">
              <p className="text-[13px] text-stone-500 leading-relaxed max-w-2xl">
                {bio}
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
