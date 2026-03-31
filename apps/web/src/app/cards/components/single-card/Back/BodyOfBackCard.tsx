"use client";

import { Play, Pin, Clock, ImageOff, ImagePlus, Eye } from "lucide-react";

function isExpired(post: any): boolean {
  if (!post.expiresAt) return false;
  return Date.now() > new Date(post.expiresAt).getTime();
}

// ── Media renderer — reused across all layout cases ─────────────────────
function MediaBlock({
  src, type = "image", className = "", children
}: { src: string; type?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {type === "video" ? (
        <>
          <video src={src} className="absolute inset-0 w-full h-full object-cover opacity-90" muted loop playsInline />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
              <Play size={8} className="text-white fill-white" />
            </div>
          </div>
        </>
      ) : (
        <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {children}
    </div>
  );
}

function fmtViews(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1000)      return `${(v / 1000).toFixed(1)}k`;
  return String(v || 0);
}

export default function BodyOfBackCard({
  mediaUrl, mediaType = "image", wallPosts, isMyCardView, views = 0
}: any) {

  const visiblePosts = (wallPosts || [])
    .filter((p: any) => !isExpired(p))
    .sort((a: any, b: any) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const hasPosts    = visiblePosts.length > 0;
  const singlePost  = visiblePosts.length === 1 ? visiblePosts[0] : null;

  // ── Layout decision ────────────────────────────────────────────────────
  //
  // SIDE-BY-SIDE  card back media + single wall post (both have images)
  //               → split body 50/50, label each panel
  //
  // FULL POST     no card media + single post with image
  //               → post image fills entire body, caption overlay
  //
  // THUMB + LIST  card media + multiple posts  (or card media + 1 post no image)
  //               → card media as 60px thumbnail, posts scroll below
  //
  // CARD MEDIA    card media only, no posts
  //               → card media fills entire body
  //
  // EMPTY         nothing
  //               → owner: CTA to add wall post
  //               → viewer: muted empty state

  const sideBySide  = !!mediaUrl && !!singlePost?.mediaUrl;
  const singleFull  = !mediaUrl  && !!singlePost?.mediaUrl;

  return (
    // h-full works because BackOfCard sets an explicit pixel height on this wrapper
    <div className="h-full flex flex-col w-full gap-1.5">

      {/* ══════════════════════════════════════════════════════════════
          LAYOUT 1 — SIDE-BY-SIDE
          Card back media on the left, wall post on the right.
          Both panels get equal width. Small label badge on each.
          Best when owner sets both a card cover AND posts regularly.
      ══════════════════════════════════════════════════════════════ */}
      {sideBySide && singlePost && (
        <div className="h-full flex gap-1 rounded-xl overflow-hidden">

          {/* Left — card back media */}
          <MediaBlock src={mediaUrl} type={mediaType} className="flex-1 rounded-l-xl">
            <div className="absolute top-1.5 left-1.5 z-10">
              <span className="text-[7px] font-black uppercase tracking-wide bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                Channel
              </span>
            </div>
          </MediaBlock>

          {/* Right — wall post */}
          <MediaBlock src={singlePost.mediaUrl} type={singlePost.mediaType} className="flex-1 rounded-r-xl">
            {/* Badges */}
            <div className="absolute top-1.5 left-1.5 z-10 flex gap-1">
              <span className="text-[7px] font-black uppercase tracking-wide bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                Post
              </span>
              {singlePost.isPinned && (
                <span className="flex items-center gap-0.5 px-1 py-0.5 bg-amber-400/90 text-amber-950 text-[7px] font-black uppercase rounded-full">
                  <Pin size={6} className="fill-amber-950" />
                </span>
              )}
            </div>
            {/* Views badge */}
            <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded-full">
              <Eye size={7} className="text-white/80" />
              <span className="text-[7px] font-black text-white/90">{fmtViews(views)}</span>
            </div>
            {/* Caption overlay */}
            {singlePost.caption && (
              <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/50 backdrop-blur-sm">
                <p className="text-[8px] text-white font-medium leading-tight line-clamp-2">
                  {singlePost.caption}
                </p>
              </div>
            )}
          </MediaBlock>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          LAYOUT 2 — FULL-HEIGHT SINGLE POST
          No card back media. Single wall post fills the entire body.
          Caption overlays the bottom of the image.
      ══════════════════════════════════════════════════════════════ */}
      {singleFull && singlePost && (
        <MediaBlock src={singlePost.mediaUrl} type={singlePost.mediaType} className="h-full rounded-xl border border-stone-100">
          {/* Top badges */}
          <div className="absolute top-1.5 left-1.5 flex gap-1 z-10">
            {singlePost.isPinned && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-400/90 text-amber-950 text-[7px] font-black uppercase rounded-md">
                <Pin size={7} className="fill-amber-950" /> Pinned
              </span>
            )}
            {singlePost.expiresAt && (
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/90 text-white text-[7px] font-black uppercase rounded-md">
                <Clock size={7} /> 24H
              </span>
            )}
          </div>
          {/* Views badge */}
          <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded-full">
            <Eye size={7} className="text-white/80" />
            <span className="text-[7px] font-black text-white/90">{fmtViews(views)}</span>
          </div>
          {singlePost.caption && (
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-black/50 backdrop-blur-sm">
              <p className="text-[10px] text-white font-medium leading-tight line-clamp-2">
                {singlePost.caption}
              </p>
            </div>
          )}
        </MediaBlock>
      )}

      {/* ══════════════════════════════════════════════════════════════
          LAYOUT 3 — CARD MEDIA (full height, no posts)
      ══════════════════════════════════════════════════════════════ */}
      {mediaUrl && !hasPosts && (
        <MediaBlock src={mediaUrl} type={mediaType} className="h-full rounded-xl border border-gray-100" />
      )}

      {/* ══════════════════════════════════════════════════════════════
          LAYOUT 4 — CARD MEDIA THUMBNAIL + POSTS LIST
          Card media + multiple posts OR card media + caption-only post.
      ══════════════════════════════════════════════════════════════ */}
      {mediaUrl && hasPosts && !sideBySide && (
        <>
          <MediaBlock src={mediaUrl} type={mediaType} className="w-full h-[60px] shrink-0 rounded-xl border border-gray-100" />
          <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar max-h-full">
            {visiblePosts.map((post: any) => (
              <div
                key={post.id}
                className={`w-full rounded-xl border overflow-hidden shrink-0 ${
                  post.isPinned ? "border-amber-200 bg-amber-50/60" : "border-stone-100 bg-stone-50/60"
                }`}
              >
                {post.mediaUrl && (
                  <MediaBlock src={post.mediaUrl} type={post.mediaType} className="w-full h-[56px]">
                    {post.isPinned && (
                      <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-amber-400/90 rounded-full px-1.5 py-0.5">
                        <Pin size={7} className="text-white fill-white" />
                        <span className="text-[8px] font-bold text-white">Pinned</span>
                      </div>
                    )}
                  </MediaBlock>
                )}
                {post.caption && (
                  <div className="px-2.5 py-1 flex items-start gap-1.5">
                    {post.isPinned && !post.mediaUrl && (
                      <Pin size={8} className="text-amber-500 fill-amber-500 mt-[2px] shrink-0" />
                    )}
                    <p className="text-[10px] text-stone-600 font-medium leading-tight line-clamp-2">
                      {post.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          LAYOUT 5 — EMPTY STATE
          Owner sees a CTA encouraging them to post.
          Viewer sees a muted "no content" message.

          WHY: An empty back card feels abandoned. The owner CTA creates
          a direct loop — they flip their own card, see the prompt, and
          open settings to add a wall post. Viewers get a softer message
          so the card doesn't feel broken.
      ══════════════════════════════════════════════════════════════ */}
      {!mediaUrl && !hasPosts && (
        isMyCardView ? (
          /* Owner CTA */
          <div className="h-full flex flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
              <ImagePlus size={16} className="text-stone-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-600 leading-tight">
                Add a wall post
              </p>
              <p className="text-[9px] text-stone-400 mt-0.5 leading-snug">
                to bring this card to life
              </p>
            </div>
          </div>
        ) : (
          /* Viewer empty state */
          <div className="h-full flex flex-col items-center justify-center gap-1 opacity-25">
            <ImageOff size={18} className="text-stone-400" />
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">No content yet</span>
          </div>
        )
      )}

    </div>
  );
}
