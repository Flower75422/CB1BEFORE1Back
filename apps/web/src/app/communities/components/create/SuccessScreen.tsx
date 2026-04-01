"use client";
import { Check, ArrowRight, Share2, Copy } from "lucide-react";
import { useState } from "react";

interface SuccessProps {
  type: "channel" | "group";
  name: string;
  onFinish: () => void;
}

export default function SuccessScreen({ type, name, onFinish }: SuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    navigator.clipboard.writeText(`cobucket.com/${type}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-4 animate-in zoom-in-95 duration-500 max-w-md mx-auto relative">
      
      {/* 1. CELEBRATION ICON WITH RING ANIMATION */}
      <div className="relative mb-8">
        {/* Animated Rings */}
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20" />
        <div className="absolute inset-[-8px] rounded-full border border-green-50 animate-pulse" />
        
        <div className="relative w-20 h-20 bg-[#1c1917] rounded-full flex items-center justify-center shadow-2xl shadow-black/20">
          <Check size={40} className="text-white stroke-[3px]" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-[#1c1917] tracking-tight mb-2">
        {type === "channel" ? "Channel Created!" : "Group Created!"}
      </h2>
      <p className="text-[14px] text-stone-400 font-medium mb-10 px-4">
        Your new community <span className="text-[#1c1917] font-bold">"{name}"</span> is ready. You can now find it on your profile.
      </p>

      {/* 2. SHARE / LINK BOX */}
      <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-white rounded-lg border border-stone-100 shrink-0">
            <Share2 size={16} className="text-stone-400" />
          </div>
          <p className="text-[11px] font-bold text-stone-500 truncate">
            cobucket.com/{type}/{name.toLowerCase().replace(/\s+/g, '-')}
          </p>
        </div>
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all shrink-0 ml-2 ${
            copied ? "bg-green-600 text-white" : "bg-white text-[#1c1917] border border-stone-200 hover:bg-stone-50"
          }`}
        >
          {copied ? "Copied!" : <><Copy size={14} /> Copy</>}
        </button>
      </div>

      {/* 3. PRIMARY ACTION */}
      <button
        onClick={onFinish}
        className="group flex items-center gap-3 px-10 py-4 bg-[#1c1917] text-white rounded-2xl font-bold text-[15px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
      >
        Back to Communities
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* 4. OPTIONAL: CSS-ONLY FLOATING SQUARES (Confetti Alternative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-10 w-2 h-2 bg-amber-400 rounded-sm animate-bounce opacity-40" />
        <div className="absolute top-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-red-400 rotate-45 animate-bounce opacity-40" />
      </div>
    </div>
  );
}