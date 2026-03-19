"use client";
import ChannelGrid from "@/app/communities/components/display/channels/ChannelGrid";
import { useRouter } from "next/navigation";

export default function ControllerChannel() {
  const router = useRouter();

  const handleCreateNew = () => {
    // Navigate to communities page to open the create flow
    // or you can trigger a local state if the controller is available here
    router.push("/communities"); 
  };

  return (
    <div className="w-full">
      <div className="-ml-4 animate-in fade-in slide-in-from-bottom-3 duration-700"> 
        {/* We pass the filter 'my_channels'. 
          Inside ChannelGrid, if the result is empty, it will now 
          render the EmptyCommunityState we built.
        */}
        <ChannelGrid 
          filter="my_channels" 
          onCreateRequest={handleCreateNew} 
        />
      </div>
    </div>
  );
}