"use client";
import { Globe, LockKeyhole, MoreVertical, ExternalLink } from "lucide-react";

export default function MyCardsPanel({ myCards }: { myCards: any[] }) {
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto no-scrollbar bg-[#FDFBF7] border-l border-stone-200/60 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
      <h2 className="text-[14px] font-black uppercase tracking-widest text-stone-400">
        My Active Deck ({myCards.length})
      </h2>
      
      {/* Map through cards here (using the exact UI we built earlier) */}
      <div className="grid gap-4">
        {myCards.length === 0 ? (
          <div className="text-[11px] font-bold text-stone-400 p-4 text-center border-2 border-dashed border-stone-200 rounded-xl">
            No cards created yet.
          </div>
        ) : (
          myCards.map((card) => (
            <div key={card.id} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               {/* Card Content... */}
               <h3 className="text-[13px] font-black">{card.channel?.name || "Untitled"}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}