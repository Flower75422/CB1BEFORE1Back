"use client";

import { useState } from "react";
import { X, Users, ArrowLeft, AlertTriangle, User, BellOff, Search, FileImage, ShieldAlert, LogOut, Globe, Lock } from "lucide-react";

type ViewState = "main" | "members" | "media" | "report";

export default function ChannelProfileView({ data, onCloseInfo }: any) {
  const [currentView, setCurrentView] = useState<ViewState>("main");
  const [isMuted, setIsMuted] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const dummyMembers = [
    { name: data?.owner || "Owner Name", role: "Owner" },
    { name: "Sarah Chen", role: "Subscriber" },
    { name: "Marco Polo", role: "Subscriber" },
    { name: "Wasim Akram", role: "Subscriber" }
  ];

  const dummyMedia = [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop&q=60",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=60"
  ];

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-stone-100 shrink-0 bg-white z-20">
        <div className="flex items-center gap-3">
          {currentView !== "main" && (
            <button onClick={() => setCurrentView("main")} className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95">
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
          )}
          <h3 className="text-[14px] font-black text-[#1c1917] uppercase tracking-wide">
            {currentView === "main" ? "Channel Info" : currentView}
          </h3>
        </div>
        <button onClick={onCloseInfo} className="p-1.5 bg-stone-100 text-stone-500 rounded-full hover:bg-stone-200 transition-colors active:scale-95">
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        
        {/* VIEW: MAIN INFO */}
        {currentView === "main" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="p-6 flex flex-col items-center text-center border-b border-stone-100">
              <div className="h-24 w-24 bg-stone-100 border border-stone-200 rounded-[28px] flex items-center justify-center text-3xl font-black text-[#1c1917] mb-4 shadow-sm overflow-hidden">
                {data?.avatarUrl ? (
                  <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (data?.channelName || "C").charAt(0).toUpperCase()
                )}
              </div>
              <h2 className="text-[18px] font-black text-[#1c1917] tracking-tight">{data?.channelName || "Channel"}</h2>
              
              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100">
                 <div className="h-4 w-4 bg-stone-200 text-stone-500 rounded-full flex items-center justify-center text-[8px] font-black"><User size={10} /></div>
                 <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Owner: <span className="text-[#1c1917]">{data?.owner || "You"}</span></span>
              </div>

              <p className="text-[12px] font-medium text-stone-500 mt-4 max-w-[250px] leading-relaxed">
                {data?.bio || "Welcome to the channel!"}
              </p>
              
              <div className="flex items-center gap-4 mt-4 text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                <button onClick={() => setCurrentView("members")} className="flex items-center gap-1.5 hover:text-[#1c1917] transition-colors bg-stone-50 px-3 py-1.5 rounded-lg active:scale-95 border border-stone-100">
                  <Users size={14} /> {data?.subs || 0} Subscribers
                </button>
              </div>
            </div>

            {/* INLINED SETTINGS */}
            <div className="p-6 pb-20 flex flex-col gap-2">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 px-1">Settings & Media</h4>
              
              <div className="flex flex-col gap-1">
                <button onClick={() => setIsMuted(!isMuted)} className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors flex justify-between items-center group">
                   <div className="flex items-center gap-3"><BellOff size={16} className="text-stone-500 group-hover:text-black" /><span className="text-[13px] font-bold text-[#1c1917]">Mute Notifications</span></div>
                   <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isMuted ? 'bg-stone-300' : 'bg-green-500'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isMuted ? 'left-1' : 'translate-x-5'}`}></div></div>
                </button>

                <button onClick={() => setIsPublic(!isPublic)} className="w-full p-3.5 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors flex justify-between items-center group">
                   <div className="flex items-center gap-3">{isPublic ? <Globe size={16} className="text-stone-500 group-hover:text-black" /> : <Lock size={16} className="text-stone-500 group-hover:text-black" />}<span className="text-[13px] font-bold text-[#1c1917]">{isPublic ? "Public Channel" : "Private Channel"}</span></div>
                   <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isPublic ? 'bg-blue-500' : 'bg-stone-300'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isPublic ? 'translate-x-5' : 'left-1'}`}></div></div>
                </button>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <button className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-white hover:border-stone-200 shadow-sm text-[#1c1917]"><div className="flex items-center gap-3"><div className="p-1.5 rounded-lg bg-stone-100 text-stone-500"><Search size={16} /></div><span className="text-[12px] font-bold">Search in Channel</span></div></button>
                <button onClick={() => setCurrentView("media")} className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-white hover:border-stone-200 shadow-sm text-[#1c1917]"><div className="flex items-center gap-3"><div className="p-1.5 rounded-lg bg-stone-100 text-stone-500"><FileImage size={16} /></div><span className="text-[12px] font-bold">Shared Media & Links</span></div></button>
                <button onClick={() => setCurrentView("report")} className="w-full p-3 rounded-xl flex items-center justify-between transition-colors border border-transparent hover:bg-red-50 hover:border-stone-200 shadow-sm text-red-500"><div className="flex items-center gap-3"><div className="p-1.5 rounded-lg bg-red-100 text-red-500"><ShieldAlert size={16} /></div><span className="text-[12px] font-bold">Report Channel</span></div></button>
              </div>

              <div className="mt-6">
                <button className="w-full py-3.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                  <LogOut size={16} /> Leave Channel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SUBSCRIBERS LIST */}
        {currentView === "members" && (
          <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Subscribers</h4>
            <div className="flex flex-col gap-2">
              {dummyMembers.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:border-stone-200 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#F5F5F4] rounded-full flex items-center justify-center text-[12px] font-black text-stone-500 group-hover:bg-stone-200 transition-colors">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2"><span className="text-[13px] font-bold text-[#1c1917]">{member.name}</span>{member.role === "Owner" && <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700">{member.role}</span>}</div>
                      <span className="text-[10px] font-semibold text-stone-400">@{(member.name.split(' ')[0] + Math.floor(Math.random()*100)).toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: SHARED MEDIA */}
        {currentView === "media" && (
          <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Shared Photos & Videos</h4>
            <div className="grid grid-cols-2 gap-3">
              {dummyMedia.map((url, i) => (
                <div key={i} className="aspect-square bg-stone-100 rounded-xl overflow-hidden border border-stone-200 cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={url} alt="Shared media" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: REPORT CHANNEL */}
        {currentView === "report" && (
          <div className="p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
              <AlertTriangle size={24} />
              <span className="text-[12px] font-bold leading-tight">You are reporting this channel for violating community guidelines.</span>
            </div>
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1 mt-4">Select a Reason</h4>
            <div className="flex flex-col gap-2">
              {["Spam or misleading", "Harassment or bullying", "Inappropriate content", "Intellectual property violation"].map((reason, i) => (
                <button key={i} className="w-full p-4 bg-white border border-stone-200 rounded-xl text-[13px] font-bold text-left hover:border-black hover:bg-stone-50 transition-colors">
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}