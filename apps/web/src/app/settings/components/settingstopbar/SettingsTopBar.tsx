"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsTopBar() {
  return (
    <div className="flex items-center gap-4 mb-10 px-2">
      <Link 
        href="/profile" 
        className="p-2 rounded-full bg-white hover:bg-stone-200 transition text-[#1c1917] border border-stone-200 shadow-sm active:scale-95"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
      </Link>
      <h1 className="text-[22px] font-black text-[#1c1917] tracking-tight leading-none">
        Settings
      </h1>
    </div>
  );
}