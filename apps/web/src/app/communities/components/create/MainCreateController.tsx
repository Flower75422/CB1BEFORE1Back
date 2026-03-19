"use client";
import { useState } from "react";
import TypeSelector from "./pop-up/TypeSelector";
import CreateChannelController from "./channels";
import CreateGroupController from "./groups";

export default function MainCreateController({ onClose }: { onClose: () => void }) {
  const [selection, setSelection] = useState<"channel" | "group" | null>(null);

  if (!selection) {
    return (
      <div className="absolute top-14 right-0 z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
        <TypeSelector onSelect={(type) => setSelection(type)} onClose={onClose} />
      </div>
    );
  }

  return (
    // Fixed layout that respects your sidebar width (280px)
    <div className="fixed top-0 right-0 bottom-0 left-[280px] z-[110] bg-[#FDFBF7]/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-300">
      <div className="w-full h-full flex items-center justify-center overflow-hidden py-10 px-6">
        <div className="w-full max-w-6xl h-full flex items-center justify-center">
           {selection === "channel" ? (
            <CreateChannelController onClose={onClose} />
          ) : (
            <CreateGroupController onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}