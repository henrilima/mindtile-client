"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, FileText, Images, Info, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { Kbd } from "@/components/ui/kbd";

const links = [
  { href: "/posts", label: "Posts", icon: FileText, kbd: "P" },
  { href: "/covers", label: "Capas", icon: Images, kbd: "C" },
  { href: "/about", label: "Sobre", icon: Info, kbd: "Shift + S" },
];

export default function Navbar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleToggle = () => setIsVisible((prev) => !prev);
    window.addEventListener("toggle-navbar", handleToggle);
    return () => window.removeEventListener("toggle-navbar", handleToggle);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300 origin-top",
        !isVisible &&
          "-translate-y-full opacity-0 h-0 pointer-events-none border-none",
      )}
    >
      <nav className="container mx-auto h-16 flex items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="flex items-center gap-2">
            MindTile
            <Kbd className="hidden lg:inline-flex transition-all">Ctrl + H</Kbd>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-indigo-400 relative py-1",
                  pathname === link.href
                    ? "text-indigo-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-400 after:rounded-full"
                    : "text-zinc-400",
                )}
              >
                <span
                  className="flex items-center"
                  style={{
                    gap: link?.kbd ? 8 : 0,
                  }}
                >
                  {link.label}
                  {link?.kbd ? (
                    <Kbd className="hidden lg:inline-flex transition-all">
                      {link.kbd}
                    </Kbd>
                  ) : null}
                </span>
              </Link>
            ))}
          </div>
          {isAdmin && (
            <Link href="/admin">
              <Button
                size="sm"
                className="bg-zinc-100 text-zinc-900 hover:bg-white font-medium shadow-lg shadow-white/5 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Painel
              </Button>
            </Link>
          )}
        </div>

        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-0"
            >
              <SheetHeader className="p-6 border-b border-zinc-800">
                <SheetTitle className="text-left font-bold text-xl flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  MindTile
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 p-4">
                {links.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all rounded-xl group",
                        pathname === link.href
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
                      )}
                    >
                      <link.icon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          pathname === link.href
                            ? "text-indigo-400"
                            : "text-zinc-500 group-hover:text-zinc-300",
                        )}
                      />
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {isAdmin && (
                <div className="mt-auto p-4 border-t border-zinc-800">
                  <SheetClose asChild>
                    <Link href="/admin">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Painel Administrativo
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
