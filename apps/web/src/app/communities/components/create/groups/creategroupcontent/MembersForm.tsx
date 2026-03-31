"use client";

import { useState } from "react";
import { UserPlus, X, ShieldCheck, User, Loader2 } from "lucide-react";

// Mock valid users for handle validation (replace with real API later)
const VALID_USERS = ["@wasim", "@sarahc", "@alexr", "@dr_aris", "@elena_r", "@marco_p"];

const ROLES = ["Member", "Admin"] as const;
type Role = (typeof ROLES)[number];

interface MemberEntry {
  handle: string;
  role: Role;
}

export default function MembersForm({ data, update }: any) {
  const [input, setInput] = useState("");
  const [role, setRole] = useState<Role>("Member");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  const members: MemberEntry[] = data?.members || [];

  const normalize = (h: string) => (h.startsWith("@") ? h : `@${h}`).toLowerCase();

  const addMember = async () => {
    const handle = normalize(input.trim());
    if (!handle || handle === "@") return;

    if (members.some((m) => m.handle === handle)) {
      setError("Already added.");
      return;
    }

    setIsChecking(true);
    setError("");

    // Simulate async lookup
    await new Promise((r) => setTimeout(r, 500));

    if (!VALID_USERS.includes(handle)) {
      setError("User not found.");
      setIsChecking(false);
      return;
    }

    update({ members: [...members, { handle, role }] });
    setInput("");
    setIsChecking(false);
  };

  const removeMember = (handle: string) => {
    update({ members: members.filter((m) => m.handle !== handle) });
  };

  const changeRole = (handle: string, newRole: Role) => {
    update({
      members: members.map((m) => (m.handle === handle ? { ...m, role: newRole } : m)),
    });
  };

  return (
    <div className="space-y-4 mt-2">

      {/* ── Invite members ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
          Invite Members
        </label>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-stone-300">@</span>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value.replace(/^@/, "")); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              placeholder="handle"
              className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#F5F5F4] border border-transparent focus:border-stone-300 text-[12px] text-[#1c1917] placeholder-stone-300 outline-none transition-colors"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="shrink-0 bg-white border border-stone-200 text-[#1c1917] text-[11px] font-bold rounded-xl px-2 py-2 outline-none shadow-sm cursor-pointer hover:border-stone-300 transition-colors"
          >
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <button
            onClick={addMember}
            disabled={isChecking || !input.trim()}
            className="shrink-0 px-3 py-2 rounded-xl bg-[#1c1917] text-white disabled:opacity-30 hover:bg-stone-800 transition-colors"
          >
            {isChecking ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
          </button>
        </div>

        {error && <p className="text-[10px] text-red-500 ml-1">{error}</p>}
        <p className="text-[9px] font-semibold text-stone-400 ml-1">
          Members you invite will get a join notification. Max 500 members.
        </p>
      </div>

      {/* ── Added members list ───────────────────────────────────────────── */}
      {members.length > 0 && (
        <div className="space-y-2">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
            Added · {members.length}
          </label>
          <div className="flex flex-col gap-1.5">
            {members.map((m) => (
              <div
                key={m.handle}
                className="flex items-center gap-2 p-2 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                  <User size={12} className="text-stone-500" />
                </div>
                <span className="flex-1 text-[11px] font-bold text-[#1c1917]">{m.handle}</span>

                <select
                  value={m.role}
                  onChange={(e) => changeRole(m.handle, e.target.value as Role)}
                  className="bg-white border border-stone-200 text-[10px] font-bold text-stone-600 rounded-lg px-1.5 py-1 outline-none cursor-pointer hover:border-stone-300 transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                {m.role === "Admin" && (
                  <ShieldCheck size={12} className="text-stone-400 shrink-0" />
                )}

                <button
                  onClick={() => removeMember(m.handle)}
                  className="shrink-0 text-stone-300 hover:text-red-400 transition-colors"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {members.length === 0 && (
        <p className="text-[10px] text-stone-400 text-center py-3">
          No members added yet. Search by handle above.
        </p>
      )}
    </div>
  );
}
