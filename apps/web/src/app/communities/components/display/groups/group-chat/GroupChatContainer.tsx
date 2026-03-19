"use client";

// 🔴 FIX: Added useEffect to the import
import { useState, useEffect } from "react";
import GroupChatTop from "./GroupChatTop";
import GroupChatBody from "./GroupChatBody";
import GroupChatBottom from "./GroupChatBottom";
import GroupMoreFeature from "./GroupMoreFeature";

export default function GroupChatContainer({ group, onClose }: any) {
  const [showInfo, setShowInfo] = useState(false);

  // 🔴 THE SCROLL ASSASSIN: Locks the background <main> tag when the chat is open
  useEffect(() => {
    const rootMain = document.querySelector("main");
    
    if (rootMain) {
      const originalOverflow = rootMain.style.overflow;
      rootMain.style.overflow = "hidden"; // Freeze!
      
      return () => {
        rootMain.style.overflow = originalOverflow; // Unfreeze when closed
      };
    } else {
      // Fallback in case <main> isn't found
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 duration-300">
      
      {/* LEFT/MAIN: Chat Area */}
      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? 'w-2/3 border-r border-stone-200' : 'w-full'}`}>
        <GroupChatTop 
          group={group} 
          onClose={onClose} 
          onToggleInfo={() => setShowInfo(!showInfo)} 
          isInfoOpen={showInfo}
        />
        {/* Chat Body automatically handles its own internal scroll */}
        <GroupChatBody />
        <GroupChatBottom />
      </div>

      {/* RIGHT: More Features / Info Panel */}
      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative">
          {/* Settings Panel automatically handles its own internal scroll */}
          <GroupMoreFeature group={group} onCloseInfo={() => setShowInfo(false)} />
        </div>
      )}

    </div>
  );
}