"use client";

import { useRef } from "react";
import { Video, X } from "lucide-react";

export default function MoreFormone({ card, updateCard }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateCard({ backMediaUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Backside Media</label>
      {card?.backMediaUrl ? (
          <div className="relative h-40 w-full rounded-xl overflow-hidden border border-stone-200 group">
            {card.backMediaUrl.includes("video") || card.backMediaUrl.startsWith("data:video") ? <video src={card.backMediaUrl} className="w-full h-full object-cover" controls /> : <img src={card.backMediaUrl} alt="Backside media" className="w-full h-full object-cover" />}
            <button onClick={() => { updateCard({ backMediaUrl: null }); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"><X size={14} strokeWidth={3} /></button>
          </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="h-32 w-full rounded-xl bg-[#F5F5F4] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-[#78716c] hover:border-stone-400 hover:text-[#1c1917] hover:bg-stone-50 cursor-pointer transition-all group shadow-sm">
            <Video size={20} className="mb-2 group-hover:scale-110 transition-transform text-stone-300" />
            <span className="text-[11px] font-black uppercase tracking-tight">Upload Video or Image</span>
        </div>
      )}
      <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleMediaUpload} />
    </div>
  );
}