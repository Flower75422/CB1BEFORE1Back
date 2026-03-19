import { useState, useEffect, useRef } from "react";

export default function useGridScroll(totalUnits: number) {
  const [unitIndex, setUnitIndex] = useState(0);
  const isProcessing = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isProcessing.current) return;

      isProcessing.current = true;
      
      // Separate Clockwise and Anti-Clockwise
      if (e.deltaY > 0) {
        setUnitIndex((prev) => (prev + 1) % totalUnits); // Down
      } else {
        setUnitIndex((prev) => (prev - 1 + totalUnits) % totalUnits); // Up
      }

      // Lock for duration of animation
      setTimeout(() => { isProcessing.current = false; }, 500);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [totalUnits]);

  return { unitIndex, scrollRef };
}