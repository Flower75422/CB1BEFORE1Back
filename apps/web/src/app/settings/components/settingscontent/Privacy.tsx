"use client";

import { useState } from "react";
import {
  Globe, Lock, Users, MessageSquare,
  EyeOff, UserMinus, Ban, X, ChevronDown, ChevronUp, Download, Check, ShieldCheck,
  UserRound, ScrollText,
} from "lucide-react";
import { usePrivacyStore, PrivacyAction, VisibilityLevel } from "@/store/privacy/privacy.store";

// ─── Managed Content helpers (UNCHANGED) ─────────────────────────────────────

interface ManagedItem {
  key: string;
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  type: "channel" | "group";
  action: PrivacyAction;
  onRemove: () => void;
}

const ACTION_META: Record<
  PrivacyAction,
  { label: string; icon: React.ElementType; textColor: string; bgColor: string; borderColor: string; badgeBg: string }
> = {
  hide:     { label: "Hidden",     icon: EyeOff,    textColor: "text-stone-600", bgColor: "bg-stone-50",  borderColor: "border-stone-200", badgeBg: "bg-stone-100 text-stone-500" },
  restrict: { label: "Restricted", icon: UserMinus, textColor: "text-amber-700", bgColor: "bg-amber-50",  borderColor: "border-amber-200", badgeBg: "bg-amber-100 text-amber-600" },
  block:    { label: "Blocked",    icon: Ban,        textColor: "text-red-600",   bgColor: "bg-red-50",    borderColor: "border-red-200",   badgeBg: "bg-red-100 text-red-500"     },
};

function ActionDropdown({ action, items }: { action: PrivacyAction; items: ManagedItem[] }) {
  const [open, setOpen] = useState(false);
  const { label, icon: Icon, textColor, bgColor, borderColor, badgeBg } = ACTION_META[action];
  const count = items.length;
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${borderColor} ${open ? bgColor : "bg-white"}`}>
      <button onClick={() => setOpen((v) => !v)} className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${open ? bgColor : "hover:bg-stone-50"}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${open ? "bg-white/70" : "bg-stone-100"}`}>
            <Icon size={13} className={open ? textColor : "text-stone-400"} />
          </div>
          <span className={`text-[13px] font-semibold ${open ? textColor : "text-stone-500"}`}>{label}</span>
          {count > 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>{count}</span>}
        </div>
        {open ? <ChevronUp size={14} className={textColor} /> : <ChevronDown size={14} className="text-stone-300" />}
      </button>
      {open && (
        <div className="flex flex-col gap-1 px-3 pb-3 pt-1">
          {count === 0 ? (
            <p className="text-[12px] text-stone-400 text-center py-3">Nothing {label.toLowerCase()} yet.</p>
          ) : items.map((item) => (
            <div key={item.key} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-stone-100 overflow-hidden flex items-center justify-center shrink-0">
                {item.avatarUrl
                  ? <img src={item.avatarUrl} alt={item.title} className="w-full h-full object-cover" />
                  : <span className="text-[11px] font-bold text-stone-400">{item.title.charAt(0).toUpperCase()}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-stone-700 truncate leading-tight">{item.title}</p>
                {item.subtitle && <p className="text-[10px] text-stone-400 truncate">{item.subtitle}</p>}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wide text-stone-300 shrink-0">{item.type === "channel" ? "Channel" : "Group"}</span>
              <button onClick={item.onRemove} title="Remove — will reappear in your feeds" className="w-6 h-6 flex items-center justify-center rounded-full text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Visibility Control ───────────────────────────────────────────────────────

const VIS_CONFIG: Record<
  VisibilityLevel,
  { icon: React.ElementType; label: string; desc: string; iconBg: string; iconText: string; border: string; badge: string }
> = {
  public: {
    icon: Globe,
    label: "Public",
    desc: "Visible to anyone on Cobucket",
    iconBg:   "bg-emerald-50",
    iconText: "text-emerald-600",
    border:   "border-emerald-100",
    badge:    "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  followers: {
    icon: Users,
    label: "Followers",
    desc: "Only your followers can view this",
    iconBg:   "bg-blue-50",
    iconText: "text-blue-600",
    border:   "border-blue-100",
    badge:    "bg-blue-50 text-blue-700 border-blue-100",
  },
  private: {
    icon: Lock,
    label: "Private",
    desc: "Only you can see this",
    iconBg:   "bg-stone-100",
    iconText: "text-stone-500",
    border:   "border-stone-200",
    badge:    "bg-stone-100 text-stone-600 border-stone-200",
  },
};

const VIS_TABS: { id: VisibilityLevel; label: string; icon: React.ElementType }[] = [
  { id: "public",    label: "Public",    icon: Globe  },
  { id: "followers", label: "Followers", icon: Users  },
  { id: "private",   label: "Private",   icon: Lock   },
];

function VisibilityControl({
  rowIcon: RowIcon,
  label,
  value,
  onChange,
}: {
  rowIcon: React.ElementType;
  label: string;
  value: VisibilityLevel;
  onChange: (v: VisibilityLevel) => void;
}) {
  const cfg = VIS_CONFIG[value];
  const CurrentIcon = cfg.icon;

  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

      {/* ── Summary row ── */}
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        {/* Row identity icon */}
        <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 shrink-0">
          <RowIcon size={14} className="text-stone-400" />
        </div>

        {/* Label + live description */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-stone-700 leading-none">{label}</p>
          <p className="text-[11px] text-stone-400 mt-1 leading-none">{cfg.desc}</p>
        </div>

        {/* Live badge showing current value */}
        <span className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all duration-200 ${cfg.badge}`}>
          <CurrentIcon size={11} />
          {cfg.label}
        </span>
      </div>

      {/* ── Segmented control ── */}
      <div className="px-3 pb-3">
        <div className="flex items-center bg-stone-100 rounded-[14px] p-[3px] gap-[3px]">
          {VIS_TABS.map(({ id, label: tabLabel, icon: TabIcon }) => {
            const isActive = value === id;
            const tabCfg = VIS_CONFIG[id];
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-[11px] text-[11px] font-medium transition-all duration-150 active:scale-[0.97] ${
                  isActive
                    ? `bg-white shadow-sm ${tabCfg.iconText}`
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <TabIcon size={11} strokeWidth={isActive ? 2.2 : 1.8} />
                {tabLabel}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── Section Block ────────────────────────────────────────────────────────────

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

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({ icon: Icon, label, desc, value, onChange }: {
  icon: React.ElementType; label: string; desc: string; value: boolean; onChange: () => void;
}) {
  return (
    <div className={`flex items-center justify-between px-3.5 py-3 bg-white border rounded-xl transition-colors ${value ? "border-stone-200" : "border-stone-100"}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg transition-colors ${value ? "bg-stone-800" : "bg-stone-100"}`}>
          <Icon size={13} className={value ? "text-white" : "text-stone-400"} />
        </div>
        <div>
          <p className="text-[13px] text-stone-600 font-medium">{label}</p>
          <p className="text-[11px] text-stone-400">{desc}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${value ? "bg-stone-800" : "bg-stone-200"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Privacy() {
  const [exportRequested, setExportRequested] = useState(false);

  const {
    profileVisibility, setProfileVisibility,
    postVisibility,    setPostVisibility,
    allowMessages,     toggleAllowMessages,
    allowTagging,      toggleAllowTagging,
    hiddenChannels,    removeChannel,
    hiddenGroups,      removeGroup,
  } = usePrivacyStore();

  const handleExport = () => {
    setExportRequested(true);
    setTimeout(() => setExportRequested(false), 3000);
  };

  const buildItems = (action: PrivacyAction): ManagedItem[] => {
    const channelItems: ManagedItem[] = hiddenChannels
      .filter((c) => c.action === action)
      .map((c) => ({ key: `ch-${c.id}`, title: c.title, subtitle: c.handle, avatarUrl: c.avatarUrl, type: "channel", action, onRemove: () => removeChannel(c.id) }));
    const groupItems: ManagedItem[] = hiddenGroups
      .filter((g) => g.action === action)
      .map((g) => ({ key: `grp-${g.id}`, title: g.title, avatarUrl: g.avatarUrl, type: "group", action, onRemove: () => removeGroup(g.id) }));
    return [...channelItems, ...groupItems];
  };

  const hiddenItems     = buildItems('hide');
  const restrictedItems = buildItems('restrict');
  const blockedItems    = buildItems('block');
  const totalManaged    = hiddenItems.length + restrictedItems.length + blockedItems.length;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-stone-700">Privacy</h2>
        <p className="text-[12px] text-stone-400 mt-0.5">Control who can see you and what you've hidden</p>
      </div>

      {/* ── Visibility ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-0.5">
          <div className="p-1 rounded-md bg-stone-100">
            <Globe size={11} className="text-stone-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Visibility</span>
        </div>
        <VisibilityControl
          rowIcon={UserRound}
          label="Profile"
          value={profileVisibility}
          onChange={setProfileVisibility}
        />
        <VisibilityControl
          rowIcon={ScrollText}
          label="Wall Posts"
          value={postVisibility}
          onChange={setPostVisibility}
        />
      </div>

      {/* ── Interactions ─────────────────────────────────────────────── */}
      <SectionBlock icon={MessageSquare} label="Interactions">
        <ToggleRow icon={MessageSquare} label="Allow Direct Messages" desc="Let others send you messages" value={allowMessages} onChange={toggleAllowMessages} />
        <ToggleRow icon={Users}         label="Allow Tagging"          desc="Let others tag you in posts"  value={allowTagging}  onChange={toggleAllowTagging}  />
      </SectionBlock>

      {/* ── Managed Content (UNCHANGED) ──────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Managed Content</p>
          {totalManaged > 0 && (
            <span className="text-[10px] font-bold bg-stone-800 text-white rounded-full px-2 py-0.5">{totalManaged}</span>
          )}
          <div className="flex-1 h-px bg-stone-100" />
        </div>
        <p className="text-[11px] text-stone-400 -mt-1">
          Channels and groups you've acted on are removed from your feeds. Click each label to see the list, tap × to restore.
        </p>
        <ActionDropdown action="hide"     items={hiddenItems}     />
        <ActionDropdown action="restrict" items={restrictedItems} />
        <ActionDropdown action="block"    items={blockedItems}    />
      </div>

      {/* ── Data & Export ────────────────────────────────────────────── */}
      <div className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-colors ${exportRequested ? "bg-green-50/50 border-green-100" : "bg-stone-50/60 border-stone-100"}`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${exportRequested ? "bg-green-100" : "bg-stone-100"}`}>
            {exportRequested
              ? <ShieldCheck size={13} className="text-green-600" />
              : <Download   size={13} className="text-stone-400" />
            }
          </div>
          <div>
            <p className="text-[13px] text-stone-600 font-medium">Export Your Data</p>
            <p className="text-[11px] text-stone-400">
              {exportRequested ? "Request received — email within 24 hours." : "Download a copy of all your account data"}
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={exportRequested}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-200 text-[11px] text-stone-500 rounded-xl hover:border-stone-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {exportRequested ? <><Check size={12} /> Requested</> : "Request Export"}
        </button>
      </div>

    </div>
  );
}
