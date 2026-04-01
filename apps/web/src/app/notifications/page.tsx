"use client";

import { useState } from "react";
import { Trash2, Bell, BellOff, Settings } from "lucide-react";
import { useNotificationsStore, Notification } from "@/store/notifications/notification.store";
import { useChatsStore } from "@/store/chats/chats.store";
import { useSettingsStore } from "@/store/settings/settings.store";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AVATAR_TYPE_COLOR: Record<string, string> = {
  mention:   "bg-blue-100 text-blue-600",
  channel:   "bg-purple-100 text-purple-600",
  group:     "bg-amber-100 text-amber-600",
  join:      "bg-green-100 text-green-600",
  broadcast: "bg-rose-100 text-rose-600",
  system:    "bg-stone-100 text-stone-500",
};

const FILTER_TABS = [
  { id: "all",       label: "All" },
  { id: "mention",   label: "Mentions" },
  { id: "channel",   label: "Channels" },
  { id: "group",     label: "Groups" },
  { id: "broadcast", label: "Broadcasts" },
] as const;

type FilterId = (typeof FILTER_TABS)[number]["id"];

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotificationsStore();
  const { emailNotifications } = useSettingsStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const handleNotificationClick = (n: Notification) => {
    markRead(n.id);
    if (n.targetId && n.targetType) {
      const tabMap: Record<string, string> = { chat: "chats", channel: "channels", group: "groups" };
      const tab = tabMap[n.targetType] || "chats";
      // Set store state BEFORE navigating so the chats page reads them on mount
      useChatsStore.getState().setActiveTab(tab);
      useChatsStore.getState().setActiveChatId(n.targetId!);
      router.push("/chats");
    }
  };

  const filteredNotifications = activeFilter === "all"
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const filteredUnread = filteredNotifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Email notifications off banner */}
      {!emailNotifications && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl">
          <BellOff size={15} className="text-amber-500 shrink-0" />
          <p className="text-[12px] text-amber-700 flex-1">
            Email notifications are turned off. You won't receive email digests for these alerts.
          </p>
          <Link
            href="/settings"
            className="shrink-0 text-[11px] text-amber-600 font-medium flex items-center gap-1 hover:underline"
          >
            <Settings size={11} /> Settings
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-[16px] font-semibold text-stone-700">Notifications</h1>
          {unreadCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#1c1917] text-white text-[10px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3.5 py-1.5 border border-stone-200 text-stone-400 text-[12px] rounded-lg hover:bg-white hover:text-stone-600 transition-colors bg-transparent"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-stone-200 text-stone-400 text-[12px] rounded-lg hover:bg-white hover:text-stone-600 transition-colors bg-transparent"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {FILTER_TABS.map((tab) => {
          const tabUnread = tab.id === "all"
            ? unreadCount
            : notifications.filter((n) => n.type === tab.id && !n.read).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap border ${
                activeFilter === tab.id
                  ? "bg-[#1c1917] text-white border-[#1c1917] shadow-sm"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {tab.label}
              {tabUnread > 0 && (
                <span className={`h-4 min-w-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center ${
                  activeFilter === tab.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                }`}>
                  {tabUnread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-sm border border-stone-100 flex flex-col items-center justify-center py-16 gap-3">
          <Bell size={28} className="text-stone-200" />
          <p className="text-[13px] text-stone-400 font-medium">
            {activeFilter === "all" ? "No notifications yet" : `No ${activeFilter} notifications`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[20px] shadow-sm divide-y divide-stone-100 overflow-hidden border border-stone-100">
          {filteredNotifications.map((n: Notification) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`px-5 py-4 flex gap-3.5 transition-colors cursor-pointer ${n.read ? "hover:bg-stone-50" : "bg-blue-50/40 hover:bg-blue-50/70"}`}
            >
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${n.avatarColor || AVATAR_TYPE_COLOR[n.type]}`}>
                {n.avatarUrl
                  ? <img src={n.avatarUrl} alt={n.title} className="w-full h-full object-cover rounded-full" />
                  : n.avatarInitials
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-stone-600">
                  <span className="font-semibold text-stone-700">{n.title}</span>{" "}
                  {n.message}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] text-stone-400">{n.time}</span>
                {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
