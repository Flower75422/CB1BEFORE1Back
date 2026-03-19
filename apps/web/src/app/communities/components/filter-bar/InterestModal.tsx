"use client";
import { X, Sparkles, Check } from "lucide-react";

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInterests: string[];
  toggleInterest: (interest: string) => void;
}

// "Following" replaces "All" as the primary filter state
const ALL_INTERESTS = [
  "Following", "Technology", "Design", "Business", "Education", "Health", 
  "Marketing", "AI", "Startups", "Finance", "Art", "Music"
];

export default function InterestModal({ isOpen, onClose, selectedInterests, toggleInterest }: InterestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-[16px] font-black text-[#1c1917] tracking-tight">Interest Pool</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={18} className="text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[12px] text-stone-500 mb-6">
            Select the topics you want to see in your primary feed. Your experience will be customized based on these choices.
          </p>
          
          <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto no-scrollbar">
            {ALL_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 border ${
                    isSelected 
                      ? "bg-[#1c1917] text-white border-[#1c1917]" 
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {interest}
                  {isSelected && <Check size={12} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-[#1c1917] text-white px-6 py-2 rounded-xl text-[12px] font-bold hover:bg-black transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}