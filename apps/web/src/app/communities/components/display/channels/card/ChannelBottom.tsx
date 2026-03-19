"use client";

interface ChannelBottomProps {
  owner: string;
  isPrivate?: boolean;
}

export default function ChannelBottom({ owner, isPrivate }: ChannelBottomProps) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-stone-50">
      {/* Owner Info moved to Bottom */}
      <div className="flex flex-col">
        <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest leading-none mb-0.5">Owned By</span>
        <span className="text-[10px] font-bold text-stone-500 truncate max-w-[100px]">{owner}</span>
      </div>

      {/* Action Button */}
      <button 
        className={`px-5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all ${
          isPrivate 
            ? "bg-[#1c1917] text-white hover:bg-black" 
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isPrivate ? "Request" : "Follow"}
      </button>
    </div>
  );
}