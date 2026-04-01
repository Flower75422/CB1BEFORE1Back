"use client";
import CardSettings from "../components/cardsettings/CardSettings";

export default function CardSettingsPage() {
  return (
    // Wrapper div handles the full page layout and background
    <div className="min-h-screen pb-10">
      <CardSettings />
    </div>
  );
}