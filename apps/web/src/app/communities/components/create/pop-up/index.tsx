"use client";
import { useState } from "react";
import TypeSelector from "./TypeSelector";
import CreateChannelController from "../channels";
import CreateGroupController from "../groups";

export default function CreatePopUpController({ onClose }: { onClose: () => void }) {
  const [selection, setSelection] = useState<"channel" | "group" | null>(null);

  return (
    // Fixed inset-0 ensures it covers the whole screen
    // overflow-hidden on the parent prevents the background page from scrolling
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-md overflow-hidden">
      
      {!selection ? (
        <TypeSelector 
          onSelect={(type) => setSelection(type)} 
          onClose={onClose} 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
          {selection === "channel" ? (
            <CreateChannelController onClose={onClose} />
          ) : (
            <CreateGroupController onClose={onClose} />
          )}
        </div>
      )}
    </div>
  );
}