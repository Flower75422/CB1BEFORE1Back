// ──────────────────────────────────────────────────────────────────────────
// Cobucket WebSocket Event Schema — v1
//
// This file defines the full event type system for real-time communication.
// Replace the `CobucketSocket.connect()` placeholder with a real WebSocket
// or Socket.io client when the backend is ready.
// ──────────────────────────────────────────────────────────────────────────

// ── Event Payloads ────────────────────────────────────────────────────────

/** Direct message between two users */
export interface DirectMessageEvent {
  type: "direct:message";
  payload: {
    chatId: string;       // conversation ID (e.g. user handle or UUID)
    messageId: string;
    senderId: string;
    text: string;
    time: string;         // ISO timestamp
    readBy?: string[];    // user IDs who have already read this message
  };
}

/** Read receipt — recipient has opened/seen a message */
export interface ReadReceiptEvent {
  type: "direct:read";
  payload: {
    chatId: string;
    messageId: string;
    userId: string;       // the user who read it
    time: string;         // ISO timestamp of when they read it
  };
}

/** New channel broadcast posted by the owner */
export interface BroadcastNewEvent {
  type: "broadcast:new";
  payload: {
    channelId: string;
    broadcastId: string;
    text: string;
    mediaUrl?: string;
    time: string;
    isPinned?: boolean;
  };
}

/** Owner pinned or unpinned a broadcast */
export interface BroadcastPinEvent {
  type: "broadcast:pin";
  payload: {
    channelId: string;
    broadcastId: string | null; // null = unpin
  };
}

/** New group chat message */
export interface GroupMessageEvent {
  type: "group:message";
  payload: {
    groupId: string;
    messageId: string;
    senderId: string;
    senderName: string;
    text: string;
    time: string;
  };
}

/** User joined or left a group */
export interface GroupPresenceEvent {
  type: "group:presence";
  payload: {
    groupId: string;
    userId: string;
    userName: string;
    action: "join" | "leave";
  };
}

/** Push notification sent to a specific user */
export interface NotificationEvent {
  type: "notification:new";
  payload: {
    notificationId: string;
    recipientId: string;
    notificationType: "mention" | "channel" | "group" | "join" | "broadcast" | "system";
    title: string;
    message: string;
    time: string;
    avatarUrl?: string;
  };
}

/** User online/offline presence update */
export interface PresenceEvent {
  type: "presence:update";
  payload: {
    userId: string;
    status: "online" | "away" | "offline";
    lastSeen?: string;   // ISO timestamp
  };
}

/** Typing indicator in a direct chat or group */
export interface TypingEvent {
  type: "typing:start" | "typing:stop";
  payload: {
    chatId: string;      // directChat ID or groupId
    userId: string;
    userName: string;
  };
}

/** Union type of every possible socket event */
export type SocketEvent =
  | DirectMessageEvent
  | ReadReceiptEvent
  | BroadcastNewEvent
  | BroadcastPinEvent
  | GroupMessageEvent
  | GroupPresenceEvent
  | NotificationEvent
  | PresenceEvent
  | TypingEvent;

// ── Socket Client ─────────────────────────────────────────────────────────
type AnyHandler = (payload: any) => void;
type EventHandler<T extends SocketEvent> = (payload: T["payload"]) => void;

class CobucketSocket {
  private _handlers: Map<string, AnyHandler[]> = new Map();
  private _connected = false;

  /** Connect to the backend WebSocket server.
   *  TODO: swap the console.log for a real `new WebSocket(url)` or `io(url)`. */
  connect(url: string): void {
    console.log("[Socket] connect() called — backend not wired yet. URL:", url);
    this._connected = false;
  }

  disconnect(): void {
    this._connected = false;
    this._handlers.clear();
    console.log("[Socket] disconnected");
  }

  get isConnected(): boolean {
    return this._connected;
  }

  /** Register a listener for a specific event type. */
  on<T extends SocketEvent>(eventType: T["type"], handler: EventHandler<T>): void {
    const list = this._handlers.get(eventType) ?? [];
    this._handlers.set(eventType, [...list, handler as AnyHandler]);
  }

  /** Remove a previously registered listener. */
  off<T extends SocketEvent>(eventType: T["type"], handler: EventHandler<T>): void {
    const list = this._handlers.get(eventType) ?? [];
    this._handlers.set(eventType, list.filter((h) => h !== (handler as AnyHandler)));
  }

  /** Emit an event to the server (placeholder — logs until backend is ready). */
  emit<T extends SocketEvent>(event: T): void {
    console.log("[Socket] emit →", event.type, event.payload);
    // TODO: replace with real socket.send(JSON.stringify(event))
  }

  /** Simulate an incoming server event (used for frontend-only testing). */
  _simulateIncoming(event: SocketEvent): void {
    const list = this._handlers.get(event.type) ?? [];
    list.forEach((h) => h(event.payload));
  }
}

/** Singleton socket instance — import `cobucketSocket` anywhere you need real-time. */
export const cobucketSocket = new CobucketSocket();
