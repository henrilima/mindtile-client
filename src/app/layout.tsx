import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "MindTile",
  description: "Desvende novos horizontes do conhecimento.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin")?.value === "true";

  return (
    <html lang="pt" className="dark">
      <body className="antialiased relative min-h-screen bg-background">
        <Navbar isAdmin={isAdmin}></Navbar>
        {children}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-indigo-900/10 blur-3xl" />
          <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-indigo-900/20 blur-3xl" />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
