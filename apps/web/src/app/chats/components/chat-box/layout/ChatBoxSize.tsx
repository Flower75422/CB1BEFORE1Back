"use client";
import { ReactNode } from "react";

interface ChatBoxSizeProps {
  sidebar: ReactNode;
  content: ReactNode;
  infoPanel?: ReactNode;
  showInfo?: boolean;
}

export default function ChatBoxSize({ sidebar, content, infoPanel, showInfo }: ChatBoxSizeProps) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#FDFBF7] border border-stone-200/60 rounded-[24px] shadow-sm">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-[#FDFBF7] flex flex-col h-full overflow-hidden border-r border-stone-200/60 z-10">
        {sidebar}
      </div>

      {/* Content + overlay info panel */}
      <div className="flex-1 min-w-0 relative flex flex-col h-full bg-white overflow-hidden">
        {content}

        {/* Info panel — absolute overlay from right, doesn't compress content */}
        {showInfo && infoPanel && (
          <div className="absolute right-0 top-0 h-full w-72 bg-white border-l border-stone-200/60 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right-8 duration-300 overflow-hidden rounded-r-[23px]">
            {infoPanel}
          </div>
        )}
      </div>
    </div>
  );
}