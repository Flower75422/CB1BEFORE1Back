"use client";
import { X, BellOff, Image as ImageIcon, ShieldAlert, UserMinus, User } from "lucide-react";

export default function DirectChatInfoPanel({ data, onClose }: any) {
  const name = data?.name || "User";
  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      <div className="h-16 flex items-center justify-between px-6 bg-stone-50 border-b border-stone-100 shrink-0">
        <h3 className="text-[14px] font-black text-[#1c1917] uppercase tracking-wide">Profile Details</h3>
        <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-[#1c1917] hover:bg-stone-200/50 rounded-xl transition-all active:scale-95"><X size={18} strokeWidth={2.5} /></button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="p-6 flex flex-col items-center text-center border-b border-stone-200/50 bg-white">
          <div className="h-24 w-24 bg-stone-100 border border-stone-200/60 rounded-full flex items-center justify-center text-3xl font-black text-stone-400 mb-4">{name.charAt(0)}</div>
          <h2 className="text-[17px] font-black text-[#1c1917] tracking-tight">{name}</h2>
          <button className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#1c1917] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black active:scale-95 shadow-md"><User size={14} /> View Full Profile</button>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">Settings</h4>
          <button className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"><div className="flex items-center gap-3"><BellOff size={16} className="text-stone-400" /><span className="text-[13px] font-bold text-[#1c1917]">Mute Notifications</span></div></button>
          <button className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors flex justify-between items-center shadow-sm"><div className="flex items-center gap-3"><ImageIcon size={16} className="text-stone-400" /><span className="text-[13px] font-bold text-[#1c1917]">Shared Media</span></div></button>
          <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1.5 ml-1 mt-4">Danger Zone</h4>
          <button className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-red-100 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 shadow-sm"><UserMinus size={16} /><span className="text-[13px] font-bold">Block User</span></button>
          <button className="w-full p-3.5 rounded-2xl bg-white border border-stone-200/60 hover:border-red-100 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-3 shadow-sm"><ShieldAlert size={16} /><span className="text-[13px] font-bold">Report User</span></button>
        </div>
      </div>
    </div>
  );
}