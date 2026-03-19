"use client";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  width?: string;
}

export default function SearchBar({ placeholder = "Search...", width = "w-64" }: SearchBarProps) {
  return (
    // 1. CONTAINER: Relative positioning for the icon
    <div className={`relative ${width} hidden md:block`}>
      
      {/* 2. ICON: Stone-400 for subtle contrast */}
      <Search 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" 
        size={16} 
      />
      
      {/* 3. INPUT: 
          - bg-stone-200/40: Blends with page background
          - focus:bg-white: Pops when typing
          - text-[13px] font-bold: Matches your design system typography
      */}
      <input 
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-stone-200/40 border border-transparent rounded-xl text-[13px] font-bold text-[#1c1917] placeholder:text-stone-400 focus:bg-white focus:border-stone-200 focus:outline-none transition-all shadow-sm"
      />
    </div>
  );
}