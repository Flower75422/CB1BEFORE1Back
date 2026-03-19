"use client";
import { MapPin } from "lucide-react";

interface BioProps {
  location: string;
  text: string;
  status: string;
}

export default function Bio({ location, text, status }: BioProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Location */}
      <div className="flex items-center gap-1.5 text-stone-400">
        <MapPin size={14} />
        <span className="text-[12px] font-bold tracking-tight">{location}</span>
      </div>

      {/* Main Bio Text */}
      <p className="text-[14px] text-brand-black leading-relaxed font-medium max-w-2xl">
        {text}
      </p>

      {/* Stone Status Text */}
      <div className="pt-2 border-t border-stone-50">
        <p className="text-[12px] text-stone-500 leading-relaxed italic">
          <span className="font-bold not-italic text-stone-400 mr-1">Latest:</span>
          {status}
        </p>
      </div>
    </div>
  );
}