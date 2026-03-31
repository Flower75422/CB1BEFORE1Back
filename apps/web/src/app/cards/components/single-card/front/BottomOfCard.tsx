"use client";

import { Lock, Image, Film } from "lucide-react";

interface BottomOfCardProps {
  id: string;
  onFlip: () => void;
  onOpenChannel: () => void;
  onOpenChat: () => void;
  permissions?: any;
  wallPosts?: any[];
  onFlipHoverStart?: () => void;
  onFlipHoverEnd?: () => void;
}

export default function BottomOfCard({
  id, onFlip, onOpenChannel, onOpenChat,
  permissions, wallPosts,
  onFlipHoverStart, onFlipHoverEnd,
}: BottomOfCardProps) {
  const allowChat = permissions?.allowChat !== false;

  // Find first active (non-expired) post to determine media type icon
  const now = Date.now();
  const activePost = (wallPosts || []).find((p: any) =>
    !p.expiresAt || new Date(p.expiresAt).getTime() > now
  ) ?? null;
  const hasPost  = !!activePost;
  const isVideo  = activePost?.mediaType === "video";

  const btnCls = "flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-[#1c1917] text-[10px] font-bold uppercase tracking-wide transition-all border border-transparent hover:border-stone-200";
  const lockedCls = "flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-stone-50/50 text-stone-300 text-[10px] font-bold uppercase tracking-wide border border-dashed border-stone-200 cursor-not-allowed select-none";

  return (
    <div className="flex gap-1.5 pt-0.5 mt-auto w-full">

      {allowChat ? (
        <button onClick={(e) => { e.stopPropagation(); onOpenChat?.(); }} className={btnCls}>
          Chat
        </button>
      ) : (
        <div className={lockedCls} title="Chat disabled">
          <Lock size={9} strokeWidth={2.5} /> Chat
        </div>
      )}

      <button onClick={(e) => { e.stopPropagation(); onOpenChannel?.(); }} className={btnCls}>
        Channel
      </button>

      {/* Flip — shows tiny Image or Film icon when active post exists */}
      <button
        onClick={(e) => { e.stopPropagation(); onFlip?.(); }}
        onMouseEnter={onFlipHoverStart}
        onMouseLeave={onFlipHoverEnd}
        className={btnCls}
      >
        {hasPost && (
          isVideo
            ? <Film  size={9} className="shrink-0 opacity-60" />
            : <Image size={9} className="shrink-0 opacity-60" />
        )}
        Flip
      </button>

    </div>
  );
}
