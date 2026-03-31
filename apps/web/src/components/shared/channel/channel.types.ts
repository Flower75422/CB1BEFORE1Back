// ─────────────────────────────────────────────────────────────
// Universal Channel Types
// Used by both the Cards page and Communities page channel UI.
// ─────────────────────────────────────────────────────────────

export interface ChannelLink {
  platform: string;
  label: string;
  url: string;
}

/** Normalized channel shape — map your store data into this before rendering */
export interface ChannelData {
  /** Store key used for broadcasts, subscriptions, mute, etc. */
  id: string;
  name: string;
  handle?: string;       // e.g. "@web3_founders"
  avatarUrl?: string;
  bio?: string;
  owner?: string;        // display name of the owner
  ownerId?: string;
  subs?: number;
  isPrivate?: boolean;
  links?: ChannelLink[];
  category?: string;
}
