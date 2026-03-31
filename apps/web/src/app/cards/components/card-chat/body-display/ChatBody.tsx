"use client";

import { useEffect, useRef } from "react";

interface Message {
  id: number | string;
  text: string;
  sender: string;
  time: string;
}

export default function ChatBody({ messages = [] }: { messages?: Message[] }) {
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

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-stone-400 text-[12px] font-semibold">
          No messages yet. Say hello!
        </div>
      )}

      {messages.map((msg) => {
        // Support both isSender (new chatsStore format) and sender === "me" (legacy)
        const isMe = msg.isSender ?? (msg.sender === "me");
        return (
          <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`px-4 py-3 text-[13px] font-medium leading-relaxed shadow-sm ${
              isMe
                ? 'bg-[#1c1917] text-white rounded-2xl rounded-tr-sm'
                : 'bg-white border border-stone-200/60 text-[#1c1917] rounded-2xl rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
            <span className="text-[9px] font-bold text-stone-400 mt-1 mx-1 uppercase tracking-wider">
              {msg.time}
            </span>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
