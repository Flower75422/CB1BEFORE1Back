"use client";

import ChannelTop from "./ChannelTop";
import ChannelBody from "./ChannelBody";
import ChannelBottom from "./ChannelBottom";

export interface Channel {
  id: number;
  title: string;
  subs: string;
  owner: string;
  desc: string;
  trending?: boolean;
  isPrivate?: boolean;
  topics?: string[];
  avatarUrl?: string;
  isJoined?: boolean; // 🔴 NEW: Add to interface
}

interface ChannelCardProps {
  channel: Channel;
  onOpenChat?: (channel: Channel) => void;
}

export default function ChannelCard({ channel, onOpenChat }: ChannelCardProps) {
  
  const handleOpenChat = () => {
    if (!channel.isPrivate) {
      if (onOpenChat) onOpenChat(channel);
    } else {
      alert("This is a private channel. You must request access to join.");
    }
  };

  return (
    <div className="h-[220px] bg-white p-5 rounded-[28px] border border-stone-100 hover:shadow-xl hover:shadow-stone-200/40 transition-all flex flex-col justify-between group">
      <div onClick={handleOpenChat} className={!channel.isPrivate ? "cursor-pointer" : "cursor-not-allowed opacity-90"}>
        <ChannelTop 
          title={channel.title} 
          subs={channel.subs} 
          avatarUrl={channel.avatarUrl} 
          isPrivate={channel.isPrivate} 
          isJoined={channel.isJoined} // 🔴 Pass it down
        />
      </div>
      <ChannelBody desc={channel.desc} trending={channel.trending} />
      <ChannelBottom owner={channel.owner} isPrivate={channel.isPrivate} />
    </div>
  );
}