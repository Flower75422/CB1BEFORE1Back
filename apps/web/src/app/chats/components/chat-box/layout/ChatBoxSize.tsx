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
      <div className="w-64 shrink-0 bg-[#FDFBF7] flex flex-col h-full overflow-hidden border-r border-stone-200/60 z-10">
        {sidebar}
      </div>
      <div className={`flex flex-col h-full min-w-0 relative bg-white transition-all duration-300 ${showInfo ? 'flex-1 border-r border-stone-200/60' : 'flex-1'}`}>
        {content}
      </div>
      {showInfo && (
        <div className="w-[320px] shrink-0 h-full bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative z-20">
          {infoPanel}
        </div>
      )}
    </div>
  );
}