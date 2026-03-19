"use client";

import GroupTop from "./GroupTop";
import GroupBody from "./GroupBody";
import GroupBottom from "./GroupBottom";

export interface Group {
  id: number;
  title: string;
  members: string;
  owner: string;
  desc: string;
  isPrivate?: boolean;
  activity: string;
  avatarUrl?: string;
  topics?: string[];
  isJoined?: boolean; // 🔴 NEW: Add to interface
}

interface GroupCardProps {
  group: Group;
  onOpenChat?: (group: Group) => void;
}

export default function GroupCard({ group, onOpenChat }: GroupCardProps) {
  const handleOpenChat = () => {
    if (!group.isPrivate) {
      if (onOpenChat) onOpenChat(group);
    } else {
      alert("This is a private group. You must request access to join.");
    }
  };

  return (
    <div className="h-[220px] bg-white p-5 rounded-[28px] border border-stone-100 hover:shadow-xl hover:shadow-stone-200/40 transition-all flex flex-col justify-between group">
      <div onClick={handleOpenChat} className={!group.isPrivate ? "cursor-pointer" : "cursor-not-allowed opacity-90"}>
        <GroupTop 
          title={group.title} 
          members={group.members} 
          isPrivate={group.isPrivate} 
          avatarUrl={group.avatarUrl}
          isJoined={group.isJoined} // 🔴 Pass it to Top
        />
      </div>
      <GroupBody desc={group.desc} isPrivate={group.isPrivate} activity={group.activity} />
      <GroupBottom owner={group.owner} isPrivate={group.isPrivate} />
    </div>
  );
}