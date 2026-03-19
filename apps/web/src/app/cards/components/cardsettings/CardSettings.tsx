"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Plus, Trash2, ChevronLeft, ChevronRight, Save } from "lucide-react";
import CardEditor from "./CardEditor";
import { getUpdatedCards } from "./updateActiveCard";

export default function CardSettings({ initialCards, globalUser, onSave, onBack }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null); 

  const [cards, setCards] = useState(
    initialCards?.length > 0 ? initialCards : [
      {
        id: `card_${Date.now()}`,
        bio: "Building next-gen UI/UX for Web3 startups.",
        backMediaUrl: null,
        channel: { name: "Sarah's Design Hub", isPublic: true },
        interests: { primary: "Design", pool: ["Figma", "UI/UX", "Web3"] },
        permissions: { allowChat: true, allowFullProfile: true },
        stats: { views: 0, likes: 0, posts: 0 },
        progress: 2,
        wallPosts: []
      }
    ]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, index: number } | null>(null);
  const activeCard = cards[activeIndex];

  // Global Scroll Lock
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    
    return () => {
      document.body.style.overflow = originalStyle;
      document.documentElement.style.overscrollBehavior = "auto";
    };
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [cards.length]);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
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

  const updateActiveCard = (updates: any) => {
    const updatedCards = getUpdatedCards(cards, activeIndex, updates);
    setCards(updatedCards);
  };

  const addNewCard = () => {
    if (cards.length >= 9) return alert("Maximum 9 cards allowed.");
    const newCard = {
      id: `card_${Date.now()}`,
      bio: "",
      backMediaUrl: null,
      channel: { name: "", isPublic: true },
      interests: { primary: "", pool: [] },
      permissions: { allowChat: true, allowFullProfile: true },
      stats: { views: 0, likes: 0, posts: 0 },
      progress: 1,
      wallPosts: []
    };
    setCards([...cards, newCard]);
    setActiveIndex(cards.length);
  };

  const deleteCardByIndex = (index: number) => {
    if (cards.length === 1) return alert("You must have at least one card.");
    if (!confirm("Are you sure you want to delete this card?")) return;
    
    const newCards = cards.filter((_: any, idx: number) => idx !== index);
    setCards(newCards);
    
    // Smart Delete Shift
    if (activeIndex === index) {
      setActiveIndex(index === cards.length - 1 ? index - 1 : index);
    } else if (activeIndex > index) {
      setActiveIndex(activeIndex - 1);
    }
    setContextMenu(null);
  };

  return (
    <div className="fixed inset-y-0 right-0 left-[256px] flex flex-col items-center bg-[#FDFBF7] overflow-hidden overscroll-none p-6 pt-2 select-none z-10">
      
      {/* HEADER TOP BAR */}
      <div className="flex-shrink-0 flex items-center justify-between mt-8 mb-6 px-1 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-200 transition text-[#1c1917] bg-white border border-stone-200 shadow-sm active:scale-95">
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <h1 className="text-[19px] font-black text-[#1c1917] tracking-tight leading-none">
            Card Deck Manager
          </h1>
        </div>
      </div>

      {/* TABS FILTER BAR */}
      <div className="flex-shrink-0 flex items-center gap-2 mb-4 h-14 p-1.5 bg-white border border-stone-200/60 rounded-2xl shadow-sm w-full max-w-4xl mx-auto">
        <div className="flex items-center flex-1 min-w-0 bg-stone-50/50 rounded-xl px-1 relative h-full">
          <button onClick={() => scrollTabs('left')} className="p-1 hover:bg-white rounded-lg text-stone-400 shrink-0 transition-colors">
            <ChevronLeft size={14} strokeWidth={3} />
          </button>

          <div ref={scrollContainerRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth flex-1">
            {cards.map((c: any, idx: number) => (
              <div key={c.id} className="flex flex-col gap-1 min-w-[110px] max-w-[140px] shrink-0">
                <button 
                  onClick={() => setActiveIndex(idx)}
                  onContextMenu={(e) => handleRightClick(e, idx)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border truncate block w-full text-center tracking-wider ${
                    activeIndex === idx ? "bg-black text-white border-black shadow-md" : "bg-white border-stone-200 text-stone-400 hover:border-stone-400"
                  }`}
                >
                  {c.channel.name || `Card ${idx + 1}`}
                </button>
                <div className="flex gap-0.5 px-1 h-[2px] w-full">
                  <div className={`flex-1 rounded-full ${c.progress >= 1 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                  <div className={`flex-1 rounded-full ${c.progress >= 2 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                  <div className={`flex-1 rounded-full ${c.progress >= 3 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                  <div className={`flex-1 rounded-full ${c.progress >= 4 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                  <div className={`flex-1 rounded-full ${c.progress >= 5 ? (activeIndex === idx ? 'bg-black' : 'bg-stone-400') : 'bg-stone-200'}`} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scrollTabs('right')} className="p-1 hover:bg-white rounded-lg text-stone-400 shrink-0 transition-colors">
            <ChevronRight size={14} strokeWidth={3} />
          </button>

          <div className="pl-1 pr-1 border-l border-stone-200/50 ml-1 shrink-0 h-8 flex items-center">
            <button 
                onClick={addNewCard} 
                disabled={cards.length >= 9}
                className="h-full px-3 rounded-lg border-2 border-dashed border-stone-300 text-stone-400 hover:text-black hover:border-black transition-all flex items-center gap-1.5 text-[9px] font-black uppercase bg-white disabled:opacity-30"
            >
                <Plus size={12} strokeWidth={3} /> Add
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 shrink-0 border-l border-stone-200/60 ml-1">
          <div className="flex flex-col items-center">
             <span className="text-[7px] font-black text-stone-400 uppercase leading-none mb-1 tracking-tighter whitespace-nowrap">
                My Cards {cards.length}/9
             </span>
             <div className="text-[11px] font-black text-[#1c1917] bg-white border-2 border-black px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
               MC
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full max-w-4xl mx-auto overflow-hidden animate-in fade-in duration-200">
        <CardEditor 
          user={globalUser} 
          card={activeCard} 
          updateCard={updateActiveCard} 
          onDelete={() => deleteCardByIndex(activeIndex)} 
        />
      </div>

      {/* CONTEXT MENU */}
      {contextMenu && (
        <div 
          className="fixed z-[999] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-1 w-40"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button 
            onClick={() => { onSave(cards); setContextMenu(null); }} 
            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase hover:bg-stone-50 flex items-center gap-2"
          >
            <Save size={14} strokeWidth={2.5} /> Save Card
          </button>
          <button 
            onClick={() => deleteCardByIndex(contextMenu.index)} 
            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-stone-100"
          >
            <Trash2 size={14} strokeWidth={2.5} /> Delete Card
          </button>
        </div>
      )}
    </div>
  );
}