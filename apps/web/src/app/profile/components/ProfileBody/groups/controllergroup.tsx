"use client";
import GroupGrid from "@/app/communities/components/display/groups/GroupGrid";
import { useRouter } from "next/navigation";

export default function ControllerGroup() {
  const router = useRouter();

  const handleCreateNew = () => {
    router.push("/communities");
  };

  return (
    <div className="w-full">
      <div className="-ml-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
        {/* Passing 'my_groups' ensures you only see groups where 
          owner === "Wasim Akram" 
        */}
        <GroupGrid 
          filter="my_groups" 
          onCreateRequest={handleCreateNew}
        />
      </div>
    </div>
  );
}