"use client";

import { useState } from "react";
import { Check, Mail, Phone, Trash2, AlertTriangle, ShieldAlert, UserCircle2 } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";

const inputCls = "w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-[13px] text-stone-600 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors";

export default function Account() {
  const { profileData, updateProfile } = useProfileStore();

  const [email, setEmail]               = useState(profileData.email ?? "");
  const [phone, setPhone]               = useState(profileData.phone ?? "");
  const [showDanger, setShowDanger]     = useState(false);
  const [saved, setSaved]               = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSave = () => {
    updateProfile({ email: email.trim(), phone: phone.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 4000);
    } else {
      alert("Account deletion would happen here in production.");
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-stone-700">Account Details</h2>
        <p className="text-[12px] text-stone-400 mt-0.5">Manage your contact information and account</p>
      </div>

      {/* ── Account Summary Card ─────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-4 py-4 bg-stone-50/60 border border-stone-100 rounded-2xl">
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-200 shrink-0">
          <img
            src={profileData.avatarUrl}
            alt={profileData.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-stone-700 truncate">{profileData.name}</p>
          <p className="text-[11px] text-stone-400 truncate">@{profileData.username}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">Active</span>
        </div>
      </div>

      {/* ── Contact Information ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3 bg-stone-50/60 border border-stone-100 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-stone-100">
            <UserCircle2 size={11} className="text-stone-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Contact</span>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-stone-400 ml-0.5 flex items-center gap-1">
            <Mail size={10} /> Email Address
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputCls}
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-stone-400 ml-0.5 flex items-center gap-1.5">
            <Phone size={10} /> Phone Number
            <span className="text-red-400 text-[10px]">*</span>
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 xxxxxxxxxx"
            className={inputCls}
          />
          <p className="text-[10px] text-stone-300 ml-0.5">Required for account verification</p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleSave}
            disabled={!email.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-[12px] font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={13} /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ── Danger Zone ──────────────────────────────────────────────── */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${showDanger ? "border-red-200 bg-red-50/30" : "border-stone-100"}`}>

        <button
          onClick={() => setShowDanger(!showDanger)}
          className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${showDanger ? "bg-red-50/50" : "bg-stone-50/60 hover:bg-stone-50"}`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg transition-colors ${showDanger ? "bg-red-100" : "bg-stone-100"}`}>
              <ShieldAlert size={13} className={showDanger ? "text-red-500" : "text-stone-400"} />
            </div>
            <div className="text-left">
              <p className={`text-[13px] font-medium ${showDanger ? "text-red-600" : "text-stone-600"}`}>Danger Zone</p>
              <p className="text-[11px] text-stone-400">Irreversible account actions</p>
            </div>
          </div>
          <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-colors ${showDanger ? "text-red-500 bg-white border-red-200" : "text-stone-400 bg-white border-stone-200"}`}>
            {showDanger ? "Hide" : "Show"}
          </span>
        </button>

        {showDanger && (
          <div className="px-4 py-4 border-t border-red-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-4 p-3.5 bg-white border border-red-100 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-stone-700">Delete Account</p>
                  <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                    Permanently removes your account, content, channels and all data. This cannot be undone.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDelete}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium transition-all active:scale-95 ${
                  deleteConfirm
                    ? "bg-red-500 text-white border border-red-500"
                    : "bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                }`}
              >
                <Trash2 size={12} />
                {deleteConfirm ? "Tap again to confirm" : "Delete Account"}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
