"use client";

import TopOfSingleBackCard from "./TopOfSingleBackCard";
import BodyOfBackCard from "./BodyOfBackCard";
import BottomOfBackCard from "./BottomOfBackCard";

export default function BackOfCard(props: any) {
  return (
    // p-5 must match FrontOfCard exactly
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-5 font-sans flex flex-col justify-between">
      
      {/* 1. The Single Row Header */}
      <TopOfSingleBackCard {...props} />
      
      {/* 2. The High-Occupancy Body */}
      <BodyOfBackCard {...props} />

      {/* 3. The Bottom Row (Matches Front Size) */}
      <div className="flex flex-col gap-2">
        <BottomOfBackCard {...props} />
      </div>

    </div>
  );
}