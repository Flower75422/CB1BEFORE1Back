"use client";

import { useEffect, useRef } from "react";
import { Pin } from "lucide-react";
import { type Broadcast } from "@/store/communities/communities.store";

interface ChannelChatBodyProps {
  messages: Broadcast[];
  pinnedBroadcast?: Broadcast | null;
}

export default function ChannelChatBody({ messages, pinnedBroadcast }: ChannelChatBodyProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

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

      {/* Pinned broadcast banner */}
      {pinnedBroadcast && (
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl mb-2">
          <Pin size={13} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Pinned Broadcast</p>
            <p className="text-[12px] text-stone-700 leading-relaxed line-clamp-2">{pinnedBroadcast.text}</p>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className="flex flex-col max-w-[85%] self-start items-start">
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
