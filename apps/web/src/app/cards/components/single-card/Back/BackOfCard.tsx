"use client";

import TopOfSingleBackCard from "./TopOfSingleBackCard";
import BodyOfBackCard from "./BodyOfBackCard";
import BottomOfBackCard from "./BottomOfBackCard";

export default function BackOfCard(props: any) {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-200 px-4 pt-3 pb-2 font-sans flex flex-col">
      {/* Top — identity, fixed height */}
      <TopOfSingleBackCard {...props} />

      {/* Body — media + wall posts — hard pixel height to bypass flex-chain ambiguity */}
      <div className="overflow-hidden mt-1.5 mb-1 flex flex-col" style={{ height: 121 }}>
        <BodyOfBackCard {...props} />
      </div>

      {/* Bottom — flip / view profile — always pinned at bottom */}
      <BottomOfBackCard {...props} />
    </div>
  );
}