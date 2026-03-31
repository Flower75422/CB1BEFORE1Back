"use client";

import { useEffect, useRef } from "react";
import { GroupMessage } from "@/store/communities/communities.store";

export default function GroupChatBody({ messages }: { messages: GroupMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#FAFAFA] flex flex-col gap-4">

      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-stone-200/50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
          Today
        </span>
      </div>

      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col max-w-[70%] ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
          {!msg.isMe && (
            <span className="text-[11px] font-bold text-stone-400 ml-1 mb-1">{msg.sender}</span>
          )}
          <div className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
            msg.isMe
              ? 'bg-[#1c1917] text-white rounded-br-sm'
              : 'bg-white border border-stone-200/60 text-[#1c1917] rounded-bl-sm'
          }`}>
            {msg.text}
          </div>
          <span className="text-[9px] font-bold text-stone-300 mt-1 mx-1 uppercase tracking-wider">{msg.time}</span>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
