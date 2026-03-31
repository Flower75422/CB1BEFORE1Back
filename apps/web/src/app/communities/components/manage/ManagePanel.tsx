"use client";

import { useState } from "react";
import { ArrowLeft, BarChart2, Settings, Trash2, Users, ShieldCheck, Globe, Lock } from "lucide-react";

interface ManagePanelProps {
  type: "channel" | "group";
  data: any;
  onClose: () => void;
  onDelete?: () => void;
}

const TABS = [
  { id: "overview",  label: "Overview",  icon: BarChart2 },
  { id: "members",   label: "Members",   icon: Users },
  { id: "settings",  label: "Settings",  icon: Settings },
  { id: "danger",    label: "Danger",    icon: Trash2 },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function ManagePanel({ type, data, onClose, onDelete }: ManagePanelProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [name, setName] = useState(data?.title || data?.name || "");
  const [desc, setDesc] = useState(data?.desc || "");
  const [isPrivate, setIsPrivate] = useState(data?.isPrivate ?? false);

  const label = type === "channel" ? "Channel" : "Group";

  return (
    <div className="fixed inset-y-0 right-0 left-64 flex flex-col bg-[#FDFBF7] z-[100] animate-in fade-in duration-200">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-8 h-16 border-b border-stone-100 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-stone-400 hover:text-[#1c1917] transition-colors text-[12px] font-bold"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Back
        </button>
        <div className="h-4 w-px bg-stone-200" />
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black uppercase ${type === "channel" ? "bg-blue-50 text-blue-600" : "bg-stone-100 text-stone-600"}`}>
            {(data?.title || data?.name || "?").charAt(0)}
          </div>
          <span className="text-[13px] font-bold text-[#1c1917] truncate">{data?.title || data?.name}</span>
          {isPrivate && <ShieldCheck size={13} className="text-stone-400 shrink-0" />}
        </div>
        <div className="ml-auto">
          <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Manage {label}</span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar tabs */}
        <div className="w-[180px] shrink-0 border-r border-stone-100 bg-stone-50/40 flex flex-col py-6 px-3 gap-1">
          {TABS.map(({ id, label: tabLabel, icon: Icon }) => {
            const isActive = tab === id;
            const isDanger = id === "danger";
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all ${
                  isActive
                    ? isDanger
                      ? "bg-red-50 text-red-600"
                      : "bg-white text-[#1c1917] shadow-sm border border-stone-100"
                    : isDanger
                    ? "text-red-400 hover:bg-red-50 hover:text-red-600"
                    : "text-stone-400 hover:bg-white hover:text-[#1c1917]"
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {tabLabel}
              </button>
            );
          })}
        </div>

        {/* Content pane */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-10 py-8">

          {/* ── OVERVIEW ──────────────────────────────────────────────── */}
          {tab === "overview" && (
            <div className="max-w-xl space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-[15px] font-bold text-[#1c1917]">Overview</h2>
                <p className="text-[11px] text-stone-400 mt-0.5">A snapshot of your {label.toLowerCase()}'s activity.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: type === "channel" ? "Subscribers" : "Members", value: data?.subs || data?.members || "0" },
                  { label: "Posts",   value: "—" },
                  { label: "Activity", value: data?.activity || "—" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-stone-100 p-4 flex flex-col gap-1">
                    <span className="text-[20px] font-black text-[#1c1917]">{stat.value}</span>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-stone-100 p-4 space-y-2">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Description</p>
                <p className="text-[13px] text-stone-600 leading-relaxed">{data?.desc || "No description set."}</p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-3">
                {isPrivate
                  ? <><Lock size={15} className="text-stone-400" /><span className="text-[12px] font-bold text-stone-600">Private {label}</span></>
                  : <><Globe size={15} className="text-stone-400" /><span className="text-[12px] font-bold text-stone-600">Public {label}</span></>
                }
              </div>
            </div>
          )}

          {/* ── MEMBERS ───────────────────────────────────────────────── */}
          {tab === "members" && (
            <div className="max-w-xl space-y-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-[15px] font-bold text-[#1c1917]">Members</h2>
                <p className="text-[11px] text-stone-400 mt-0.5">People who are part of this {label.toLowerCase()}.</p>
              </div>
              <div className="flex flex-col gap-2">
                {/* Placeholder member rows */}
                {["You (Owner)", "sarah_c · Member", "alexr · Admin"].map((m) => (
                  <div key={m} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100">
                    <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-[11px] font-black text-stone-500 shrink-0">
                      {m.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[12px] font-bold text-[#1c1917] flex-1">{m}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-stone-400 text-center">Full member management coming soon.</p>
            </div>
          )}

          {/* ── SETTINGS ──────────────────────────────────────────────── */}
          {tab === "settings" && (
            <div className="max-w-xl space-y-5 animate-in fade-in duration-200">
              <div>
                <h2 className="text-[15px] font-bold text-[#1c1917]">Settings</h2>
                <p className="text-[11px] text-stone-400 mt-0.5">Edit your {label.toLowerCase()}'s public info.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">{label} Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 focus:border-stone-400 text-[13px] text-[#1c1917] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-200 focus:border-stone-400 text-[12px] text-[#1c1917] outline-none resize-none transition-colors"
                />
              </div>

              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className="w-full flex items-center justify-between p-3 px-4 rounded-xl bg-white border border-stone-200 hover:border-stone-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isPrivate ? <Lock size={15} className="text-stone-500" /> : <Globe size={15} className="text-stone-500" />}
                  <div className="text-left">
                    <p className="text-[12px] font-bold text-[#1c1917]">{isPrivate ? "Private" : "Public"}</p>
                    <p className="text-[9px] text-stone-400 uppercase tracking-tight">Click to toggle</p>
                  </div>
                </div>
                <div className={`w-9 h-5 rounded-full transition-colors ${isPrivate ? "bg-[#1c1917]" : "bg-stone-200"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-transform ${isPrivate ? "translate-x-4 ml-0.5" : "ml-0.5"}`} />
                </div>
              </button>

              <button className="px-5 py-2.5 bg-[#1c1917] text-white text-[12px] font-bold rounded-xl hover:bg-stone-800 transition-colors">
                Save Changes
              </button>
            </div>
          )}

          {/* ── DANGER ────────────────────────────────────────────────── */}
          {tab === "danger" && (
            <div className="max-w-xl space-y-4 animate-in fade-in duration-200">
              <div>
                <h2 className="text-[15px] font-bold text-red-600">Danger Zone</h2>
                <p className="text-[11px] text-stone-400 mt-0.5">These actions are permanent and cannot be undone.</p>
              </div>

              <div className="bg-white border border-red-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-bold text-[#1c1917]">Delete this {label}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Permanently removes the {label.toLowerCase()} and all its content for everyone.
                  </p>
                </div>
                <button
                  onClick={onDelete}
                  className="shrink-0 px-4 py-2 bg-red-500 text-white text-[11px] font-bold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete {label}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
