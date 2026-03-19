"use client";

interface StatItemProps {
  value: string | number;
  label: string;
}

export default function UniversalStatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col">
      <span className="font-bold text-[#1c1917] text-base leading-none">{value}</span> 
      <span className="text-stone-400 font-bold text-[10px] uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  );
}