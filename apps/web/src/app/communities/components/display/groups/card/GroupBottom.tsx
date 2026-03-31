"use client";

import { Settings, Eye } from "lucide-react";

interface GroupBottomProps {
  owner: string;
  handle?: string;
  isPrivate?: boolean;
  isOwner?: boolean;
  isJoined?: boolean;
  onManage?: () => void;
  onView?: () => void;
}

export default function GroupBottom({ owner, handle, isPrivate, isOwner, isJoined, onManage, onView }: GroupBottomProps) {
  const canView = !isPrivate || isJoined;
  const ownerHandle = handle ? handle.replace(/^@/, "").split("/")[2] : null;

  return (
    <div className="flex items-center justify-between pt-3 border-t border-stone-50">
      <div className="flex flex-col">
        <span className="text-[8px] font-black text-stone-300 uppercase tracking-widest leading-none mb-0.5">Admin</span>
        {ownerHandle
          ? <span className="text-[10px] font-bold text-stone-400 truncate max-w-[100px]">{ownerHandle}</span>
          : <span className="text-[10px] font-bold text-stone-500 truncate max-w-[100px]">{owner}</span>
        }
      </div>

      {isOwner ? (
        <button
          onClick={(e) => { e.stopPropagation(); onManage?.(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c1917] text-white text-[10px] font-black uppercase tracking-wider hover:bg-black active:scale-95 transition-all shadow-sm"
        >
          <Settings size={11} strokeWidth={2.5} /> Manage
        </button>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); if (canView) onView?.(); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
            canView
              ? 'bg-[#1c1917] text-white hover:bg-black active:scale-95 shadow-sm cursor-pointer'
              : 'bg-stone-100 text-stone-300 border border-stone-150 cursor-not-allowed'
          }`}
        >
          <Eye size={11} strokeWidth={2.5} /> View
        </button>
      )}
    </div>
  );
}
