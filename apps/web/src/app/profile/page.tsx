"use client";
import { useState, useRef } from "react";
import ProfileHeader from "./components/ProfileHeader";
import ProfileBody from "./components/ProfileBody";
import ChannelChatContainer from "@/app/communities/components/display/channels/channel-chat/ChannelChatContainer";
import GroupChatContainer from "@/app/communities/components/display/groups/group-chat/GroupChatContainer";
import { Channel } from "@/app/communities/components/display/channels/card";
import { Group } from "@/app/communities/components/display/groups/card";

export default function ProfilePage() {
  const [activeChannelChat, setActiveChannelChat] = useState<Channel | null>(null);
  const [activeGroupChat, setActiveGroupChat]     = useState<Group   | null>(null);
  const savedScrollRef = useRef<number>(0);

  const isChatActive = !!(activeChannelChat || activeGroupChat);

  const openChannelChat = (ch: Channel) => {
    const el = document.querySelector("main");
    savedScrollRef.current = el?.scrollTop ?? 0;
    setActiveChannelChat(ch);
    if (el) el.scrollTop = 0;
  };

  const openGroupChat = (g: Group) => {
    const el = document.querySelector("main");
    savedScrollRef.current = el?.scrollTop ?? 0;
    setActiveGroupChat(g);
    if (el) el.scrollTop = 0;
  };

  const closeChannelChat = () => {
    setActiveChannelChat(null);
    requestAnimationFrame(() => {
      const el = document.querySelector("main");
      if (el) el.scrollTop = savedScrollRef.current;
    });
  };

  const closeGroupChat = () => {
    setActiveGroupChat(null);
    requestAnimationFrame(() => {
      const el = document.querySelector("main");
      if (el) el.scrollTop = savedScrollRef.current;
    });
  };

  return (
    <main className="min-h-screen w-full bg-[#FDFBF7] flex flex-col items-center overflow-x-hidden transition-colors duration-200">
      <div className="w-full max-w-[1400px] px-6 pt-2">

        {/* ── CHAT VIEW: always mounted, visible only when a chat is active ── */}
        {isChatActive && (
          <div className="fixed top-8 right-8 bottom-8 left-[288px] z-[60] flex items-center justify-center">
            {activeChannelChat && (
              <ChannelChatContainer channel={activeChannelChat} onClose={closeChannelChat} />
            )}
            {activeGroupChat && (
              <GroupChatContainer group={activeGroupChat} onClose={closeGroupChat} />
            )}
          </div>
        )}

        {/* ── NORMAL VIEW: always mounted, hidden while chat is open ── */}
        {/* Keeping it mounted preserves the active tab state on return */}
        <div className={isChatActive ? "hidden" : ""}>
          <ProfileHeader />
          <ProfileBody
            onOpenChannelChat={openChannelChat}
            onOpenGroupChat={openGroupChat}
          />
        </div>

      </div>
    </main>
  );
}
