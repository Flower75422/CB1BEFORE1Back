"use client";

import { useState, useEffect } from "react";
import { UserPlus, ShieldAlert, Crown, MoreVertical, Trash2, PenTool, Loader2, AlertCircle } from "lucide-react";

const VALID_USERS = ["@wasim", "@sarahc", "@alexr", "@dr_aris"];

export default function TeamFormtwo({ data, update }: any) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [newHandle, setNewHandle] = useState("");
  const [newRole, setNewRole] = useState("Moderator"); 
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const team = data.team || [{ name: "You", handle: "@wasim", role: "Owner" }];
  
  const currentEditors = team.filter((m: any) => m.role === "Editor").length;
  const currentTotal = team.length;

  useEffect(() => {
    const close = () => setActiveMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const updateTeam = (idx: number, changes: any) => {
    const updated = [...team];
    updated[idx] = { ...updated[idx], ...changes };
    update({ team: updated });
    setActiveMenu(null);
  };

  const removeUser = (idx: number) => {
    if (confirm("Remove team member from draft?")) {
      update({ team: team.filter((_: any, i: number) => i !== idx) });
    }
    setActiveMenu(null);
  };

  const handleAddUser = async () => {
    if (!newHandle.trim()) return;
    setSearchError("");

    if (currentTotal >= 20) {
      setSearchError("Maximum team size (20) reached.");
      return;
    }

    setIsSearching(true);
    const formattedHandle = newHandle.startsWith("@") ? newHandle.toLowerCase() : `@${newHandle.toLowerCase()}`;
    await new Promise(resolve => setTimeout(resolve, 600));

    if (team.some((m: any) => m.handle.toLowerCase() === formattedHandle)) {
      setSearchError("User is already on the team.");
      setIsSearching(false);
      return;
    }

    if (VALID_USERS.includes(formattedHandle)) {
      const newUser = {
        name: formattedHandle.replace("@", "").charAt(0).toUpperCase() + formattedHandle.slice(2),
        handle: formattedHandle,
        role: newRole
      };
      update({ team: [...team, newUser] });
      setNewHandle(""); 
      setNewRole("Moderator");
    } else {
      setSearchError("User not found.");
    }
    setIsSearching(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between ml-1">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Add Team Members</label>
        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{currentEditors} Editors</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-colors ${searchError ? 'bg-red-50 border-red-200' : 'bg-[#F5F5F4] border-transparent hover:border-stone-300 shadow-sm'}`}>
          <input 
            type="text" 
            value={newHandle}
            onChange={(e) => { setNewHandle(e.target.value); setSearchError(""); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
            placeholder="@handle..." 
            className="flex-1 px-3 py-1.5 bg-white rounded-lg font-bold text-[11px] outline-none shadow-sm text-[#1c1917] border border-stone-200" 
            disabled={isSearching}
          />
          <select 
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-1 py-1.5 bg-transparent font-bold text-[11px] outline-none cursor-pointer text-[#1c1917]"
            disabled={isSearching}
          >
            <option value="Moderator">Moderator</option>
            <option value="Editor">Editor</option>
          </select>
          <button 
            onClick={handleAddUser}
            disabled={isSearching || !newHandle.trim()}
            className="h-7 px-3 bg-[#1c1917] text-white rounded-lg hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center min-w-[36px] shadow-sm"
          >
            {isSearching ? <Loader2 size={12} strokeWidth={3} className="animate-spin" /> : <UserPlus size={12} strokeWidth={3} />}
          </button>
        </div>
        
        {searchError && (
          <div className="flex items-center gap-1.5 px-2 text-red-500">
            <AlertCircle size={10} strokeWidth={3} />
            <span className="text-[9px] font-bold uppercase tracking-wide">{searchError}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-2 pb-10">
        {team.map((m: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 px-3 bg-white border border-stone-200 rounded-xl shadow-sm relative group hover:border-stone-300 transition-colors">
            
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 bg-[#F5F5F4] rounded-full flex items-center justify-center text-[10px] font-black text-[#1c1917]">{m.name.charAt(0)}</div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#1c1917] leading-none">{m.name}</span>
                <span className="text-[9px] font-semibold text-stone-400 mt-0.5">{m.handle}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {m.role === 'Owner' && <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700"><Crown size={8} strokeWidth={3} /> Owner</span>}
              {m.role === 'Editor' && <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700"><PenTool size={8} strokeWidth={3} /> Editor</span>}
              {m.role === 'Moderator' && <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700"><ShieldAlert size={8} strokeWidth={3} /> Moderator</span>}

              {m.role !== 'Owner' && (
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === i ? null : i); }} className="p-1 text-stone-400 hover:text-black rounded-md transition-colors">
                    <MoreVertical size={14} />
                  </button>

                  {activeMenu === i && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                      {m.role === 'Moderator' ? (
                        <button onClick={() => updateTeam(i, { role: 'Editor' })} className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-[#1c1917] hover:bg-stone-50 flex items-center gap-2 transition-colors"><PenTool size={12} strokeWidth={2.5} /> Promote to Editor</button>
                      ) : (
                        <button onClick={() => updateTeam(i, { role: 'Moderator' })} className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-stone-500 hover:bg-stone-50 flex items-center gap-2 transition-colors"><ShieldAlert size={12} strokeWidth={2.5} /> Demote to Moderator</button>
                      )}
                      <div className="h-[1px] bg-stone-100 my-1" />
                      <button onClick={() => removeUser(i)} className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"><Trash2 size={12} strokeWidth={2.5} /> Remove User</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}