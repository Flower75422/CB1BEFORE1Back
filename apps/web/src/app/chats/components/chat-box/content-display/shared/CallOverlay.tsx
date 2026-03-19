"use client";
export default function CallOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-md animate-in fade-in duration-200">
      <div className="h-24 w-24 rounded-full bg-stone-800 animate-pulse mb-6"></div>
      <p className="text-xl font-black tracking-tight mb-8">Calling...</p>
      <button onClick={onClose} className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full text-[13px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">End Call</button>
    </div>
  );
}