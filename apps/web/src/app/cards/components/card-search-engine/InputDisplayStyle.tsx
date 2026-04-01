import { Search } from "lucide-react";

interface InputProps {
  query: string;
  onQueryChange: (val: string) => void;
  onFocus: () => void;
  onEnter?: () => void;
}

export default function InputDisplayStyle({ query, onQueryChange, onFocus, onEnter }: InputProps) {
  return (
    <div className="relative group w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-700 transition-colors"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by interest, name or ID..."
        value={query}
        onFocus={onFocus}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        className="w-full pl-11 pr-4 py-2.5 bg-white border border-transparent hover:border-[#E7E5E4] focus:border-[#E7E5E4] rounded-2xl text-sm outline-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all placeholder:text-gray-400"
      />
    </div>
  );
}