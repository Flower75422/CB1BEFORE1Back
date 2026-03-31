"use client";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  width?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ placeholder = "Search...", width = "w-64", value = "", onChange }: SearchBarProps) {
  return (
    <div className={`relative ${width} hidden md:block`}>
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-stone-200/40 border border-transparent rounded-xl text-[13px] font-bold text-[#1c1917] placeholder:text-stone-400 focus:bg-white focus:border-stone-200 focus:outline-none transition-all shadow-sm"
      />
    </div>
  );
}
