import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import BrainIcon from "@/images/Brain.png";

export const metadata: Metadata = {
  title: {
    template: "%s | MindTile",
    default: "MindTile",
  },
  description:
    "Explore artigos, tutoriais e ideias inovadoras sobre tecnologia, desenvolvimento e design. Desvende novos horizontes do conhecimento com o MindTile.",
  metadataBase: new URL("https://mindtile.vercel.app"),
  authors: [{ name: "MindTile Team", url: "https://mindtile.vercel.app" }],
  keywords: [
    "tecnologia",
    "desenvolvimento",
    "design",
    "artigos",
    "blog",
    "conhecimento",
  ],
  icons: {
    icon: [{ url: "/icon.ico" }, { url: BrainIcon.src, type: "image/png" }],
    shortcut: "/icon.ico",
    apple: BrainIcon.src,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://mindtile.vercel.app",
    title: "MindTile",
    description:
      "Explore artigos, tutoriais e ideias inovadoras sobre tecnologia, desenvolvimento e design.",
    siteName: "MindTile",
    images: [
      {
        url: BrainIcon.src,
        width: 1200,
        height: 630,
        alt: "MindTile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindTile",
    description:
      "Explore artigos, tutoriais e ideias inovadoras sobre tecnologia, desenvolvimento e design.",
    images: [BrainIcon.src],
    creator: "@mindtile",
  },
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
