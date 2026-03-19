"use client";

// Replace with real data from useChatConnect later!
const MOCK_MESSAGES = [
  { id: 1, text: "Hey! I saw your Web3 UI/UX card. Love your work.", sender: "them", time: "10:00 AM" },
  { id: 2, text: "Thank you so much! Are you currently building something in the space?", sender: "me", time: "10:05 AM" },
  { id: 3, text: "Yeah, working on a decentralized exchange. We actually need some design help.", sender: "them", time: "10:06 AM" },
];

export default function ChatBody() {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#FAFAFA] flex flex-col gap-4">
      
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-stone-200/50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
          Today
        </span>
      </div>

      {MOCK_MESSAGES.map((msg) => {
        const isMe = msg.sender === "me";
        return (
          <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`px-4 py-3 text-[13px] font-medium leading-relaxed shadow-sm ${
              isMe 
                ? 'bg-[#1c1917] text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white border border-stone-200/60 text-[#1c1917] rounded-2xl rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
            <span className="text-[9px] font-bold text-stone-400 mt-1 mx-1 uppercase tracking-wider">
              {msg.time}
            </span>
          </div>
        );
      })}
      
    </div>
  );
}