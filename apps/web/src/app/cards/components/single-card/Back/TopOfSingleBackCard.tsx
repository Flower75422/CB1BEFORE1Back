// apps/web/src/app/cards/components/single-card/back/TopOfSingleBackCard.tsx

interface TopOfSingleBackCardProps {
  name: string;
  handle: string;
}

export default function TopOfSingleBackCard({ name, handle }: TopOfSingleBackCardProps) {
  return (
    // 'h-5' locks the height to a single line of text
    <div className="flex items-center justify-between w-full h-4 mb-0.5 px-1">
      <h3 className="font-bold text-gray-900 text-[13px] truncate">
        {name}
      </h3>
      <p className="text-[10px] text-gray-400 font-medium truncate ml-2">
        {handle}
      </p>
    </div>
  );
}