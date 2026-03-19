"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Wait until Zustand has finished loading the user state from local storage/backend
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show a loading state while checking
  if (!isInitialized || !isAuthenticated) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#FDFBF7]">Loading...</div>;
  }

  return <>{children}</>;
}