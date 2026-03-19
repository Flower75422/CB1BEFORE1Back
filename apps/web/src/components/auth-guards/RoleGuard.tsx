"use client";

import { useAuthStore } from "@/store/auth/auth.store";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional: Show something else if denied
}

export default function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuthStore();

  // If there's no user, or their role isn't in the allowed list, deny access
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}