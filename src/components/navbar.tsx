"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-background">
      <nav className="max-w-5xl mx-auto h-16 flex items-center place-content-between px-4 gap-6">
        <Link href="/" className="text-xl font-semibold">
          MindTile
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/posts"><p className="font-bold">Posts</p></Link>
          <Link href="/about"><p className="font-bold">Sobre</p></Link>
        </div>
      </nav>
    </header>
  );
}
