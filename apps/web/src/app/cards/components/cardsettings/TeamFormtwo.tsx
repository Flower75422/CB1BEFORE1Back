"use client";

import { useState } from "react";
import { UserPlus, Crown, Trash2 } from "lucide-react";

export default function TeamFormtwo({ card, updateCard }: any) {
  const [newHandle, setNewHandle] = useState("");
  const team = card?.team || [{ name: "You", handle: "@user", role: "Owner" }];

  const removeUser = (idx: number) => {
    if (confirm("Remove team member?")) updateCard({ team: team.filter((_: any, i: number) => i !== idx) });
  };

  const handleAddUser = () => {
    if (!newHandle.trim() || team.length >= 20) return;
    const formattedHandle = newHandle.startsWith("@") ? newHandle : `@${newHandle}`;
    updateCard({ team: [...team, { name: "New User", handle: formattedHandle, role: "Editor" }] });
    setNewHandle(""); 
  };

  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Add Collaborators</label>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl border bg-[#F5F5F4] border-transparent hover:border-stone-300 shadow-sm">
          <input type="text" value={newHandle} onChange={(e) => setNewHandle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddUser()} placeholder="@handle..." className="flex-1 px-3 py-1.5 bg-white rounded-lg font-bold text-[11px] outline-none shadow-sm text-[#1c1917] border border-stone-200" />
          <button onClick={handleAddUser} className="h-7 px-3 bg-[#1c1917] text-white rounded-lg hover:bg-black active:scale-95 transition-all flex items-center justify-center shadow-sm"><UserPlus size={12} strokeWidth={3} /></button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 mt-2 pb-4">
        {team.map((m: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 px-3 bg-white border border-stone-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 bg-[#F5F5F4] rounded-full flex items-center justify-center text-[10px] font-black text-[#1c1917]">{m.name.charAt(0)}</div>
              <div className="flex flex-col"><span className="text-[12px] font-bold text-[#1c1917] leading-none">{m.name}</span><span className="text-[9px] font-semibold text-stone-400 mt-0.5">{m.handle}</span></div>
            </div>
            {m.role === 'Owner' ? <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700"><Crown size={8} strokeWidth={3} /> Owner</span> : <button onClick={() => removeUser(i)} className="text-stone-400 hover:text-red-500 p-1 rounded-md transition-colors"><Trash2 size={14} /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}