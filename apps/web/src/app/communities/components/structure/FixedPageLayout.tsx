"use client";

import { ReactNode, useRef, useEffect } from "react";

interface FixedPageLayoutProps {
  header: ReactNode;
  filterBar: ReactNode;
  children: ReactNode;
  scrollKey?: string;
}

export default function FixedPageLayout({ header, filterBar, children, scrollKey }: FixedPageLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll Reset Logic (Jumps to top when changing tabs)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollKey]);

  return (
    // MASTER CONTAINER
    // h-screen: Locks to viewport height
    // overflow-hidden: Prevents body scroll
    <div className="flex flex-col h-screen w-full bg-[#FDFBF7] overflow-hidden">
      
      {/* 1. HEADER SECTION (Stacked Top) */}
      {/* z-50: Ensures it sits above everything */}
      <div className="flex-shrink-0 z-50 bg-white shadow-sm relative">
        {header}
      </div>

      {/* 2. FILTER SECTION (Stacked Below Header) */}
      {/* z-40: Sits below header, above content */}
      <div className="flex-shrink-0 z-40 bg-[#FDFBF7] relative">
        {filterBar}
      </div>

      {/* 3. CONTENT BODY (Fills Remaining Space) */}
      {/* overflow-y-auto: Only this part scrolls */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar relative z-0"
      >
        {/* Added padding-top (py-6) to ensure cards don't touch the bar immediately */}
        <div className="px-6 py-6 pb-20">
          {children}
        </div>
      </div>

      {/* CSS to hide scrollbars */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}