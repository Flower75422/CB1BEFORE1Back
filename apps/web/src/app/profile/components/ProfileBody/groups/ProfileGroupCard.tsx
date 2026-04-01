"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, MoreVertical, Share, Flag, LogOut, UserPlus, Settings, Trash2, Crown } from "lucide-react";

export interface Group {
  id: number | string;
  title: string;
  members: string;
  owner: string;
  desc: string;
  isPrivate?: boolean;
  activity: string;
  avatarUrl?: string;
  topics?: string[];
  isJoined?: boolean;
}

interface Props {
  group: Group;
  isOwner?: boolean;  // true = logged-in user created this group
  isAdmin?: boolean;  // true = logged-in user is an admin (but not creator)
  onOpenChat?: (group: Group) => void;
}

export default function ProfileGroupCard({ group, isOwner = false, isAdmin = false, onOpenChat }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenChat = () => {
    if (!group.isPrivate) {
      if (onOpenChat) onOpenChat(group);
    } else {
      alert("This is a private group. You must request access to join.");
    }
  };

  // Activity dot color
  const activityColor =
    group.activity === "Very Active" ? "bg-green-400" :
    group.activity === "Active"      ? "bg-blue-400"  : "bg-stone-300";

  return (
    <div className="bg-white p-5 rounded-[24px] border border-stone-100 hover:shadow-lg hover:shadow-stone-200/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">

      {/* TOP — Avatar + Title + Role badge + Menu */}
      <div className="flex justify-between items-start">
        <div
          onClick={handleOpenChat}
          className={`flex gap-3 min-w-0 flex-1 ${!group.isPrivate ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <div className="h-11 w-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/60 overflow-hidden">
            {group.avatarUrl
              ? <img src={group.avatarUrl} alt={group.title} className="w-full h-full object-cover" />
              : <span className="text-[16px] font-semibold text-stone-600">{group.title.charAt(0)}</span>
            }
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="text-[13px] font-medium text-stone-700 truncate leading-tight flex items-center gap-1.5">
              {group.title}
              {group.isPrivate && <ShieldCheck size={12} className="text-stone-400 shrink-0" />}
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">{group.members} Members</p>
          </div>
        </div>

        {/* Role badge — Crown for owner, Shield for admin */}
        {(isOwner || isAdmin) && (
          <div className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium mr-1 ${isOwner ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-stone-100 text-stone-500"}`}>
            {isOwner ? <Crown size={9} /> : <ShieldCheck size={9} />}
            {isOwner ? "Owner" : "Admin"}
          </div>
        )}

        {/* ── 3-DOT MENU ── */}
        <div className="shrink-0 relative" ref={menuRef}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors active:scale-95"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-stone-200/60 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

              {isOwner ? (
                // ── OWNER MENU ──────────────────────────────────────────
                <>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Settings size={13} className="text-stone-400" /> Manage Group
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Share size={13} className="text-stone-400" /> Share
                  </button>
                  <div className="h-px bg-stone-100 my-1 mx-2" />
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} className="text-red-400" /> Delete Group
                  </button>
                </>
              ) : isAdmin ? (
                // ── ADMIN MENU ──────────────────────────────────────────
                <>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Settings size={13} className="text-stone-400" /> Manage Members
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Share size={13} className="text-stone-400" /> Share
                  </button>
                  <div className="h-px bg-stone-100 my-1 mx-2" />
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={13} className="text-red-400" /> Leave Group
                  </button>
                </>
              ) : (
                // ── VISITOR MENU ────────────────────────────────────────
                <>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Share size={13} className="text-stone-400" /> Share
                  </button>
                  <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors">
                    <Flag size={13} className="text-stone-400" /> Report
                  </button>
                  <div className="h-px bg-stone-100 my-1 mx-2" />
                  {group.isJoined
                    ? <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors"><LogOut size={13} className="text-red-400" /> Leave</button>
                    : <button onClick={(e) => e.stopPropagation()} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"><UserPlus size={13} className="text-stone-400" /> Join</button>
                  }
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BODY — Description + Activity */}
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-stone-500 leading-relaxed line-clamp-2 break-words">{group.desc || <span className="text-stone-300 italic">No description added.</span>}</p>
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${activityColor} ${group.activity === "Very Active" ? "animate-pulse" : ""}`} />
          <span className="text-[11px] text-stone-400">{group.activity}</span>
          {group.isPrivate && (
            <div className="ml-1 flex items-center gap-1 w-fit bg-stone-50 text-stone-400 px-2 py-0.5 rounded-md border border-stone-100">
              <ShieldCheck size={9} />
              <span className="text-[9px] font-medium">Private</span>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM — Role label + Primary Action */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-50">
        <div className="flex flex-col">
          <span className="text-[9px] text-stone-300 uppercase tracking-widest leading-none mb-0.5">
            {isOwner ? "You own this" : isAdmin ? "You admin this" : "Admin"}
          </span>
          <span className="text-[11px] font-medium text-stone-500 truncate max-w-[120px]">
            {isOwner || isAdmin ? "You" : group.owner}
          </span>
        </div>

        {isOwner || isAdmin ? (
          // Owner / Admin sees Manage button
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-medium bg-stone-800 text-white hover:bg-stone-900 shadow-sm active:scale-95 transition-all">
            <Settings size={11} /> Manage
          </button>
        ) : (
          // Visitor sees Join / Request button
          <button className={`px-5 py-1.5 rounded-xl text-[11px] font-medium shadow-sm active:scale-95 transition-all ${group.isPrivate ? "bg-stone-800 text-white hover:bg-stone-900" : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"}`}>
            {group.isPrivate ? "Request" : "Join"}
          </button>
        )}
      </div>

    </div>
  );
}
