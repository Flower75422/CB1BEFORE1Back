"use client";

import { BellOff, Search, FileImage, ShieldAlert, LogOut, Globe, Lock } from "lucide-react";
import { useState } from "react";

// 🔴 Accepts the view changer
export default function ChannelUniSettings({ onViewChange }: { onViewChange: (view: string) => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPublic, setIsPublic] = useState(true); // 🔴 New Public/Private state

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Settings & Media</h4>
      
      {/* 🔴 Toggles Box: Grouped tightly together to save space */}
      <div className="flex flex-col gap-1">
        {/* Toggle Mute */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors flex justify-between items-center group"
        >
           <div className="flex items-center gap-3">
             <BellOff size={16} className="text-stone-500 group-hover:text-black transition-colors" />
             <span className="text-[13px] font-bold text-[#1c1917]">Mute Notifications</span>
           </div>
           <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isMuted ? 'bg-stone-300' : 'bg-green-500'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? 'left-1' : 'translate-x-5'}`}></div>
           </div>
        </button>

        {/* 🔴 New: Public Toggle */}
        <button 
          onClick={() => setIsPublic(!isPublic)}
          className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors flex justify-between items-center group"
        >
           <div className="flex items-center gap-3">
             {isPublic ? (
               <Globe size={16} className="text-stone-500 group-hover:text-black transition-colors" />
             ) : (
               <Lock size={16} className="text-stone-500 group-hover:text-black transition-colors" />
             )}
             <span className="text-[13px] font-bold text-[#1c1917]">{isPublic ? "Public Channel" : "Private Channel"}</span>
           </div>
           <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isPublic ? 'bg-blue-500' : 'bg-stone-300'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isPublic ? 'translate-x-5' : 'left-1'}`}></div>
           </div>
        </button>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-1 mt-2">
        <SettingButton icon={<Search size={16} />} label="Search in Channel" />
        <SettingButton 
          icon={<FileImage size={16} />} 
          label="Shared Media & Links" 
          count="89" 
          onClick={() => onViewChange("media")} // 🔴 Wired up
        />
        <SettingButton 
          icon={<ShieldAlert size={16} />} 
          label="Report Channel" 
          isDanger 
          onClick={() => onViewChange("report")} // 🔴 Wired up
        />
      </div>

      {/* Leave Button */}
      <div className="mt-6">
        <button className="w-full py-3.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
          <LogOut size={16} /> Leave Channel
        </button>
      </div>
    </div>
  );
}

// 🔴 Updated to accept onClick
function SettingButton({ icon, label, count, isDanger, onClick }: { icon: React.ReactNode, label: string, count?: string, isDanger?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-white hover:border-stone-200 shadow-sm ${isDanger ? 'text-red-500 hover:bg-red-50' : 'text-[#1c1917]'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${isDanger ? 'bg-red-100 text-red-500' : 'bg-stone-100 text-stone-500'}`}>
          {icon}
        </div>
        <span className="text-[12px] font-bold">{label}</span>
      </div>
      {count && <span className="text-[10px] font-black text-stone-400 uppercase">{count}</span>}
    </button>
  );
}