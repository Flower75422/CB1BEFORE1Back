import { ChevronRight, Hash, Sparkles, Users2 } from "lucide-react";

type FilterType = "people" | "channels" | "groups" | "interests";

interface OutputProps {
  results: any[];
  query: string;
  activeFilter: FilterType;
  onResultClick: (item: any) => void;
}

export default function OutputDisplayStyle({ results, query, activeFilter, onResultClick }: OutputProps) {
  
  // 1. Empty State (No Search)
  if (!query.trim()) {
    return (
      <div className="py-8 text-center text-[11px] text-[#a8a29e] font-bold uppercase tracking-widest">
        Type something to search for {activeFilter}...
      </div>
    );
  }

  // 2. No Results Found
  if (results.length === 0) {
    return (
      <div className="py-8 text-center text-[11px] text-[#a8a29e] font-bold uppercase tracking-widest">
        No {activeFilter} found for "{query}"
      </div>
    );
  }

  // 3. Render Results
  return (
    <div className="flex flex-col gap-1">
      {results.map((item) => (
        <div
          key={item.id}
          onClick={() => onResultClick(item)} // 🔴 Trigger the click
          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5F5F4] cursor-pointer transition-colors group"
        >
          {/* Left: Icon + Text */}
          <div className="flex items-center gap-3">
            
            {/* Dynamic Icon based on Filter */}
            {activeFilter === "people" && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5F5F4] to-[#E7E5E4] flex items-center justify-center text-sm font-bold text-[#57534e] overflow-hidden">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  item.name.charAt(0)
                )}
              </div>
            )}
            {activeFilter === "channels" && (
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] flex items-center justify-center text-[#78716c]">
                <Hash size={16} />
              </div>
            )}
            {activeFilter === "groups" && (
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] flex items-center justify-center text-[#78716c]">
                <Users2 size={16} />
              </div>
            )}
            {activeFilter === "interests" && (
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F4] flex items-center justify-center text-[#78716c]">
                <Sparkles size={16} />
              </div>
            )}

            {/* Details */}
            <div>
              <h4 className="font-bold text-[#1c1917] text-[13px]">{item.name}</h4>
              <p className="text-[11px] text-[#a8a29e] font-medium mt-0.5">
                {activeFilter === "people" && item.handle}
                {activeFilter === "channels" && `${item.members} members`}
                {activeFilter === "groups" && `${item.members} members · ${item.activity || "Active"}`}
                {activeFilter === "interests" && `${item.posts} posts`}
              </p>
            </div>
          </div>

          {/* Right: Action Arrow */}
          <ChevronRight size={16} className="text-[#d6d3d1] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
        </div>
      ))}
    </div>
  );
}