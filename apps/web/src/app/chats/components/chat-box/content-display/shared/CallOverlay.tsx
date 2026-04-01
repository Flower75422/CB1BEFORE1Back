"use client";
import { PhoneOff, Video, Phone } from "lucide-react";

interface CallOverlayProps {
  isOpen: boolean;
  callerName?: string;
  callType?: "voice" | "video";
  onClose: () => void;
}

export default function CallOverlay({ isOpen, callerName = "Unknown", callType = "voice", onClose }: CallOverlayProps) {
  if (!isOpen) return null;
  const isVideo = callType === "video";
  return (
    <div className="absolute inset-0 z-[100] bg-[#1c1917]/95 flex flex-col items-center justify-center text-white backdrop-blur-md animate-in fade-in duration-200 rounded-inherit">
      {/* Call type badge */}
      <div className="flex items-center gap-1.5 mb-4 bg-white/10 px-3 py-1 rounded-full">
        {isVideo ? <Video size={12} className="text-blue-400" /> : <Phone size={12} className="text-green-400" />}
        <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{isVideo ? "Video Call" : "Voice Call"}</span>
      </div>

      {/* Avatar */}
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-full bg-stone-700 flex items-center justify-center text-3xl font-black text-stone-300">
          {callerName.charAt(0)}
        </div>
        <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
        <span className="absolute -inset-3 rounded-full border border-white/10 animate-ping [animation-delay:300ms]" />
      </div>

      <p className="text-[20px] font-black tracking-tight mb-1">{callerName}</p>
      <p className="text-[12px] text-stone-400 font-medium mb-10 animate-pulse">
        {isVideo ? "Starting video call..." : "Calling..."}
      </p>

      <button
        onClick={onClose}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-8 py-3.5 rounded-full text-[13px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
      >
        <PhoneOff size={16} /> End Call
      </button>
    </div>
  );
}
