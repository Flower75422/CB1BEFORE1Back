"use client";

interface GroupBottomProps {
  owner: string;
  isPrivate?: boolean;
}

export default function GroupBottom({ owner, isPrivate }: GroupBottomProps) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-stone-50">
      {/* Admin Info moved to Bottom */}
      <div className="flex flex-col">
        <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest leading-none mb-0.5">Admin</span>
        <span className="text-[10px] font-bold text-stone-500 truncate max-w-[100px]">{owner}</span>
      </div>

      {/* Action Button */}
      <button 
        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all ${
          isPrivate 
            ? "bg-[#1c1917] text-white hover:bg-black" 
            : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
        }`}
      >
        {isPrivate ? "Request" : "Join"}
      </button>
    </div>
  );
}