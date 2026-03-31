"use client";

interface TypeToggleProps {
  active: "Groups" | "Channels";
  onTypeChange: (type: "Groups" | "Channels") => void;
}

export default function TypeToggle({ active, onTypeChange }: TypeToggleProps) {
  const types = ["Channels", "Groups"] as const;

  return (
    <div className="flex items-center gap-6 h-full">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`relative h-full flex items-center text-[14px] font-medium transition-colors ${
            active === type
              ? "text-stone-800"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          {type}
          {active === type && (
            <span className="absolute bottom-1.5 left-0 w-full h-[2px] bg-stone-800 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
}