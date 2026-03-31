"use client";

import { useRef } from "react";
import { Camera, Plus } from "lucide-react";

export default function ProfileForm({ data, update }: any) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update({ avatarUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[a-zA-Z0-9 ]*$/.test(val) && val.length <= 54) {
      update({ title: val });
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[a-zA-Z0-9_]*$/.test(val) && val.length <= 54) {
      update({ channelId: val });
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 225) {
      update({ description: val });
    }
  };

  return (
    <div className="space-y-4">

      <div className="flex gap-4 items-start">

        {/* Cover upload */}
        <div
          className="w-28 h-28 shrink-0 bg-[#F5F5F4] rounded-[20px] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center group hover:border-stone-400 transition-all cursor-pointer overflow-hidden relative"
          onClick={() => fileRef.current?.click()}
        >
          {data.avatarUrl ? (
            <>
              <img src={data.avatarUrl} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={18} />
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-white rounded-full shadow-sm border border-stone-100 mb-1.5 group-hover:scale-110 transition-transform">
                <Plus className="text-stone-400" size={16} strokeWidth={2.5} />
              </div>
              <span className="text-stone-400 font-black text-[8px] uppercase tracking-widest text-center px-1">Cover</span>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

        {/* Inputs */}
        <div className="flex-1 flex flex-col gap-3">

          <div className="space-y-1">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Channel Name</label>
            <input
              type="text"
              value={data.title || ""}
              onChange={handleNameChange}
              className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-[12px] text-[#1c1917] placeholder-stone-300 focus:outline-none focus:border-black transition-colors shadow-sm"
              placeholder="e.g. Nextjs Tutorials"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Channel ID</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[12px] font-black text-stone-400">@</span>
              <input
                type="text"
                value={data.channelId || ""}
                onChange={handleIdChange}
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-[12px] text-[#1c1917] placeholder-stone-300 focus:outline-none focus:border-black transition-colors shadow-sm"
                placeholder="nextjs_tuts"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Channel Bio</label>
          <span className="text-[8px] font-black text-stone-400 uppercase">{data.description?.length || 0} / 225</span>
        </div>
        <textarea
          value={data.description || ""}
          onChange={handleBioChange}
          placeholder="Describe the purpose of this channel..."
          className="w-full h-[72px] p-3 bg-white border border-stone-200 rounded-xl text-[12px] font-bold text-[#1c1917] focus:outline-none focus:border-black transition-all resize-none shadow-sm"
        />
      </div>

    </div>
  );
}
