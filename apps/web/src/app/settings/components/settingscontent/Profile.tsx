"use client";

import { useState, useRef } from "react";
import { Camera, Check, AtSign, MapPin, Loader2, AlertCircle, UserCircle, FileText, ImageIcon } from "lucide-react";
import { useProfileStore } from "@/store/profile/profile.store";

const inputCls = "w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-[13px] text-stone-600 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors";

const TAKEN_HANDLES = ["wasim", "admin", "cobucket", "test", "user123", "john_doe"];
const HANDLE_REGEX  = /^[a-zA-Z0-9_]*$/;
const NAME_REGEX    = /^[a-zA-Z0-9 ]*$/;
const BIO_LIMIT     = 225;
const HANDLE_LIMIT  = 30;
const NAME_LIMIT    = 30;

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

export default function Profile() {
  const { profileData, updateProfile, updateAvatar, updateBanner } = useProfileStore();
  const { name, avatarUrl, bannerUrl, bio } = profileData;
  const [saved, setSaved] = useState(false);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateBanner(reader.result as string);
    reader.readAsDataURL(file);
  };

  const [displayName, setDisplayName] = useState(name);
  const nameError = displayName.length > 0 && !NAME_REGEX.test(displayName)
    ? "Only letters, numbers and spaces" : "";

  const [handle, setHandle] = useState(profileData.username ?? "");
  const [handleStatus, setHandleStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const handleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHandleChange = (val: string) => {
    if (!HANDLE_REGEX.test(val) || val.length > HANDLE_LIMIT) return;
    setHandle(val);
    setHandleStatus("idle");
    if (handleTimer.current) clearTimeout(handleTimer.current);
    if (val.length < 2) return;
    setHandleStatus("checking");
    handleTimer.current = setTimeout(() => {
      // Don't flag the user's own current handle as taken
      const currentHandle = (profileData.username || "").toLowerCase();
      const isTaken = val.toLowerCase() !== currentHandle && TAKEN_HANDLES.includes(val.toLowerCase());
      setHandleStatus(isTaken ? "taken" : "available");
    }, 600);
  };

  const [bioText, setBioText]     = useState(bio.text ?? "");
  const [location, setLocation]   = useState(bio.location ?? "");
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError]   = useState("");
  const bioRemaining = BIO_LIMIT - bioText.length;

  const detectLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported"); return; }
    setLocLoading(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city    = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";
          const country = data.address?.country || "";
          setLocation(city && country ? `${city}, ${country}` : data.display_name?.split(",").slice(0, 2).join(", ").trim() || "");
        } catch { setLocError("Could not fetch location name"); }
        finally  { setLocLoading(false); }
      },
      (err) => { setLocLoading(false); setLocError(err.code === 1 ? "Permission denied" : "Could not detect location"); },
      { timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div>
        <h2 className="text-[15px] font-semibold text-stone-700">Public Profile</h2>
        <p className="text-[12px] text-stone-400 mt-0.5">Manage your public identity</p>
      </div>

      {/* ── Profile Preview Card ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-stone-100 overflow-hidden bg-white shadow-sm">
        {/* Banner */}
        <div
          className="h-[72px] w-full relative group cursor-pointer"
          onClick={() => bannerFileRef.current?.click()}
        >
          {bannerUrl
            ? <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-150 to-stone-300" />
          }
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-1.5 text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={13} /> Change Banner
          </div>
        </div>
        <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />

        {/* Avatar row */}
        <div className="px-4 pb-3 -mt-5 flex items-end gap-3">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => avatarFileRef.current?.click()}
          >
            <div className="h-11 w-11 rounded-xl border-2 border-white overflow-hidden bg-stone-100 shadow-sm">
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={11} className="text-white" />
            </div>
          </div>
          <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <div className="pb-0.5 min-w-0">
            <p className="text-[13px] font-semibold text-stone-700 truncate">{displayName || "Display Name"}</p>
            <p className="text-[11px] text-stone-400">@{handle || "handle"}</p>
          </div>
          <div className="ml-auto pb-0.5">
            <span className="text-[10px] text-stone-300 bg-stone-50 border border-stone-100 px-2 py-1 rounded-lg">Preview</span>
          </div>
        </div>
      </div>

      {/* ── Identity ─────────────────────────────────────────────────── */}
      <SectionBlock icon={UserCircle} label="Identity">
        <div className="grid grid-cols-2 gap-2.5">

          {/* Display Name */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-stone-400 ml-0.5">Display Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                const v = e.target.value;
                if (NAME_REGEX.test(v) && v.length <= NAME_LIMIT) setDisplayName(v);
              }}
              placeholder="Your name"
              className={inputCls + (nameError ? " border-red-300 focus:border-red-400" : "")}
            />
            {nameError && <p className="text-[10px] text-red-400 ml-0.5">{nameError}</p>}
          </div>

          {/* Handle */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-stone-400 ml-0.5">Handle</span>
            <div className="relative">
              <AtSign size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" />
              <input
                type="text"
                value={handle}
                onChange={(e) => onHandleChange(e.target.value)}
                placeholder="yourhandle"
                className={`${inputCls} pl-8 pr-8 ${
                  handleStatus === "taken"     ? "border-red-300 focus:border-red-400"   :
                  handleStatus === "available" ? "border-green-300 focus:border-green-400" : ""
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {handleStatus === "checking"  && <Loader2 size={11} className="animate-spin text-stone-300" />}
                {handleStatus === "available" && <Check   size={11} className="text-green-500" />}
                {handleStatus === "taken"     && <AlertCircle size={11} className="text-red-400" />}
              </span>
            </div>
            {handleStatus === "taken"     && <p className="text-[10px] text-red-400 ml-0.5">Already taken</p>}
            {handleStatus === "available" && <p className="text-[10px] text-green-500 ml-0.5">Available</p>}
            {handleStatus === "idle"      && <p className="text-[10px] text-stone-300 ml-0.5">Letters, numbers and _</p>}
          </div>

        </div>
      </SectionBlock>

      {/* ── About ────────────────────────────────────────────────────── */}
      <SectionBlock icon={FileText} label="About">

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-stone-400 ml-0.5">Location</span>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-300" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className={`${inputCls} pl-8`}
              />
            </div>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locLoading}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-500 text-[11px] font-medium hover:border-stone-400 hover:text-stone-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {locLoading ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />}
              {locLoading ? "Detecting…" : "Detect"}
            </button>
          </div>
          {locError && <p className="text-[10px] text-red-400 ml-0.5">{locError}</p>}
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-stone-400 ml-0.5">Bio</span>
          <textarea
            value={bioText}
            onChange={(e) => { if (e.target.value.length <= BIO_LIMIT) setBioText(e.target.value); }}
            rows={3}
            placeholder="Tell people a bit about yourself…"
            className={`${inputCls} resize-none leading-relaxed ${bioRemaining <= 10 ? "border-amber-300 focus:border-amber-400" : ""}`}
          />
          <div className="flex justify-end">
            <span className={`text-[10px] tabular-nums ${bioRemaining <= 10 ? "text-amber-500" : bioRemaining <= 30 ? "text-stone-400" : "text-stone-300"}`}>
              {bioRemaining} / {BIO_LIMIT}
            </span>
          </div>
        </div>

      </SectionBlock>

      {/* ── Banner Upload standalone hint ────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50/60 border border-stone-100 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-stone-100">
            <ImageIcon size={13} className="text-stone-400" />
          </div>
          <div>
            <p className="text-[13px] text-stone-600">Profile Banner</p>
            <p className="text-[11px] text-stone-400">{bannerUrl ? "Banner uploaded — click the preview above to change" : "Click the banner preview above to upload"}</p>
          </div>
        </div>
        {bannerUrl && (
          <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded-lg">Uploaded</span>
        )}
      </div>

      {/* ── Save ─────────────────────────────────────────────────────── */}
      <div className="pt-1 border-t border-stone-100 flex justify-end">
        <button
          disabled={!!nameError || handleStatus === "taken" || handleStatus === "checking"}
          onClick={() => {
            updateProfile({ name: displayName, username: handle, bio: { text: bioText, location } });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-[12px] font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={13} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

    </div>
  );
}
