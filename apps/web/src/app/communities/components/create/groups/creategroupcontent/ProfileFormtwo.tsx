"use client";

import { useState, useEffect } from "react";
import { UserPlus, ShieldAlert, Crown, MoreVertical, Trash2, Shield, Settings, UserCog, MessageSquareWarning, Check, Loader2, AlertCircle } from "lucide-react";

const ADMIN_RIGHTS = [
  { id: "users", label: "Manage Users", desc: "Add, remove, or ban members", icon: UserCog },
  { id: "settings", label: "Group Settings", desc: "Change group name, cover, and bio", icon: Settings },
  { id: "content", label: "Moderate Content", desc: "Delete messages and shared media", icon: MessageSquareWarning }
];

// Mock database of valid users
const VALID_USERS = ["@wasim", "@sarahc", "@alexr", "@dr_aris", "@elenar", "@marcop"];

export default function ProfileFormtwo({ data, update }: any) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  
  // New State for Add User Flow
  const [newHandle, setNewHandle] = useState("");
  const [newRole, setNewRole] = useState("Member");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const members = data.members || [
    { name: "You", handle: "@wasim", role: "Owner" },
    { name: "Sarah Chen", handle: "@sarahc", role: "Admin" }
  ];

  const adminRights = data.adminRights || ["content", "users"];

  useEffect(() => {
    const close = () => setActiveMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // --- LIMIT CHECKERS ---
  const currentAdmins = members.filter((m: any) => m.role === "Admin").length;
  const currentTotal = members.length;

  // --- ACTIONS ---
  const updateMember = (idx: number, changes: any) => {
    // 🔴 FIX: Check admin limit before promoting an existing member
    if (changes.role === "Admin" && currentAdmins >= 6) {
      alert("Limit Reached: You can only have a maximum of 6 Admins.");
      setActiveMenu(null);
      return;
    }

    const updated = [...members];
    updated[idx] = { ...updated[idx], ...changes };
    update({ members: updated });
    setActiveMenu(null);
  };

  const removeUser = (idx: number) => {
    if (confirm("Remove user from draft?")) {
      update({ members: members.filter((_: any, i: number) => i !== idx) });
    }
    setActiveMenu(null);
  };

  const toggleAdminRight = (rightId: string) => {
    const newRights = adminRights.includes(rightId) 
      ? adminRights.filter((r: string) => r !== rightId) 
      : [...adminRights, rightId];
    update({ adminRights: newRights });
  };

  // 🔴 SIMULATED API CALL
  const handleAddUser = async () => {
    if (!newHandle.trim()) return;
    
    setSearchError("");

    // 🔴 FIX: Check Hard Limits before even searching
    if (newRole === "Admin" && currentAdmins >= 6) {
      setSearchError("Maximum 6 Admins allowed.");
      return;
    }
    if (currentTotal >= 60000) {
      setSearchError("Maximum group capacity (60,000) reached.");
      return;
    }

    setIsSearching(true);
    
    const formattedHandle = newHandle.startsWith("@") ? newHandle.toLowerCase() : `@${newHandle.toLowerCase()}`;
    await new Promise(resolve => setTimeout(resolve, 600));

    if (members.some((m: any) => m.handle.toLowerCase() === formattedHandle)) {
      setSearchError("User is already in the list");
      setIsSearching(false);
      return;
    }

    if (VALID_USERS.includes(formattedHandle)) {
      const newUser = {
        name: formattedHandle.replace("@", "").charAt(0).toUpperCase() + formattedHandle.slice(2),
        handle: formattedHandle,
        role: newRole
      };
      
      update({ members: [...members, newUser] });
      setNewHandle(""); 
      setNewRole("Member");
    } else {
      setSearchError("User not found.");
    }
    
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      
      {/* --- TOP: GLOBAL ADMIN PRIVILEGES --- */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Global Admin Privileges</label>
        
        <div className="grid grid-cols-1 gap-2">
          {ADMIN_RIGHTS.map((r) => {
            const hasRight = adminRights.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => toggleAdminRight(r.id)}
                className="flex items-start gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-stone-300 transition-all text-left group"
              >
                <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-[4px] flex items-center justify-center transition-colors border ${hasRight ? 'bg-[#1c1917] border-[#1c1917] text-white' : 'bg-white border-stone-300 text-transparent group-hover:border-[#1c1917]'}`}>
                  <Check size={10} strokeWidth={4} />
                </div>
                
                <div className="flex flex-col">
                  <span className={`text-[12px] font-bold leading-none transition-colors ${hasRight ? 'text-[#1c1917]' : 'text-stone-500'}`}>
                    {r.label}
                  </span>
                  <span className="text-[10px] font-medium text-stone-400 mt-1">
                    {r.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- BOTTOM: MEMBER MANAGEMENT --- */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <div className="flex items-center justify-between ml-1">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Assign Roles</label>
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
            {currentAdmins}/6 Admins
          </span>
        </div>

        {/* Interactive Toolbar */}
        <div className="flex flex-col gap-1.5">
          <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-colors ${searchError ? 'bg-red-50 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
            <input 
              type="text" 
              value={newHandle}
              onChange={(e) => { setNewHandle(e.target.value); setSearchError(""); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
              placeholder="@handle..." 
              className="flex-1 px-3 py-1.5 bg-white rounded-lg font-bold text-[11px] outline-none shadow-sm text-[#1c1917]" 
              disabled={isSearching}
            />
            <div className="h-6 w-[1px] bg-stone-200 mx-0.5" />
            <select 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="px-1 py-1.5 bg-transparent font-bold text-[11px] outline-none cursor-pointer text-[#1c1917]"
              disabled={isSearching}
            >
              <option value="Member">Member</option>
              {/* Disable Admin option if limit reached */}
              <option value="Admin" disabled={currentAdmins >= 6}>Admin</option>
            </select>
            <button 
              onClick={handleAddUser}
              disabled={isSearching || !newHandle.trim()}
              className="h-7 px-3 bg-[#1c1917] text-white rounded-lg hover:bg-black active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center min-w-[36px]"
            >
              {isSearching ? <Loader2 size={12} strokeWidth={3} className="animate-spin" /> : <UserPlus size={12} strokeWidth={3} />}
            </button>
          </div>
          
          {/* Error Message Display */}
          {searchError && (
            <div className="flex items-center gap-1.5 px-2 text-red-500">
              <AlertCircle size={10} strokeWidth={3} />
              <span className="text-[9px] font-bold uppercase tracking-wide">{searchError}</span>
            </div>
          )}
        </div>

        {/* Dynamic Member List */}
        <div className="flex flex-col gap-1.5 mt-2 pb-10">
          {members.map((m: any, i: number) => (
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
                {m.role === 'Admin' && <span className="flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700"><ShieldAlert size={8} strokeWidth={3} /> Admin</span>}
                {m.role === 'Member' && <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 border border-transparent">Member</span>}

                {/* 3-Dot Menu Trigger */}
                {m.role !== 'Owner' && (
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === i ? null : i); }} className="p-1 text-stone-400 hover:text-black rounded-md transition-colors">
                      <MoreVertical size={14} />
                    </button>

                    {/* Absolute Dropdown Menu */}
                    {activeMenu === i && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                        {m.role === 'Member' ? (
                          <button 
                            onClick={() => updateMember(i, { role: 'Admin' })} 
                            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-[#1c1917] hover:bg-stone-50 flex items-center gap-2 transition-colors"
                          >
                            <Shield size={12} strokeWidth={2.5} /> Promote to Admin
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateMember(i, { role: 'Member' })} 
                            className="w-full text-left px-3 py-2 text-[10px] font-black uppercase text-stone-500 hover:bg-stone-50 flex items-center gap-2 transition-colors"
                          >
                            <ShieldAlert size={12} strokeWidth={2.5} /> Demote to Member
                          </button>
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

    </div>
  );
}