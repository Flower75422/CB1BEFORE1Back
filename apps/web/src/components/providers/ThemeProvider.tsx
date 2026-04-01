"use client";

export function useTheme() {
  return { theme: "light" as const };
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
