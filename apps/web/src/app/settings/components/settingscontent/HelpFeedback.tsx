"use client";

import { useState } from "react";
import {
  MessageSquarePlus, Bug, BookOpen, ExternalLink,
  ChevronDown, ChevronUp, Send, Check,
  HelpCircle, ArrowUpRight, Zap,
} from "lucide-react";

const FAQS = [
  {
    q: "How do I change my primary interest?",
    a: "Go to Cards → Card Settings → choose your card and update the Primary Interest field. This drives who discovers you in the feed.",
  },
  {
    q: "How does the interest pool filter work?",
    a: "The interest pool pins topics to your filter bar. When you select a topic, the feed shows only cards/channels whose primary interest matches.",
  },
  {
    q: "Can other users see my private groups?",
    a: "No. Private groups are invisible in the explore grid. Only members with an invite link can find and join them.",
  },
  {
    q: "How do I delete a channel I created?",
    a: "Open the channel from My Channels in your profile, tap the options menu (•••) and select Delete Channel. This is permanent.",
  },
  {
    q: "What is the Handle used for?",
    a: "Your handle is your unique public ID (e.g. @yourhandle). Others can search and tag you by it. It must be globally unique.",
  },
];

const QUICK_LINKS = [
  {
    icon: BookOpen,
    label: "Documentation",
    desc: "Guides, tutorials and API references",
    badge: "Docs",
    href: "https://docs.cobucket.app",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: MessageSquarePlus,
    label: "Community Forum",
    desc: "Ask questions and get answers",
    badge: "Forum",
    href: "https://community.cobucket.app",
    badgeColor: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: Zap,
    label: "Status Page",
    desc: "Real-time service uptime",
    badge: "Live",
    href: "https://status.cobucket.app",
    badgeColor: "bg-green-50 text-green-600 border-green-100",
  },
];

function SectionBlock({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 bg-stone-50/60 border border-stone-100 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-stone-100">
          <Icon size={11} className="text-stone-500" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</span>
      </div>
      {children}
    </div>
  );
}

export default function HelpFeedback() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<"feedback" | "bug">("feedback");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-stone-700">Help &amp; Feedback</h2>
        <p className="text-[12px] text-stone-400 mt-0.5">FAQs, support and send us your thoughts</p>
      </div>

      {/* ── Quick Access ──────────────────────────────────────────────── */}
      <SectionBlock icon={ExternalLink} label="Quick Access">
        <div className="flex flex-col gap-2">
          {QUICK_LINKS.map(({ icon: Icon, label, desc, badge, href, badgeColor }) => (
            <button
              key={label}
              onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
              className="flex items-center gap-3.5 px-3.5 py-3 bg-white border border-stone-100 rounded-xl hover:border-stone-300 hover:shadow-sm transition-all active:scale-[0.99] text-left group"
            >
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-100 group-hover:bg-stone-100 transition-colors shrink-0">
                <Icon size={14} className="text-stone-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-stone-700">{label}</p>
                <p className="text-[11px] text-stone-400">{desc}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
                <ArrowUpRight size={13} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </SectionBlock>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <SectionBlock icon={HelpCircle} label={`FAQ · ${FAQS.length} questions`}>
        <div className="flex flex-col gap-1.5">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`border rounded-xl overflow-hidden transition-colors ${openFaq === i ? "border-stone-200 bg-white" : "border-stone-100 bg-white hover:border-stone-200"}`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-[13px] text-stone-600 pr-4 font-medium">{faq.q}</span>
                <span className={`shrink-0 p-0.5 rounded-full transition-colors ${openFaq === i ? "bg-stone-100" : ""}`}>
                  {openFaq === i
                    ? <ChevronUp   size={13} className="text-stone-500" />
                    : <ChevronDown size={13} className="text-stone-300" />
                  }
                </span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3.5 border-t border-stone-100 animate-in fade-in duration-150">
                  <p className="text-[12px] text-stone-500 leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ── Send Feedback ─────────────────────────────────────────────── */}
      <SectionBlock icon={MessageSquarePlus} label="Send Feedback">

        {/* Type toggle */}
        <div className="flex gap-2">
          {[
            { id: "feedback" as const, label: "Suggestion", icon: MessageSquarePlus },
            { id: "bug"      as const, label: "Bug Report",  icon: Bug              },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFeedbackType(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-medium transition-all active:scale-95 ${
                feedbackType === id
                  ? "bg-stone-800 border-stone-800 text-white"
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-400"
              }`}
            >
              <Icon size={13} strokeWidth={1.8} /> {label}
            </button>
          ))}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={
            feedbackType === "bug"
              ? "Describe the bug, steps to reproduce and expected behaviour…"
              : "Share your idea, suggestion or general feedback…"
          }
          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-[13px] text-stone-600 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none"
        />

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-stone-400">
            {sent ? "Thanks for your feedback!" : "We read every message"}
          </p>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sent}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-[12px] font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sent ? <><Check size={13} /> Sent!</> : <><Send size={13} /> Send</>}
          </button>
        </div>

      </SectionBlock>

    </div>
  );
}
