"use client";

import { useState } from "react";
import { Crown, MapPin, Loader2 } from "lucide-react";

export default function ProfileFormtwo({ card, updateCard }: any) {
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const team = card?.team || [{ name: "You", handle: "@user", role: "Owner" }];
  const owner = team.find((m: any) => m.role === 'Owner') || team[0];

  // Location State
  const showLocation = card?.location?.enabled || false;
  const locationText = card?.location?.name || "";

  const toggleLocation = async () => {
    // If turning OFF
    if (showLocation) {
      if (updateCard) {
        updateCard({ location: { ...card?.location, enabled: false } });
      }
      return;
    }

    // If turning ON
    setIsLocating(true);
    setLocError("");

    if (!navigator.geolocation) {
      setLocError("Geolocation not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Fetch readable city/country from OpenStreetMap (Free, no API key required)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
          const data = await res.json();

          const city = data.address.city || data.address.town || data.address.village || data.address.state || "Unknown Area";
          const country = data.address.country || "Unknown Country";
          const locString = `${city}, ${country}`;

          if (updateCard) {
            updateCard({
              location: { enabled: true, name: locString, lat: position.coords.latitude, lng: position.coords.longitude }
            });
          }
        } catch (err) {
          setLocError("Could not resolve city name");
          // Fallback if the fetch fails
          if (updateCard) {
            updateCard({
              location: { enabled: true, name: "Hyderabad, India" } 
            });
          }
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setLocError("Permission denied");
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 🔴 NEW: Location Toggle Block */}
      <div className="space-y-2 mt-1">
        <div className="flex items-center justify-between ml-1">
          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
            Public Location
          </label>
          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider">
            {showLocation ? "Visible" : "Hidden"}
          </span>
        </div>

        <div className={`flex items-center justify-between p-2 px-3 border rounded-xl transition-all ${
          showLocation ? "bg-white border-stone-300 shadow-sm" : "bg-stone-50 border-stone-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              showLocation ? "bg-[#1c1917] text-white shadow-sm" : "bg-white border border-stone-200 text-stone-400"
            }`}>
              {isLocating ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} strokeWidth={2.5} />}
            </div>
            <div className="flex flex-col">
              <span className={`text-[12px] font-bold leading-none ${showLocation ? "text-[#1c1917]" : "text-stone-400"}`}>
                {isLocating ? "Locating..." : showLocation ? locationText || "Hyderabad, India" : "Add current location"}
              </span>
              
              {locError ? (
                <span className="text-[9px] font-semibold text-red-500 mt-0.5">{locError}</span>
              ) : (
                <span className="text-[9px] font-semibold text-stone-400 mt-0.5">
                  {showLocation ? "Added to your card" : "Optional display"}
                </span>
              )}
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={(e) => { e.preventDefault(); toggleLocation(); }}
            disabled={isLocating}
            className={`w-10 h-6 rounded-full p-1 transition-colors flex shrink-0 border border-transparent ${
              showLocation ? "bg-[#1c1917] justify-end" : "bg-stone-200 justify-start hover:bg-stone-300"
            } ${isLocating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>
      </div>

      {/* Existing Owner Block */}
      <div className="space-y-2">
        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Card Owner</label>
        <div className="flex items-center justify-between p-2 px-3 bg-stone-50 border border-stone-200 rounded-xl shadow-sm hover:border-stone-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-[11px] font-black text-[#1c1917] shadow-sm">
              {owner.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#1c1917] leading-none">{owner.name}</span>
              <span className="text-[9px] font-semibold text-stone-400 mt-0.5">{owner.handle}</span>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 shadow-sm">
            <Crown size={10} strokeWidth={3} /> Owner
          </span>
        </div>
      </div>

    </div>
  );
}