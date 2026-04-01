"use client";
import { useState, useRef, useEffect } from "react";
import { X, Search, MessageCircle, Users, Megaphone } from "lucide-react";
import { useChatsStore } from "@/store/chats/chats.store";
import { useCommunitiesStore } from "@/store/communities/communities.store";
import { useAuthStore } from "@/store/auth/auth.store";

interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (targetId: string, targetTab: string) => void;
}

export default function ForwardModal({ isOpen, onClose, onSelect }: ForwardModalProps) {
  const { directChats } = useChatsStore();
  const { myGroups, myChannels } = useCommunitiesStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Reset search on open
  useEffect(() => { if (isOpen) setSearch(""); }, [isOpen]);

  if (!isOpen) return null;

  const q = search.toLowerCase();

  const filteredChats = directChats.filter((c: any) =>
    c.name.toLowerCase().includes(q)
  );
  const filteredGroups = myGroups.filter((g) =>
    g.name.toLowerCase().includes(q)
  );
  // Only owned channels can receive a forwarded broadcast
  const filteredChannels = myChannels
    .filter((c) => c.ownerId === user?.id && c.name.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-[340px] max-h-[480px] flex flex-col border border-stone-200 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-[14px] font-black text-[#1c1917] uppercase tracking-wide">Forward to</h3>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors active:scale-95">
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2 border border-stone-200/50 focus-within:border-stone-300 focus-within:bg-white transition-all">
            <Search size={14} className="text-stone-400" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats, groups & channels..."
              className="flex-1 bg-transparent text-[12px] font-medium text-[#1c1917] placeholder:text-stone-400 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 pb-4">
          {/* Direct Chats */}
          {filteredChats.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[9px] font-black text-stone-400 uppercase tracking-widest">Chats</div>
              {filteredChats.map((chat: any) => (
                <button
                  key={chat.id}
                  onClick={() => onSelect(chat.id, "chats")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-stone-100 border border-stone-200/60 flex items-center justify-center text-[11px] font-bold text-stone-500 shrink-0">
                    {chat.name?.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MessageCircle size={12} className="text-stone-300 shrink-0" />
                    <span className="text-[13px] font-medium text-[#1c1917] truncate">{chat.name}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Groups */}
          {filteredGroups.length > 0 && (
            <>
              <div className="px-3 py-1.5 mt-2 text-[9px] font-black text-stone-400 uppercase tracking-widest">Groups</div>
              {filteredGroups.map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => onSelect(grp.id, "groups")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-[10px] bg-stone-100 border border-stone-200/60 flex items-center justify-center overflow-hidden shrink-0">
                    {grp.avatarUrl ? (
                      <img src={grp.avatarUrl} alt={grp.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] font-bold text-stone-500">{grp.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Users size={12} className="text-stone-300 shrink-0" />
                    <span className="text-[13px] font-medium text-[#1c1917] truncate">{grp.name}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Channels (owned only — forwarded as a broadcast) */}
          {filteredChannels.length > 0 && (
            <>
              <div className="px-3 py-1.5 mt-2 text-[9px] font-black text-stone-400 uppercase tracking-widest">My Channels</div>
              {filteredChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => onSelect(ch.id, "channels")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-[10px] bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                    {ch.avatarUrl ? (
                      <img src={ch.avatarUrl} alt={ch.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] font-bold text-blue-500">{ch.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Megaphone size={12} className="text-blue-300 shrink-0" />
                    <span className="text-[13px] font-medium text-[#1c1917] truncate">{ch.name}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {filteredChats.length === 0 && filteredGroups.length === 0 && filteredChannels.length === 0 && (
            <div className="py-10 text-center text-[12px] text-stone-400">No conversations found</div>
          )}
        </div>
      </div>
    </div>
  );
}
