import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Sidebar from "../components/layout/Sidebar";
import AuthGuard from "../components/auth-guards/AuthGuard";
import ThemeProvider from "../components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cobucket",
  description: "Connect via Interest Pools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <head>
        <style>{`*{scrollbar-width:none!important;-ms-overflow-style:none!important;}*::-webkit-scrollbar{display:none!important;width:0!important;height:0!important;}`}</style>
      </head>
      <body className={`${inter.className} bg-[#FDFBF7] text-[#1c1917] overflow-hidden transition-colors duration-200`}>
        
        <ThemeProvider>
          <AuthGuard>
            <div className="flex h-screen w-full">

              <Sidebar />

              <main className="flex-1 overflow-y-auto no-scrollbar h-full p-8 relative scroll-smooth">
                {children}
              </main>

            </div>
          </AuthGuard>
        </ThemeProvider>

      </body>
    </html>
  );
}