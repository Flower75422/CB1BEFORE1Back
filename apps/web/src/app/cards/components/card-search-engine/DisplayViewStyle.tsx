"use client";

import InCardSearchEngine from "./InCardSearchEngine";

interface DisplayViewStyleProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenSettings: () => void;
  onOpenChannel?: (data: any) => void;
  onOpenChat?: (user: any) => void;
  onOpenProfile?: (user: any) => void; // 🔴 NEW
}

export default function DisplayViewStyle({
  activeFilter,
  onFilterChange,
  onOpenSettings,
  onOpenChannel,
  onOpenChat,
  onOpenProfile // 🔴 Destructured
}: DisplayViewStyleProps) {
  return (
    <div className="w-full flex items-center justify-between h-16 -mt-6 bg-transparent mb-2">
      <div className="flex items-center gap-6 h-full">
        <TabButton active={true} onClick={() => onFilterChange("For You")} label="Feed" />
      </div>

      <div className="flex items-center gap-3">
        <InCardSearchEngine />

        <button onClick={onOpenSettings} className="group relative outline-none">
          <div className="rounded-full p-[1.5px] bg-gradient-to-tr from-stone-200 via-stone-400 to-stone-200 shadow-sm active:scale-95 transition-transform">
            <div className="bg-[#FDFBF7] w-9 h-9 rounded-full group-hover:bg-stone-50 transition-colors flex items-center justify-center">
              <span className="text-[#1c1917] font-bold text-[15px] leading-none opacity-90 group-hover:opacity-100">C</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string; }) {
  return (
    <button onClick={onClick} className={`relative h-full flex items-center text-[14px] font-medium transition-colors ${active ? "text-stone-800" : "text-stone-400 hover:text-stone-600"}`}>
      {label}
      {active && <span className="absolute bottom-1.5 left-0 w-full h-[2px] bg-stone-800 rounded-full"></span>}
    </button>
  );
}