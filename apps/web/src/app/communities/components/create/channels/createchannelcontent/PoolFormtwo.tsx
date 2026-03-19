"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, X } from "lucide-react";
import GridContainer from "@/app/cards/components/filter-header/interest-grid/GridContainer"; 

export default function PoolFormtwo({ data, update }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentPool = data.pool || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const toggleTopic = (topic: string) => {
    let newPool = [...currentPool];
    if (currentPool.includes(topic)) {
      newPool = currentPool.filter((t: string) => t !== topic);
    } else if (currentPool.length < 6) {
      newPool = [...currentPool, topic];
    }
    
    let newCategory = data.category;
    if (!newPool.includes(data.category)) {
      newCategory = newPool.length > 0 ? newPool[0] : "";
    }
    update({ pool: newPool, category: newCategory });
  };

  const removeTopic = (topic: string) => {
    const newPool = currentPool.filter((t: string) => t !== topic);
    let newCategory = data.category;
    if (data.category === topic) {
      newCategory = newPool.length > 0 ? newPool[0] : "";
    }
    update({ pool: newPool, category: newCategory });
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="flex justify-between items-start ml-1">
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Interest Pool</label>
          <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${currentPool.length === 6 ? 'text-amber-500' : 'text-stone-400'}`}>
            {currentPool.length}/6 Limits
          </span>
        </div>

        <div className="relative shrink-0 z-50" ref={menuRef}>
          <button 
            onClick={(e) => { e.preventDefault(); setIsModalOpen(!isModalOpen); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-all shadow-sm ${
              isModalOpen ? "bg-black text-white border-black" : "bg-gradient-to-tr from-amber-50 to-orange-50 border-amber-200 text-amber-600 hover:opacity-90 active:scale-[0.98]"
            }`}
          >
            <span className="text-[10px] font-black uppercase tracking-wider">Interests</span>
            <Sparkles size={12} strokeWidth={2.5} />
          </button>

          <div className="absolute right-0 top-full mt-2 w-[320px]">
             <GridContainer isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedInterests={currentPool} toggleInterest={toggleTopic} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="min-h-[72px] p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-wrap gap-1.5 items-start">
          {currentPool.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-stone-400 italic py-2">
              No interests selected yet...
            </div>
          )}
          {currentPool.map((topic: string) => (
            <div key={topic} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-[#1c1917] text-white rounded-lg shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-wider">{topic}</span>
              <button onClick={() => removeTopic(topic)} className="p-1 hover:bg-stone-700 rounded-md transition-colors"><X size={10} strokeWidth={3} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}