"use client";

import { useState } from "react";
import { Save, Rocket, Link2, Share, Check, AlertCircle } from "lucide-react";
import { useCommunitiesStore } from "@/store/communities/communities.store";

export default function Moreone({ data, update, setIsSuccess }: any) {
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [saved, setSaved] = useState(false);

  const { myChannels, updateChannel } = useCommunitiesStore();
  const isPublished = data.isPublished || false;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.handle || "").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showErr = (msg: string) => {
    setErrorMsg(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 1500);
  };

  const handleLaunch = () => {
    if (!data.title?.trim() || !data.channelId?.trim()) {
      showErr("Channel Name & ID required!");
      return;
    }

    const nameConflict = myChannels.some(
      (c) => c.id !== data.id && c.name.toLowerCase() === data.title.trim().toLowerCase()
    );
    if (nameConflict) {
      showErr("Channel name already taken!");
      return;
    }

    const idConflict = myChannels.some(
      (c) => c.id !== data.id &&
        c.handle.split("/")[0].replace("@", "").toLowerCase() === data.channelId.trim().toLowerCase()
    );
    if (idConflict) {
      showErr("Channel ID already taken!");
      return;
    }

    update({ isPublished: true });
    setIsSuccess(true);
  };

  const handleSave = () => {
    updateChannel(data.id, {
      name: data.title || "",
      desc: data.description || "",
      links: data.links || [],
      permissions: data.permissions,
      pool: data.pool || [],
      avatarUrl: data.avatarUrl || undefined,
      isPrivate: data.isPrivate ?? true,
      category: data.category || "General",
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-3 mt-2">
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
        {isPublished ? "Channel Actions" : "Launch Actions"}
      </label>

      <div className="flex flex-col gap-2">
        {!isPublished ? (
          <div className="relative w-full">
            <button
              onClick={handleLaunch}
              className="w-full py-2.5 bg-[#1c1917] hover:bg-black text-white rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              <Rocket size={14} strokeWidth={2.5} /> Launch Channel
            </button>
            {showError && (
              <div className="absolute -top-10 left-0 w-full flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <AlertCircle size={12} strokeWidth={3} />
                  {errorMsg}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-[#1c1917] hover:bg-black text-white rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              {saved
                ? <><Check size={14} strokeWidth={3} /> Saved!</>
                : <><Save size={14} strokeWidth={2.5} /> Save Changes</>
              }
            </button>
            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 bg-white border border-stone-200 text-[#1c1917] rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-[0.98] transition-all shadow-sm"
              >
                {copied ? <Check size={14} className="text-green-500" strokeWidth={3} /> : <Link2 size={14} strokeWidth={2.5} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button className="flex-1 py-2.5 bg-white border border-stone-200 text-[#1c1917] rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-1.5 hover:bg-stone-50 active:scale-[0.98] transition-all shadow-sm">
                <Share size={14} strokeWidth={2.5} /> Share Link
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
