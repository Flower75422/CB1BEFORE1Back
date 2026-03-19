"use client";

interface TypeToggleProps {
  active: "Groups" | "Channels";
  onTypeChange: (type: "Groups" | "Channels") => void;
}

export default function TypeToggle({ active, onTypeChange }: TypeToggleProps) {
  const types = ["Groups", "Channels"] as const;

  return (
    <div className="flex items-center gap-6 h-full">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`relative h-full flex items-center text-[15px] font-bold tracking-tight transition-colors ${
            active === type 
              ? "text-[#1c1917]" 
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          {type}
          
          {/* THE FIX: Added the active indicator line to match Cards Page */}
          {active === type && (
            <span className="absolute bottom-1.5 left-0 w-full h-[2.5px] bg-[#1c1917] rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
}