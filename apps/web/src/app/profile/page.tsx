"use client";
import ProfileHeader from "./components/ProfileHeader";
import ProfileBody from "./components/ProfileBody";

export default function ProfilePage() {
  return (
    // min-h-screen with the stone-50 background texture
    <main className="min-h-screen w-full bg-[#FDFBF7] flex flex-col items-center overflow-x-hidden">
      
      {/* 1400px matches your Cards and Communities page width 
          pt-2 matches the parent padding of your other pages
      */}
      <div className="w-full max-w-[1400px] px-6 pt-2">
        
        {/* ProfileHeader now handles the -mt-6 and top positioning internally */}
        <ProfileHeader 
          name="Wasim Akram Dudekula"
          username="wasim_dev"
          followers="1.2k"
          following="450"
          views="12.8k"
        />

        <ProfileBody />
      </div>

    </main>
  );
}