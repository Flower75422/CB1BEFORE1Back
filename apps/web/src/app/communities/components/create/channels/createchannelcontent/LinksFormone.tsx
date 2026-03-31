"use client";

import { X, Globe, Twitter, Linkedin, Instagram, Youtube, Github, Link2 } from "lucide-react";

const PLATFORMS = [
  { key: "website",   label: "Website",   icon: Globe },
  { key: "twitter",   label: "X",         icon: Twitter },
  { key: "linkedin",  label: "LinkedIn",  icon: Linkedin },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "youtube",   label: "YouTube",   icon: Youtube },
  { key: "github",    label: "GitHub",    icon: Github },
];

export default function LinksFormone({ data, update }: any) {
  const links: any[] = data?.links || [];

  const addLink = (platform: string, label: string) => {
    if (links.some((l) => l.platform === platform)) return;
    update({ links: [...links, { platform, label, url: "" }] });
  };

  const updateUrl = (index: number, url: string) => {
    const updated = links.map((l, i) => (i === index ? { ...l, url } : l));
    update({ links: updated });
  };

  const removeLink = (index: number) => {
    update({ links: links.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3 mt-2">
      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
        Social Links
      </label>

      {/* Platform quick-add buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PLATFORMS.map(({ key, label, icon: Icon }) => {
          const added = links.some((l) => l.platform === key);
          return (
            <button
              key={key}
              onClick={() => addLink(key, label)}
              disabled={added}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                added
                  ? "bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed"
                  : "bg-[#F5F5F4] text-stone-600 border-transparent hover:border-stone-300 hover:text-[#1c1917]"
              }`}
            >
              <Icon size={11} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Added links list */}
      {links.filter((l) => l.platform !== "custom").length > 0 ? (
        <div className="flex flex-col gap-2">
          {links
            .map((link, i) => ({ link, i }))
            .filter(({ link }) => link.platform !== "custom")
            .map(({ link, i }) => {
              const platform = PLATFORMS.find((p) => p.key === link.platform);
              const Icon = platform?.icon || Link2;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 px-3 rounded-xl bg-[#F5F5F4] border border-transparent hover:border-stone-200 transition-colors"
                >
                  <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-500">
                    <Icon size={12} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 w-[58px] shrink-0">
                    {link.label}
                  </span>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateUrl(i, e.target.value)}
                    placeholder="https://"
                    className="flex-1 bg-transparent text-[11px] text-[#1c1917] placeholder-stone-300 outline-none font-medium min-w-0"
                  />
                  <button
                    onClick={() => removeLink(i)}
                    className="shrink-0 text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-[10px] text-stone-400 text-center py-2">
          Click a platform above to add a link
        </p>
      )}
    </div>
  );
}
