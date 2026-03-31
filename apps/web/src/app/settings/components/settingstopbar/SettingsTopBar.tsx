"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsTopBar() {
  return (
    <div className="flex items-center gap-3 mb-8 px-1">
      <Link
        href="/profile"
        className="p-1.5 rounded-xl bg-white hover:bg-stone-100 transition text-stone-500 border border-stone-200 shadow-sm active:scale-95"
      >
        <ArrowLeft size={15} strokeWidth={2} />
      </Link>
      <h1 className="text-[16px] font-semibold text-stone-700 leading-none">
        Settings
      </h1>
    </div>
  );
}
