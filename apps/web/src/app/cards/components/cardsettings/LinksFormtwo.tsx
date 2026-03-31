"use client";

import { useState } from "react";
import { Plus, X, Link2, AlertCircle } from "lucide-react";

// Fix #9: URL validation helper
const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function LinksFormtwo({ card, updateCard }: any) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const links: any[] = card?.links || [];
  const customLinks = links.filter((l) => l.platform === "custom");

  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (val && !isValidUrl(val)) {
      setUrlError("Enter a valid URL (e.g. https://example.com)");
    } else {
      setUrlError("");
    }
  };

  const canAdd = label.trim().length > 0 && isValidUrl(url);

  const addCustom = () => {
    if (!canAdd) return;
    updateCard({
      links: [...links, { platform: "custom", label: label.trim(), url: url.trim() }],
    });
    setLabel("");
    setUrl("");
    setUrlError("");
  };

  const removeLink = (globalIndex: number) => {
    updateCard({ links: links.filter((_, i) => i !== globalIndex) });
  };

  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
        Custom Link
      </label>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder='Label  (e.g. "Book a call")'
          maxLength={30}
          className="w-full px-3 py-2 rounded-xl bg-[#F5F5F4] border border-transparent focus:border-stone-300 text-[12px] text-[#1c1917] placeholder-stone-400 outline-none transition-colors"
        />
        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://"
              className={`flex-1 px-3 py-2 rounded-xl bg-[#F5F5F4] border text-[12px] text-[#1c1917] placeholder-stone-400 outline-none transition-colors ${
                urlError ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-stone-300'
              }`}
            />
            <button
              onClick={addCustom}
              disabled={!canAdd}
              className="px-3 py-2 rounded-xl bg-[#1c1917] text-white disabled:opacity-30 hover:bg-stone-800 transition-colors shrink-0"
              title={!label.trim() ? "Enter a label first" : !isValidUrl(url) ? "Enter a valid URL" : "Add link"}
            >
              <Plus size={14} />
            </button>
          </div>
          {urlError && (
            <div className="flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <AlertCircle size={10} className="text-red-400" strokeWidth={3} />
              <span className="text-[9px] font-bold text-red-400">{urlError}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-[9px] font-semibold text-stone-400 ml-1">
        Add any link with a custom label — portfolio, booking page, newsletter, etc.
      </p>

      {customLinks.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {customLinks.map((link) => {
            const globalIndex = links.indexOf(link);
            return (
              <div
                key={globalIndex}
                className="flex items-center gap-2 p-2 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors"
              >
                <Link2 size={11} className="text-stone-400 shrink-0" />
                <span className="text-[11px] font-bold text-stone-700 truncate w-[80px] shrink-0">
                  {link.label}
                </span>
                <span className="text-[10px] text-stone-400 truncate flex-1">{link.url}</span>
                <button
                  onClick={() => removeLink(globalIndex)}
                  className="shrink-0 text-stone-300 hover:text-red-400 transition-colors"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
