"use client";

import { Camera, Upload, Check } from "lucide-react";

export default function Profile() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[19px] font-black text-[#1c1917] tracking-tight leading-none">Profile Settings</h2>
        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Manage your public identity</p>
      </div>

      {/* Avatar & Name Row */}
      <div className="flex gap-6 items-center">
        <div className="relative group cursor-pointer shrink-0">
          <div className="h-20 w-20 rounded-2xl bg-[#F5F5F4] border border-stone-200" />
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} />
          </div>
        </div>
        
        <div className="flex-1 flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase ml-1 tracking-wider">Display Name</label>
            <input 
              type="text" 
              defaultValue="Alturm" 
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-bold text-[13px] text-[#1c1917] focus:outline-none focus:border-black transition-colors shadow-sm" 
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase ml-1 tracking-wider">Status</label>
            <select className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl font-bold text-[13px] text-[#1c1917] focus:outline-none focus:border-black transition-colors shadow-sm cursor-pointer">
              <option>Active</option>
              <option>Away</option>
              <option>Do Not Disturb</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bio</label>
          </div>
          <textarea 
            className="w-full p-4 bg-white border border-stone-200 rounded-xl text-[13px] font-bold text-[#1c1917] focus:outline-none focus:border-black transition-colors resize-none shadow-sm min-h-[100px]" 
            defaultValue="Backend Engineer exploring the education space through technology." 
          />
      </div>

      {/* Banner Upload */}
      <div className="flex-1">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 mb-2 block">Profile Banner</label>
        <div className="w-full h-32 bg-[#F5F5F4] rounded-[24px] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center group hover:border-stone-400 transition-all cursor-pointer">
          <div className="p-3 bg-white rounded-full shadow-sm border border-stone-100 mb-2 group-hover:scale-110 transition-transform">
            <Upload className="text-stone-400" size={16} strokeWidth={2.5} />
          </div>
          <span className="text-stone-400 font-black text-[10px] uppercase tracking-widest">
            Upload Banner Image
          </span>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-stone-100 flex justify-end">
          <button className="px-6 py-3 bg-[#1c1917] hover:bg-black text-white rounded-xl text-[12px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-md">
            Save Changes <Check size={14} strokeWidth={3} />
          </button>
      </div>
    </div>
  );
}