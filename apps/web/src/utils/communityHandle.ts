/**
 * Community Handle Utility
 * Format:  @{content_slug}/{type}/{owner_id}
 *
 * Rules — same for content slug AND owner ID:
 *   Allowed chars : a-z · 0-9 · _ (underscore)
 *   Case          : always lowercase
 *   Spaces        : converted to _
 *   Min length    : 1 character
 *   Must contain  : at least one letter or number (not underscore-only)
 *
 * Uniqueness:
 *   Owner ID   → must be globally unique (checked against user registry)
 *   Channel ID → no global check (owner ID in handle makes it unique)
 *   Group ID   → no global check (owner ID in handle makes it unique)
 *
 * Examples:
 *   @web3_founders/ch/wasim123
 *   @python_devs/gr/dr_aris
 *   @a/ch/1          ← single char is valid
 *   @_internal/gr/wasim_d
 */

/** Unified slugify — letters, numbers, underscores; spaces → _ */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

export const slugifyOwner = slugify;

/**
 * Validates any ID segment (owner, channel, or group).
 * Returns true if:
 *  - at least 1 character
 *  - only a-z, 0-9, _
 *  - contains at least one letter or number (not underscore-only)
 */
export function isValidId(id: string): boolean {
  if (!id || id.length === 0) return false;
  if (!/^[a-z0-9_]+$/.test(id)) return false;
  if (!/[a-z0-9]/.test(id)) return false; // must have at least one letter or number
  return true;
}

/** Friendly validation message for UI */
export function getIdError(id: string, label = "ID"): string | null {
  if (!id || id.length === 0) return `${label} cannot be empty`;
  if (!/^[a-z0-9_]+$/.test(id.toLowerCase())) return `${label} can only contain letters, numbers, and underscores`;
  if (!/[a-z0-9]/.test(id.toLowerCase())) return `${label} must contain at least one letter or number`;
  return null;
}

// ── Cooldown rules ────────────────────────────────────────────────────────────
export const CHANNEL_HANDLE_COOLDOWN_DAYS = 12;
export const GROUP_HANDLE_COOLDOWN_DAYS   = 12;
export const OWNER_ID_COOLDOWN_DAYS       = 30;

/**
 * Returns cooldown info for a handle edit.
 *
 * Rules:
 *   - Edit 1 & 2 : always free (no wait)
 *   - Edit 3+    : must wait cooldownDays from the previous edit
 *
 * @param lastEditedAt  ISO date of last handle edit (undefined = never edited)
 * @param editCount     How many times the handle has been edited so far
 * @param cooldownDays  12 for channel/group · 30 for owner ID
 */
export function getHandleCooldown(
  lastEditedAt: string | undefined,
  cooldownDays: number,
  editCount: number = 0,
): { canEdit: boolean; daysLeft: number; nextEditDate: Date | null } {
  // First 2 edits are always free
  if (editCount < 2) return { canEdit: true, daysLeft: 0, nextEditDate: null };
  if (!lastEditedAt)  return { canEdit: true, daysLeft: 0, nextEditDate: null };

  const last       = new Date(lastEditedAt).getTime();
  const now        = Date.now();
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  const elapsed    = now - last;

  if (elapsed >= cooldownMs) return { canEdit: true, daysLeft: 0, nextEditDate: null };

  const daysLeft     = Math.ceil((cooldownMs - elapsed) / (24 * 60 * 60 * 1000));
  const nextEditDate = new Date(last + cooldownMs);
  return { canEdit: false, daysLeft, nextEditDate };
}

// ─────────────────────────────────────────────────────────────────────────────

export function generateChannelHandle(channelName: string, ownerHandle: string): string {
  const slug  = slugify(channelName);
  const owner = slugify(ownerHandle.replace(/^@/, ""));
  return `@${slug}/ch/${owner}`;
}

export function generateGroupHandle(groupName: string, ownerHandle: string): string {
  const slug  = slugify(groupName);
  const owner = slugify(ownerHandle.replace(/^@/, ""));
  return `@${slug}/gr/${owner}`;
}

/** Parse any handle string into its three parts */
export function parseHandle(handle: string): {
  contentSlug: string;
  type: "ch" | "gr";
  ownerHandle: string;
  isChannel: boolean;
  isGroup: boolean;
} | null {
  const clean = handle.replace(/^@/, "");
  const parts = clean.split("/");
  if (parts.length === 3 && (parts[1] === "ch" || parts[1] === "gr")) {
    return {
      contentSlug: parts[0],
      type:        parts[1] as "ch" | "gr",
      ownerHandle: parts[2],
      isChannel:   parts[1] === "ch",
      isGroup:     parts[1] === "gr",
    };
  }
  return null;
}

/** Returns the three display segments */
export function splitHandle(handle: string): [string, string, string] | null {
  const parsed = parseHandle(handle);
  if (!parsed) return null;
  return [
    `@${parsed.contentSlug}`,
    `/${parsed.type}/`,
    parsed.ownerHandle,
  ];
}
