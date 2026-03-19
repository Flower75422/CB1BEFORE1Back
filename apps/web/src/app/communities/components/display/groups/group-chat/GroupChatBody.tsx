"use client";

const MOCK_MESSAGES = [
  { id: 1, sender: "Elena R.", text: "Hey everyone! Has anyone tried the new Figma variables update?", time: "10:42 AM", isMe: false },
  { id: 2, sender: "Marco P.", text: "Yes! It completely changes how we do dark mode.", time: "10:45 AM", isMe: false },
  { id: 3, sender: "Wasim Akram", text: "I'm implementing it into the codebase right now. Very smooth.", time: "10:48 AM", isMe: true },
];

export default function GroupChatBody() {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#FAFAFA] flex flex-col gap-4">
      
      {/* Date Divider */}
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-stone-200/50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
          Today
        </span>
      </div>

      {/* Messages */}
      {MOCK_MESSAGES.map((msg) => (
        <div key={msg.id} className={`flex flex-col max-w-[70%] ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
          
          {!msg.isMe && (
            <span className="text-[11px] font-bold text-stone-400 ml-1 mb-1">{msg.sender}</span>
          )}
          
          <div className={`px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
            msg.isMe 
              ? 'bg-[#1c1917] text-white rounded-br-sm' 
              : 'bg-white border border-stone-200/60 text-[#1c1917] rounded-bl-sm'
          }`}>
            {msg.text}
          </div>
          
          <span className="text-[9px] font-bold text-stone-300 mt-1 mx-1 uppercase tracking-wider">{msg.time}</span>
        </div>
      ))}
      
    </div>
  );
}