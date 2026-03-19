"use client";
import UserInfo from "./UserInfo";
import Bio from "./Bio";

export default function ProfileHeader() {
  return (
    <div className="bg-white rounded-[32px] p-8 -ml-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8 relative border border-stone-200/60 transition-all duration-300">
      
      {/* Profile Identity Block */}
      <UserInfo 
        name="Ravi Singh" 
        username="ravi.s" 
        followers="45" 
        following="455" 
        views="5.7m" 
      />
      
      {/* Bio Content Block */}
      <div className="mt-6">
        <Bio 
          location="New York, USA"
          text="Backend Engineer exploring the education space through technology. Passionate about scalable systems and open source."
          status="Posted in Channels 2h ago: Shared a video tutorial on load balancing techniques."
        />
      </div>
    </div>
  );
}