"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Save, Trash2 } from "lucide-react"; // 🔴 Added Save & Trash2

export default function CreateGroupFilterBar({ groups, activeIndex, setActiveIndex, onAdd, onDelete, onSave }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 🔴 NEW: Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, index: number } | null>(null);

  // Smooth scroll to the end when a new group is added
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [groups.length]);

  // 🔴 NEW: Close context menu when clicking anywhere else on the screen
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // 🔴 NEW: Right-click handler
  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Stop normal browser right-click menu
    setContextMenu({ x: e.pageX, y: e.pageY, index });
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="flex-shrink-0 flex items-center gap-2 mb-4 h-14 p-1.5 bg-white border border-stone-200/60 rounded-2xl shadow-sm w-full">
        <div className="flex items-center flex-1 min-w-0 bg-stone-50/50 rounded-xl px-1 relative h-full">
          
          <button onClick={() => scrollTabs('left')} className="p-1 hover:bg-white rounded-lg text-stone-400 shrink-0 transition-colors">
            <ChevronLeft size={14} strokeWidth={3} />
          </button>

          <div 
            ref={scrollContainerRef} 
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth flex-1"
          >
            {groups.map((g: any, idx: number) => (
              <div key={g.id} className="flex flex-col gap-1 min-w-[110px] max-w-[140px] shrink-0">
                
                <button 
                  onClick={() => setActiveIndex(idx)}
                  onContextMenu={(e) => handleRightClick(e, idx)} // 🔴 Trigger context menu on right click
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border truncate block w-full text-center tracking-wider ${
                    activeIndex === idx 
                      ? "bg-black text-white border-black shadow-md" 
                      : "bg-white border-stone-200 text-stone-400 hover:border-stone-400"
                  }`}
                >
                  {g.title || `Draft ${idx + 1}`}
                </button>

                {/* 3-Dot Progress Indicator */}
                <div className="flex gap-0.5 px-1 h-[2px] w-full">
                  <div className={`flex-1 rounded-full ${g.step >= 1 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                  <div className={`flex-1 rounded-full ${g.step >= 2 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                  <div className={`flex-1 rounded-full ${g.step >= 3 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                </div>

              </div>
            ))}
          </div>

          <button onClick={() => scrollTabs('right')} className="p-1 hover:bg-white rounded-lg text-stone-400 shrink-0 transition-colors">
            <ChevronRight size={14} strokeWidth={3} />
          </button>

          <div className="pl-1 pr-1 border-l border-stone-200/50 ml-1 shrink-0 h-8 flex items-center">
            <button 
                onClick={onAdd} 
                className="h-full px-3 rounded-lg border-2 border-dashed border-stone-300 text-stone-400 hover:text-black hover:border-black transition-all flex items-center gap-1.5 text-[9px] font-black uppercase bg-white"
            >
                <Plus size={12} strokeWidth={3} /> Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 shrink-0 border-l border-stone-200/60 ml-1">
          <div className="flex flex-col items-center">
             <span className="text-[7px] font-black text-stone-400 uppercase leading-none mb-1 tracking-tighter whitespace-nowrap">
               My Groups
             </span>
             <div className="text-[11px] font-black text-[#1c1917] bg-white border-2 border-black px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
               {groups.length}
             </div>
          </div>
        </div>
      </div>

      {/* 🔴 NEW: The Right-Click Context Menu (Ported directly from CardSettings) */}
      {contextMenu && (
        <div 
          className="fixed z-[999] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-1 w-40 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); onSave(); setContextMenu(null); }} 
            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase hover:bg-stone-50 flex items-center gap-2"
          >
            <Save size={14} strokeWidth={2.5} /> Save Draft
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(contextMenu.index); setContextMenu(null); }} 
            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-stone-100"
          >
            <Trash2 size={14} strokeWidth={2.5} /> Delete Draft
          </button>
        </div>
      )}
    </>
  );
}