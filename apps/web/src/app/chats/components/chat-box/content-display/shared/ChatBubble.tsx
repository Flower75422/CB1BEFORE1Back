"use client";
import { useState } from "react";
import { Check, Reply, Smile, Copy, Trash2, X } from "lucide-react";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export interface BubbleMsg {
  id: string;
  text: string;
  time: string;
  isSender: boolean;
  replyTo?: { id: string; text: string; senderName: string };
  reactions?: Record<string, string[]>;
  status?: "sent" | "delivered" | "read";
}

interface ChatBubbleProps {
  msg: BubbleMsg;
  senderName?: string;        // shown above bubble in groups
  senderAvatarUrl?: string;   // avatar in groups
  showSenderInfo?: boolean;   // whether to render sender name + avatar
  onReply?: (msg: BubbleMsg) => void;
  onReact?: (msgId: string, emoji: string) => void;
  onCopy?: (text: string) => void;
  onDelete?: (msgId: string) => void;
}

function ReadTicks({ status }: { status?: string }) {
  const color =
    status === "read"
      ? "text-blue-400"
      : status === "delivered"
      ? "text-stone-400"
      : "text-stone-300";
  return (
    <span className={`flex items-center ${color}`} title={status || "sent"}>
      <Check size={11} strokeWidth={2.8} className="-mr-[5px]" />
      <Check size={11} strokeWidth={2.8} />
    </span>
  );
}

export default function ChatBubble({
  msg,
  senderName,
  senderAvatarUrl,
  showSenderInfo,
  onReply,
  onReact,
  onCopy,
  onDelete,
}: ChatBubbleProps) {
  const { id, text, time, isSender, replyTo, reactions, status } = msg;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const reactionEntries = reactions
    ? Object.entries(reactions).filter(([, users]) => users.length > 0)
    : [];

  return (
    <div className={`flex items-end gap-2 mb-2 group ${isSender ? "flex-row-reverse" : "flex-row"}`}>

      {/* Sender avatar — group non-me messages only */}
      {showSenderInfo && !isSender && (
        <div className="h-7 w-7 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-white text-[10px] font-bold self-end mb-5 shadow-sm">
          {senderAvatarUrl ? (
            <img src={senderAvatarUrl} alt={senderName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-stone-400 rounded-full">
              {(senderName || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      {/* Spacer so isSender messages align correctly */}
      {showSenderInfo && isSender && <div className="w-7 shrink-0" />}

      <div className={`flex flex-col max-w-[75%] ${isSender ? "items-end" : "items-start"}`}>

        {/* Sender name — group non-me messages */}
        {showSenderInfo && !isSender && senderName && (
          <span className="text-[10px] font-bold text-stone-500 mb-0.5 px-1">{senderName}</span>
        )}

        {/* Hover action bar */}
        <div className={`flex items-center gap-0.5 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
          {/* React button with inline picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              title="React"
              className="p-1 rounded-lg text-stone-400 hover:text-amber-500 hover:bg-amber-50 transition-colors active:scale-90"
            >
              <Smile size={13} strokeWidth={2} />
            </button>
            {showEmojiPicker && (
              <div className={`absolute bottom-9 z-50 flex items-center gap-0.5 bg-white border border-stone-200 rounded-2xl shadow-xl px-2 py-1.5 animate-in zoom-in-95 duration-100 ${isSender ? "right-0" : "left-0"}`}>
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { onReact?.(id, emoji); setShowEmojiPicker(false); }}
                    className="h-8 w-8 flex items-center justify-center text-[18px] hover:bg-stone-100 rounded-xl transition-colors active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="ml-0.5 text-stone-300 hover:text-stone-500 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onReply?.(msg)}
            title="Reply"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors active:scale-90"
          >
            <Reply size={13} strokeWidth={2} />
          </button>

          <button
            onClick={() => { onCopy?.(text); }}
            title="Copy"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors active:scale-90"
          >
            <Copy size={13} strokeWidth={2} />
          </button>

          {isSender && (
            <button
              onClick={() => onDelete?.(id)}
              title="Delete"
              className="p-1 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors active:scale-90"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Reply quote */}
        {replyTo && (
          <div className={`mb-1 px-3 py-1.5 rounded-xl text-[11px] border-l-[3px] max-w-full w-full ${
            isSender
              ? "bg-stone-700 border-stone-400 text-stone-300"
              : "bg-stone-100 border-stone-400 text-stone-500"
          }`}>
            <span className="font-bold block truncate text-[10px] uppercase tracking-wide opacity-70">{replyTo.senderName}</span>
            <span className="truncate block leading-snug">{replyTo.text}</span>
          </div>
        )}

        {/* Message bubble */}
        <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
          isSender
            ? "bg-stone-800 text-white rounded-tr-sm"
            : "bg-white text-stone-600 border border-stone-200/60 rounded-tl-sm"
        }`}>
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>

        {/* Reaction pills */}
        {reactionEntries.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1.5 px-0.5 ${isSender ? "justify-end" : "justify-start"}`}>
            {reactionEntries.map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReact?.(id, emoji)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-stone-200 shadow-sm text-[11px] hover:bg-stone-50 hover:border-stone-300 transition-colors active:scale-95"
              >
                <span>{emoji}</span>
                <span className="font-bold text-stone-600 text-[10px]">{users.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp + read receipt */}
        <div className={`flex items-center gap-1 mt-1 px-0.5 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-stone-400">{time}</span>
          {isSender && <ReadTicks status={status} />}
        </div>

      </div>
    </div>
  );
}
