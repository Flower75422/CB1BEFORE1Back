"use client";

import { UserCircle } from "lucide-react";

export default function BodyOfSingleCard({ description, handle }: any) {
  const safeDescription = description || "";
  const truncatedBio = safeDescription.length > 160
    ? safeDescription.slice(0, 160) + "..."
    : safeDescription;

  const ownerHandle = handle ? handle.replace(/^@/, "") : null;

  return (
    <div className="flex flex-col flex-grow gap-1 mt-0.5 relative">

      {/* Owner handle */}
      {ownerHandle && (
        <div className="flex items-center gap-1 text-[#a8a29e] text-[10px] font-medium">
          <UserCircle size={10} className="text-[#1c1917] shrink-0" />
          <span className="truncate">{ownerHandle}</span>
        </div>
      )}

      {/* Bio — fills all remaining body space, clips overflow */}
      <div className="flex-1 overflow-hidden">
        <p className="text-gray-700 text-xs leading-[16px] font-normal break-all">
          {truncatedBio || <span className="text-stone-400 italic">No bio provided.</span>}
        </p>
      </div>

    </div>
  );
}
