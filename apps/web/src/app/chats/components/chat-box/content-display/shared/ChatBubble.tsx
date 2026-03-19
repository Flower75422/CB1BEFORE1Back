"use client";
export default function ChatBubble({ message, time, isSender }: any) {
  return (
    <div className={`flex flex-col ${isSender ? "items-end" : "items-start"} mb-4 group`}>
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${isSender ? "bg-[#1c1917] text-white rounded-tr-sm" : "bg-white text-[#1c1917] border border-stone-200/60 rounded-tl-sm"}`}>
        <p className="font-medium">{message}</p>
      </div>
      <span className="text-[9px] font-black text-stone-400 mt-1 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity px-1">{time}</span>
    </div>
  );
}