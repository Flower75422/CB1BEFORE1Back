"use client";
import { useState } from "react";

const MOCK_GROUPS = [{ id: "g1", name: "Frontend Masters", lastMsg: "Alex: Merged the PR.", time: "4:00 PM" }];

export default function GroupList({ onSelect }: any) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
      <div className="px-4 py-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">My Groups</div>
      {MOCK_GROUPS.map((item) => {
        const isActive = selectedId === item.id;
        return (
          <button key={item.id} onClick={() => { setSelectedId(item.id); onSelect(item); }} className={`w-[calc(100%-16px)] mx-2 px-3 py-3 flex items-center gap-3 rounded-xl transition-all mb-1 group text-left ${isActive ? "bg-stone-200/50" : "hover:bg-stone-100"}`}>
            <div className={`h-10 w-10 rounded-[14px] shrink-0 overflow-hidden border transition-colors ${isActive ? "border-stone-300" : "border-stone-200/60"}`}>
               <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-500 font-bold text-xs">FM</div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2"><span className={`text-[13px] font-bold truncate transition-colors ${isActive ? "text-[#1c1917]" : "text-stone-500 group-hover:text-[#1c1917]"}`}>{item.name}</span><span className="text-[10px] text-stone-400 font-bold shrink-0">{item.time}</span></div>
              <p className="text-[11px] text-stone-400 truncate font-medium">{item.lastMsg}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}