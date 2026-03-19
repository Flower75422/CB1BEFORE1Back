"use client";

import { Tag, AlertCircle } from "lucide-react";

export default function PoolFormone({ data, update }: any) {
  const currentPool = data.pool || [];

  return (
    <div className="space-y-2 mt-2">
      <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
        Primary Pool (Category)
      </label>
      
      <div className="relative group">
        <Tag size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${currentPool.length === 0 ? 'text-stone-300' : 'text-stone-400 group-hover:text-[#1c1917]'}`} />
        
        <select 
          value={data.category || ""}
          onChange={(e) => update({ category: e.target.value })}
          disabled={currentPool.length === 0}
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-[12px] text-[#1c1917] appearance-none focus:outline-none focus:border-black hover:bg-stone-50 hover:border-stone-400 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-stone-200"
        >
          {currentPool.length === 0 ? (
            <option value="" disabled>Select interests from the pool first...</option>
          ) : (
            currentPool.map((topic: string) => (
              <option key={topic} value={topic}>{topic}</option>
            ))
          )}
        </select>

        {currentPool.length === 0 && (
          <AlertCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" />
        )}
      </div>
      
      <p className="text-[9px] font-semibold text-stone-400 ml-1">
        {currentPool.length === 0 ? "You must select at least one interest above to set your primary category." : "This defines the main category your channel belongs to."}
      </p>
    </div>
  );
}