"use client";

const MOCK_BROADCASTS = [
  { id: 1, text: "Welcome to the official channel! We'll be posting updates here.", time: "Monday 9:00 AM" },
  { id: 2, text: "New video is live! Check out the latest breakdown on AI architectures.", time: "Yesterday 2:30 PM", link: true },
];

export default function ChannelBody() {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#FAFAFA] flex flex-col gap-4">
      
      <div className="flex justify-center my-4">
        <span className="px-3 py-1 bg-stone-200/50 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
          Channel Created
        </span>
      </div>

      {MOCK_BROADCASTS.map((msg) => (
        <div key={msg.id} className="flex flex-col max-w-[85%] self-start items-start">
          <div className="px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm bg-white border border-stone-200/60 text-[#1c1917] rounded-bl-sm">
            {msg.text}
            {msg.link && (
              <div className="mt-3 h-32 w-full bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center text-stone-400">
                [Video Preview]
              </div>
            )}
          </div>
          <span className="text-[9px] font-bold text-stone-300 mt-1 mx-1 uppercase tracking-wider">{msg.time}</span>
        </div>
      ))}
      
    </div>
  );
}