"use client";

import { useState } from "react";
import { Plus, X, Link2 } from "lucide-react";

export default function LinksFormtwo({ data, update }: any) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const links: any[] = data?.links || [];
  const customLinks = links.filter((l) => l.platform === "custom");

  const canAdd = label.trim().length > 0 && url.trim().length > 0;

  const addCustom = () => {
    if (!canAdd) return;
    update({
      links: [...links, { platform: "custom", label: label.trim(), url: url.trim() }],
    });
    setLabel("");
    setUrl("");
  };

  const removeLink = (globalIndex: number) => {
    update({ links: links.filter((_, i) => i !== globalIndex) });
  };

  return (
    <div className="space-y-3 mt-2">
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
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="flex-1 px-3 py-2 rounded-xl bg-[#F5F5F4] border border-transparent focus:border-stone-300 text-[12px] text-[#1c1917] placeholder-stone-400 outline-none transition-colors"
          />
          <button
            onClick={addCustom}
            disabled={!canAdd}
            className="px-3 py-2 rounded-xl bg-[#1c1917] text-white disabled:opacity-30 hover:bg-stone-800 transition-colors shrink-0"
          >
            <Plus size={14} />
          </button>
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
