"use client";

import { BellOff, Bell, Users } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";

/**
 * Per-channel and per-group notification preferences.
 * Plugged into the Preferences tab of the settings page.
 */
export default function NotifChannelPrefs() {
  const {
    myChannels,
    myGroups,
    subscribedChannelIds,
    joinedGroupIds,
    mutedChannelIds,
    mutedGroupIds,
    muteChannel,
    unmuteChannel,
    muteGroup,
    unmuteGroup,
  } = useCommunitiesStore();

  // Show all channels: owned + subscribed (deduplicated)
  const visibleChannels = [
    ...myChannels,
    // subscribed channels not in myChannels (their data lives in globalFeed; show stub if id not found)
  ];

  // Show all groups: owned + joined (deduplicated)
  const visibleGroups = [
    ...myGroups,
  ];

  const hasContent = visibleChannels.length > 0 || visibleGroups.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-[12px] font-black text-[#1c1917] uppercase tracking-widest mb-1">Notification Preferences</h3>
        <p className="text-[12px] text-stone-400 leading-relaxed">
          Control which channels and groups send you notifications. Muted sources won't appear in your notification feed.
        </p>
      </div>

      {!hasContent && (
        <p className="text-[12px] text-stone-400 py-4">No channels or groups to configure yet.</p>
      )}

      {/* Channels */}
      {visibleChannels.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Channels</p>
          {visibleChannels.map((ch) => {
            const isMuted = mutedChannelIds.includes(ch.id);
            return (
              <div
                key={ch.id}
                className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-200/60 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[10px] overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center text-[12px] font-black text-stone-400 shrink-0">
                    {ch.avatarUrl ? (
                      <img src={ch.avatarUrl} alt={ch.name} className="w-full h-full object-cover" />
                    ) : ch.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1c1917]">{ch.name}</p>
                    <p className="text-[10px] text-stone-400 font-medium">{ch.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => isMuted ? unmuteChannel(ch.id) : muteChannel(ch.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                    isMuted
                      ? "bg-stone-100 text-stone-400 hover:bg-stone-200"
                      : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {isMuted ? <BellOff size={11} /> : <Bell size={11} />}
                  {isMuted ? "Muted" : "On"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Groups */}
      {visibleGroups.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Groups</p>
          {visibleGroups.map((grp) => {
            const isMuted = mutedGroupIds.includes(grp.id);
            return (
              <div
                key={grp.id}
                className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-stone-200/60 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[10px] overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center text-[12px] font-black text-stone-400 shrink-0">
                    {grp.avatarUrl ? (
                      <img src={grp.avatarUrl} alt={grp.name} className="w-full h-full object-cover" />
                    ) : grp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1c1917]">{grp.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium mt-0.5">
                      <Users size={9} /> {grp.members} members
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => isMuted ? unmuteGroup(grp.id) : muteGroup(grp.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                    isMuted
                      ? "bg-stone-100 text-stone-400 hover:bg-stone-200"
                      : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {isMuted ? <BellOff size={11} /> : <Bell size={11} />}
                  {isMuted ? "Muted" : "On"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
