"use client";
import { Send, Paperclip, Smile, X, Mic, Reply } from "lucide-react";
import { useState, useRef } from "react";
import { useChatsStore } from "@/store/chats/chats.store";

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡",
  "👍","👎","🙌","🔥","❤️","💯","🎉","✅",
  "😅","🤣","😊","🥳","😴","🤯","👏","🚀",
];

export default function ChatInput() {
  const [message, setMessage]       = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const { sendMessage, replyingTo, setReplyingTo } = useChatsStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage("");
    setShowEmojis(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === "Escape") setReplyingTo(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage((prev) => `${prev}📎 ${file.name}`.trim());
    if (fileRef.current) fileRef.current.value = "";
  };

  const insertEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="w-full px-4 py-4 bg-transparent flex flex-col shrink-0 z-20 gap-2">

      {/* Emoji picker */}
      {showEmojis && (
        <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-lg animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Quick Emojis</span>
            <button onClick={() => setShowEmojis(false)} className="text-stone-400 hover:text-stone-600">
              <X size={13} />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="h-8 w-8 flex items-center justify-center text-[18px] hover:bg-stone-100 rounded-lg transition-colors active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Reply bar — shown when replyingTo is set ── */}
      {replyingTo && (
        <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-sm animate-in slide-in-from-bottom-2 duration-150">
          <Reply size={15} className="text-stone-400 shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-wide">
              Replying to {replyingTo.senderName}
            </span>
            <span className="text-[12px] text-stone-400 truncate">{replyingTo.text}</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-stone-300 hover:text-stone-500 transition-colors active:scale-90 shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end bg-stone-100/80 rounded-3xl px-4 py-2.5 border border-stone-200/50 focus-within:border-stone-300 focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
        {/* Attachment */}
        <button
          onClick={() => fileRef.current?.click()}
          title="Attach file"
          className="text-stone-400 hover:text-[#1c1917] mb-0.5 transition-colors active:scale-95"
        >
          <Paperclip size={18} strokeWidth={2.5} />
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileSelect} />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={replyingTo ? `Reply to ${replyingTo.senderName}...` : "Type a message..."}
          rows={1}
          className="flex-1 bg-transparent text-[13px] font-bold outline-none px-4 py-1 text-[#1c1917] placeholder:text-stone-400 resize-none overflow-hidden"
        />

        <div className="flex items-center gap-2 mb-0.5">
          <button
            onClick={() => setShowEmojis((v) => !v)}
            title="Emoji"
            className={`transition-colors active:scale-95 ${showEmojis ? "text-amber-500" : "text-stone-400 hover:text-[#1c1917]"}`}
          >
            <Smile size={18} strokeWidth={2.5} />
          </button>

          {message.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 bg-[#1c1917] text-white rounded-full hover:bg-black transition-all active:scale-95 shadow-md"
            >
              <Send size={14} strokeWidth={2.5} className="ml-0.5" />
            </button>
          ) : (
            <button
              title="Voice message (coming soon)"
              className="p-2 text-stone-400 hover:text-[#1c1917] hover:bg-stone-100 rounded-full transition-all active:scale-95"
            >
              <Mic size={16} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
