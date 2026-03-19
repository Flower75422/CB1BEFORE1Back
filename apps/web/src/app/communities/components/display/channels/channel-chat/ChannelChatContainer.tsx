"use client";

// 🔴 FIX: Imported useEffect
import { useState, useEffect } from "react"; 
import ChannelChatTop from "./ChannelChatTop";
import ChannelChatBody from "./ChannelChatBody";
import ChannelChatBottom from "./ChannelChatBottom";
import ChannelMoreFeature from "./ChannelMoreFeature";

export default function ChannelChatContainer({ channel, onClose }: any) {
  const [showInfo, setShowInfo] = useState(false);

  // 🔴 THE FIX: Lock the background scroll when the chat is open!
  useEffect(() => {
    // We target the 'main' tag since your RootLayout controls the scroll there
    const rootMain = document.querySelector("main");
    
    if (rootMain) {
      const originalOverflow = rootMain.style.overflow;
      rootMain.style.overflow = "hidden"; // Freeze!
      
      return () => {
        rootMain.style.overflow = originalOverflow; // Unfreeze when closed
      };
    } else {
      // Fallback just in case
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
      
      {/* LEFT/MAIN: Chat Area */}
      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? 'w-2/3 border-r border-stone-200' : 'w-full'}`}>
        <ChannelChatTop 
          channel={channel} 
          onClose={onClose} 
          onToggleInfo={() => setShowInfo(!showInfo)} 
          isInfoOpen={showInfo}
        />
        <ChannelChatBody />
        <ChannelChatBottom />
      </div>

      {/* RIGHT: More Features / Info Panel */}
      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative">
          <ChannelMoreFeature channel={channel} onCloseInfo={() => setShowInfo(false)} />
        </div>
      )}

    </div>
  );
}