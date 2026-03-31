"use client";

import { Bell, BellOff, Search, FileImage, ShieldAlert, Globe, Lock, Pencil } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export default function ChannelUniSettings({
  onViewChange,
  channel,
  isOwner,
}: {
  onViewChange: (view: string) => void;
  channel?: any;
  isOwner?: boolean;
}) {
  const { updateChannel, mutedChannelIds, muteChannel, unmuteChannel } = useCommunitiesStore();
  const isMuted = mutedChannelIds.includes(String(channel?.id ?? ""));

  const isPublic = channel ? !channel.isPrivate : true;

  const handleTogglePrivacy = () => {
    if (!isOwner || !channel?.id) return;
    updateChannel(channel.id, { isPrivate: isPublic });
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Settings & Media</h4>

      <div className="flex flex-col gap-1">
        {/* Mute Notifications — redesigned */}
        <button
          onClick={() => isMuted ? unmuteChannel(String(channel?.id ?? "")) : muteChannel(String(channel?.id ?? ""))}
          className={`w-full p-3.5 rounded-xl border transition-all flex items-center gap-3 active:scale-[0.98] ${
            isMuted ? 'bg-amber-50 border-amber-100 hover:bg-amber-100/60' : 'bg-[#F5F5F4] border-transparent hover:border-stone-200'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isMuted ? 'bg-amber-100' : 'bg-white border border-stone-200 shadow-sm'
          }`}>
            {isMuted
              ? <BellOff size={16} className="text-amber-500" />
              : <Bell size={16} className="text-green-500" />
            }
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[13px] font-bold text-[#1c1917]">{isMuted ? 'Muted' : 'Notifications On'}</span>
            <span className="text-[10px] text-stone-400 font-medium">{isMuted ? 'Tap to unmute' : 'Tap to mute'}</span>
          </div>
          <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${isMuted ? 'bg-amber-400' : 'bg-green-500'}`} />
        </button>

        {/* Public/Private — owner only */}
        {isOwner && (
          <button
            onClick={handleTogglePrivacy}
            className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 cursor-pointer transition-colors flex justify-between items-center group"
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
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isPublic ? 'translate-x-5' : 'left-1'}`} />
            </div>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {isOwner && (
          <SettingButton
            icon={<Pencil size={16} />}
            label="Edit Channel"
            onClick={() => onViewChange("edit")}
          />
        )}
        <SettingButton icon={<Search size={16} />} label="Search in Channel" />
        <SettingButton
          icon={<FileImage size={16} />}
          label="Shared Media & Links"
          count="89"
          onClick={() => onViewChange("media")}
        />
        <SettingButton
          icon={<ShieldAlert size={16} />}
          label="Report Channel"
          isDanger
          onClick={() => onViewChange("report")}
        />
      </div>

    </div>
  );
}

function SettingButton({ icon, label, count, isDanger, onClick }: {
  icon: React.ReactNode; label: string; count?: string; isDanger?: boolean; onClick?: () => void;
}) {
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
