"use client";

import { useState } from "react";
import {
  KeyRound, Shield, ShieldCheck, Eye, EyeOff,
  Smartphone, Laptop, LogOut, Check, AlertCircle,
  Lock, Wifi,
} from "lucide-react";
import { useSettingsStore } from "@/store/settings/settings.store";

const SESSIONS = [
  { id: 1, device: "Chrome on Windows", location: "Hyderabad, IN", time: "Active now",  icon: Laptop,     current: true  },
  { id: 2, device: "Safari on iPhone",  location: "Hyderabad, IN", time: "2 hours ago", icon: Smartphone, current: false },
];

const inputCls = "w-full px-3.5 py-2.5 pr-10 bg-white border border-stone-200 rounded-xl text-[13px] text-stone-600 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors";

function SectionBlock({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 bg-stone-50/60 border border-stone-100 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-stone-100">
          <Icon size={11} className="text-stone-500" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function Security() {
  const { twoFAEnabled, setTwoFAEnabled } = useSettingsStore();
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [currentPw,    setCurrentPw]    = useState("");
  const [newPw,        setNewPw]        = useState("");
  const [pwSaved,      setPwSaved]      = useState(false);
  const [pwError,      setPwError]      = useState("");
  const [sessions,     setSessions]     = useState(SESSIONS);

  const handleUpdatePassword = () => {
    if (!currentPw.trim()) { setPwError("Enter your current password"); return; }
    if (newPw.length < 6)  { setPwError("New password must be at least 6 characters"); return; }
    setPwError("");
    setPwSaved(true);
    setCurrentPw(""); setNewPw("");
    setTimeout(() => setPwSaved(false), 2500);
  };

  const handleRevoke = (id: number) => setSessions(prev => prev.filter(s => s.id !== id));

  // Derive a simple security score label
  const score = [twoFAEnabled, sessions.length === 1].filter(Boolean).length;
  const scoreLabel = score === 2 ? "Strong" : score === 1 ? "Fair" : "Basic";
  const scoreColor = score === 2 ? "text-green-600 bg-green-50 border-green-100"
                   : score === 1 ? "text-amber-600 bg-amber-50 border-amber-100"
                   : "text-stone-500 bg-stone-100 border-stone-200";
  const scoreBar   = score === 2 ? "w-full bg-green-400"
                   : score === 1 ? "w-2/3 bg-amber-400"
                   : "w-1/3 bg-stone-300";

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-stone-700">Security</h2>
        <p className="text-[12px] text-stone-400 mt-0.5">Password, 2FA and active sessions</p>
      </div>

      {/* ── Security Overview ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-4 py-4 bg-stone-50/60 border border-stone-100 rounded-2xl">
        <div className={`p-2.5 rounded-xl border ${scoreColor}`}>
          {twoFAEnabled
            ? <ShieldCheck size={18} />
            : <Shield      size={18} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-[13px] font-semibold text-stone-700">Account Security</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreColor}`}>{scoreLabel}</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${scoreBar}`} />
          </div>
        </div>
      </div>

      {/* ── Change Password ───────────────────────────────────────────── */}
      <SectionBlock icon={KeyRound} label="Change Password">

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-stone-400 ml-0.5 flex items-center gap-1">
            <Lock size={10} /> Current Password
          </span>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPw}
              onChange={e => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
            <button
              onClick={() => setShowCurrent(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
            >
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-stone-400 ml-0.5 flex items-center gap-1">
            <Lock size={10} /> New Password
          </span>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="••••••••"
              className={`${inputCls} ${newPw && newPw.length < 6 ? "border-amber-300 focus:border-amber-400" : ""}`}
            />
            <button
              onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {newPw && newPw.length < 6 && (
            <p className="text-[10px] text-amber-500 ml-0.5 flex items-center gap-1">
              <AlertCircle size={10} /> At least 6 characters required
            </p>
          )}
        </div>

        {pwError && (
          <p className="text-[11px] text-red-400 ml-0.5 flex items-center gap-1">
            <AlertCircle size={11} /> {pwError}
          </p>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleUpdatePassword}
            disabled={!currentPw || !newPw}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-[12px] font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {pwSaved ? <><Check size={13} /> Updated!</> : "Update Password"}
          </button>
        </div>

      </SectionBlock>

      {/* ── Two-Factor Auth ───────────────────────────────────────────── */}
      <SectionBlock icon={ShieldCheck} label="Two-Factor Authentication">
        <div className={`flex items-center justify-between px-3.5 py-3.5 rounded-xl border transition-all ${twoFAEnabled ? "bg-green-50/60 border-green-100" : "bg-white border-stone-100"}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${twoFAEnabled ? "bg-green-100 border border-green-200" : "bg-stone-100"}`}>
              {twoFAEnabled
                ? <ShieldCheck size={15} className="text-green-600" />
                : <Shield      size={15} className="text-stone-400" />
              }
            </div>
            <div>
              <p className="text-[13px] font-medium text-stone-700 flex items-center gap-2">
                Authenticator App
                {twoFAEnabled && (
                  <span className="text-[10px] text-green-600 bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-md font-bold">ON</span>
                )}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {twoFAEnabled ? "Your account is protected with 2FA" : "Add an extra layer of security"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${twoFAEnabled ? "bg-green-500" : "bg-stone-200"}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${twoFAEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </SectionBlock>

      {/* ── Active Sessions ───────────────────────────────────────────── */}
      <SectionBlock icon={Wifi} label={`Active Sessions · ${sessions.length}`}>
        <div className="flex flex-col gap-2">
          {sessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors ${
                  session.current ? "bg-stone-800 border-stone-700" : "bg-white border-stone-100 hover:border-stone-200"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${session.current ? "bg-white/10" : "bg-stone-100"}`}>
                  <Icon size={14} className={session.current ? "text-white" : "text-stone-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium flex items-center gap-2 ${session.current ? "text-white" : "text-stone-600"}`}>
                    {session.device}
                    {session.current && (
                      <span className="text-[10px] text-stone-800 bg-white px-1.5 py-0.5 rounded-md font-bold">This device</span>
                    )}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${session.current ? "text-stone-300" : "text-stone-400"}`}>
                    {session.location} · {session.time}
                  </p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    className="flex items-center gap-1.5 text-[11px] text-red-400 hover:text-red-600 font-medium transition-colors active:scale-95 shrink-0"
                  >
                    <LogOut size={12} /> Revoke
                  </button>
                )}
              </div>
            );
          })}
          {sessions.length === 0 && (
            <p className="text-[12px] text-stone-400 text-center py-3">No active sessions</p>
          )}
        </div>
      </SectionBlock>

    </div>
  );
}
