"use client";

import { ReactNode } from "react";

export default function CardsGrid({ children }: { children: ReactNode }) {
  return (
    // grid-cols-1  -> Mobile (Matches w-full in TopicRow)
    // md:grid-cols-2 -> Tablet (Matches w-1/2 in TopicRow)
    // lg:grid-cols-3 -> Desktop (Matches w-1/3 in TopicRow)
    // gap-4        -> Matches gap-4 in TopicRow
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full pb-10">
      {children}
    </div>
  );
}