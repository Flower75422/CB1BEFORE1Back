"use client";

import TopOfFrontCard from "./TopOfFrontCard";
import BodyOfSingleCard from "./BodyOfSingleCard";
import BottomOfCard from "./BottomOfCard";

export default function FrontOfCard(props: any) {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-200 px-4 pt-3 pb-2 font-sans flex flex-col gap-1.5 relative overflow-hidden">
      <TopOfFrontCard {...props} />
      <BodyOfSingleCard {...props} />
      <BottomOfCard
        id={props.id}
        permissions={props.permissions}
        onFlip={props.onFlip}
        onOpenChannel={props.onOpenChannel}
        onFlipHoverStart={props.onFlipHoverStart}
        onFlipHoverEnd={props.onFlipHoverEnd}
        wallPosts={props.wallPosts}
        onOpenChat={() => {
          if (props.onOpenChat) props.onOpenChat(props);
        }}
      />
    </div>
  );
}
