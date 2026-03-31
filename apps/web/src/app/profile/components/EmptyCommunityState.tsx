"use client";
import { Plus, LayoutGrid, MessageSquare } from "lucide-react";

interface EmptyStateProps {
  type: "channel" | "group";
  onCreate: () => void;
}

export default function EmptyCommunityState({ type, onCreate }: EmptyStateProps) {
  return (
    <div className="w-full py-20 px-6 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-[40px] bg-stone-50/50 group transition-all hover:border-stone-300">
      {/* Icon Stack */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-100 relative z-10">
          {type === "channel" ? (
            <LayoutGrid className="text-stone-400" size={28} />
          ) : (
            <MessageSquare className="text-stone-400" size={28} />
          )}
        </div>
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-stone-800 rounded-full flex items-center justify-center border-4 border-stone-50 z-20">
          <Plus className="text-white" size={12} strokeWidth={3} />
        </div>
      </div>

      <h3 className="text-[14px] font-medium text-stone-700 mb-1">
        No {type === "channel" ? "Channels" : "Groups"} Yet
      </h3>
      <p className="text-[12px] text-stone-400 mb-7 max-w-[220px] text-center leading-relaxed">
        {type === "channel"
          ? "Start a channel to share your visual stories and updates."
          : "Create a group to build a real-time community around your interests."}
      </p>

      <button
        onClick={onCreate}
        className="flex items-center gap-1.5 px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-[12px] font-medium active:scale-95 transition-all"
      >
        <Plus size={16} />
        Build Your First {type === "channel" ? "Channel" : "Group"}
      </button>
    </div>
  );
}