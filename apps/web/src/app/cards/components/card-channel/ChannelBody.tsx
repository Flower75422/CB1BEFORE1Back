"use client";

import { useEffect, useRef } from "react";
import { useCommunitiesStore } from "@/store/communities/communities.store";

interface Broadcast {
  id?: string | number;
  text: string;
  time: string;
  isMe?: boolean;
}

export default function ChannelBody({ channelId, messages: propMessages }: { channelId?: string; messages?: Broadcast[] }) {
  const { channelBroadcasts } = useCommunitiesStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Prefer prop messages (already filtered by search), otherwise read from store
  const storeBroadcasts: Broadcast[] = channelId ? (channelBroadcasts[channelId] || []) : [];
  const messages = propMessages ?? storeBroadcasts;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#FAFAFA] flex flex-col gap-4">

      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-stone-200/50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
          Channel Created
        </span>
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-stone-400 text-[12px] font-semibold py-8">
          No broadcasts yet. The channel owner hasn't posted anything.
        </div>
      )}

      {messages.map((msg, i) => (
        <div key={msg.id ?? i} className="flex flex-col max-w-[85%] self-start items-start">
          <div className="px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm bg-white border border-stone-200/60 text-[#1c1917] rounded-bl-sm">
            {msg.text}
          </div>
          <span className="text-[9px] font-bold text-stone-300 mt-1 mx-1 uppercase tracking-wider">{msg.time}</span>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
