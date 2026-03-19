"use client";

export default function Stats({ followers, following, views }: any) {
  return (
    <div className="flex gap-5 mb-4 text-[12px]">
      <div className="flex gap-1">
        <span className="font-bold text-[#1c1917]">{followers}</span> 
        <span className="text-[#78716c]">Followers</span>
      </div>
      <div className="flex gap-1">
        <span className="font-bold text-[#1c1917]">{following}</span> 
        <span className="text-[#78716c]">Following</span>
      </div>
      <div className="flex gap-1">
        <span className="font-bold text-[#1c1917]">{views}</span> 
        <span className="text-[#78716c]">Views</span>
      </div>
    </div>
  );
}