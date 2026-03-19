"use client";

import { useState, useEffect } from "react"; 
import ChatHeader from "./top-display/ChatHeader";
import ChatBody from "./body-display/ChatBody";
import ChatInput from "./input-display/ChatInput";
import ChatSettings from "./settings/ChatSettings";

// NOTE: Import your custom hook here!
import { useChatConnect } from "./chat-connect/useChatConnect";

export default function CardChatView({ user, onBack }: any) {
  const [showInfo, setShowInfo] = useState(false);

  // 🔴 Lock the background scroll when the chat is open
  useEffect(() => {
    const rootMain = document.querySelector("main");
    
    if (rootMain) {
      const originalOverflow = rootMain.style.overflow;
      rootMain.style.overflow = "hidden"; // Freeze
      return () => { rootMain.style.overflow = originalOverflow; };
    } else {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = originalStyle; };
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto h-[85vh] min-h-0 bg-[#FDFBF7] rounded-[32px] overflow-hidden flex shadow-sm border border-stone-200/60 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
      
      {/* LEFT/MAIN: Chat Area */}
      <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${showInfo ? 'w-2/3 border-r border-stone-200' : 'w-full'}`}>
        <ChatHeader 
          user={user} 
          onBack={onBack} 
          onToggleInfo={() => setShowInfo(!showInfo)} 
          isInfoOpen={showInfo}
        />
        <ChatBody />
        <ChatInput />
      </div>

      {/* RIGHT: Settings / Info Panel */}
      {showInfo && (
        <div className="w-1/3 h-full min-h-0 bg-white flex flex-col animate-in slide-in-from-right-8 duration-300 relative z-20">
          <ChatSettings user={user} onCloseInfo={() => setShowInfo(false)} />
        </div>
      )}

    </div>
  );
}