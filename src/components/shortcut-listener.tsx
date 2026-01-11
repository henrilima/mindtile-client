"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { shortcuts, type ShortcutDetails } from "@/lib/shortcuts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Keyboard } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";

export function ShortcutListener() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeShortcuts, setActiveShortcuts] = useState<[string, string][]>(
    [],
  );

  const getActiveShortcuts = useCallback(() => {
    const active: [string, string][] = [];

    // Verificando se os shortcuts estão desativados para esta rota
    const currentRouteConfig = shortcuts?.[pathname];
    const isRouteDisabled = currentRouteConfig?.disabled;
    let isDynamicRouteDisabled = false;

    Object.keys(shortcuts || {}).forEach((routeKey) => {
      if (routeKey.endsWith("*")) {
        const baseRoute = routeKey.slice(0, -1);
        if (
          pathname.startsWith(baseRoute) &&
          pathname !== baseRoute &&
          pathname !== baseRoute.slice(0, -1)
        ) {
          if (shortcuts[routeKey]?.disabled) {
            isDynamicRouteDisabled = true;
          }
        }
      }
    });

    if (isRouteDisabled || isDynamicRouteDisabled) {
      return [];
    }

    if (shortcuts?.["global"]) {
      Object.entries(shortcuts["global"]).forEach(([key, conf]) => {
        if (
          typeof conf === "object" &&
          conf !== null &&
          "description" in conf
        ) {
          active.push([key, (conf as ShortcutDetails).description]);
        }
      });
    }

    if (currentRouteConfig) {
      Object.entries(currentRouteConfig).forEach(([key, conf]) => {
        if (
          typeof conf === "object" &&
          conf !== null &&
          "description" in conf
        ) {
          active.push([key, (conf as ShortcutDetails).description]);
        }
      });
    }

    Object.keys(shortcuts || {}).forEach((routeKey) => {
      if (routeKey.endsWith("*")) {
        const baseRoute = routeKey.slice(0, -1);
        if (
          pathname.startsWith(baseRoute) &&
          pathname !== baseRoute &&
          pathname !== baseRoute.slice(0, -1)
        ) {
          Object.entries(shortcuts[routeKey]).forEach(([key, conf]) => {
            if (
              typeof conf === "object" &&
              conf !== null &&
              "description" in conf
            ) {
              active.push([key, (conf as ShortcutDetails).description]);
            }
          });
        }
      }
    });

    return active;
  }, [pathname]);

  useEffect(() => {
    setActiveShortcuts(getActiveShortcuts());
  }, [getActiveShortcuts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable) &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        return;
      }

      // Verificando se os shortcuts estão desativados para esta rota
      const currentRouteConfig = shortcuts?.[pathname];
      const isRouteDisabled = currentRouteConfig?.disabled;
      let isDynamicRouteDisabled = false;

      Object.keys(shortcuts || {}).forEach((routeKey) => {
        if (routeKey.endsWith("*")) {
          const baseRoute = routeKey.slice(0, -1);
          if (
            pathname.startsWith(baseRoute) &&
            pathname !== baseRoute &&
            pathname !== baseRoute.slice(0, -1)
          ) {
            if (shortcuts[routeKey]?.disabled) {
              isDynamicRouteDisabled = true;
            }
          }
        }
      });

      if (isRouteDisabled || isDynamicRouteDisabled) {
        return;
      }

      const keys = [];
      if (e.metaKey) keys.push("meta");
      if (e.ctrlKey) keys.push("ctrl");
      if (e.altKey) keys.push("alt");
      if (e.shiftKey) keys.push("shift");

      if (e.key === "?") keys.push("?");
      else if (e.key === "Escape") keys.push("esc");
      else if (e.key === "Backspace") keys.push("backspace");
      else if (
        e.key !== "Control" &&
        e.key !== "Shift" &&
        e.key !== "Meta" &&
        e.key !== "Alt"
      ) {
        keys.push(e.key.toLowerCase());
      }

      const keyString = keys.join("+");

      let handler = shortcuts?.["global"]?.[keyString];
      if (handler && typeof handler === "object") {
        e.preventDefault();
        if (keyString === "shift+?" || keyString === "?") {
          setIsOpen(true);
        } else {
          handler.action(router);
        }
        return;
      }

      handler = currentRouteConfig?.[keyString];
      if (handler && typeof handler === "object") {
        e.preventDefault();
        handler.action(router);
        return;
      }

      Object.keys(shortcuts || {}).forEach((routeKey) => {
        if (routeKey.endsWith("*")) {
          const baseRoute = routeKey.slice(0, -1);
          if (
            pathname.startsWith(baseRoute) &&
            pathname !== baseRoute &&
            pathname !== baseRoute.slice(0, -1)
          ) {
            const dynamicHandler = shortcuts[routeKey]?.[keyString];
            if (dynamicHandler && typeof dynamicHandler === "object") {
              e.preventDefault();
              dynamicHandler.action(router);
            }
          }
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);

  return (
    <>
      {activeShortcuts.length > 0 && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 shadow-lg transition-all hover:bg-zinc-800 hover:text-white hover:scale-110 active:scale-95 group"
          title="Atalhos do Teclado (Shift + ?)"
        >
          <Keyboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-lg font-medium flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-indigo-400" />
              Atalhos do Teclado
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Comandos disponíveis nesta tela
            </DialogDescription>
          </DialogHeader>
          <Command className="bg-transparent">
            <CommandList className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-800">
              <CommandGroup heading="Atalhos Globais">
                {activeShortcuts
                  .filter(([k]) => shortcuts?.["global"]?.[k])
                  .map(([key, desc]) => (
                    <CommandItem
                      key={key}
                      className="flex justify-between items-center py-2 px-4 rounded-md aria-selected:bg-zinc-900"
                    >
                      <span className="text-zinc-300">{desc}</span>
                      <div className="flex gap-1">
                        {key.split("+").map((k) => (
                          <Kbd key={k}>{k}</Kbd>
                        ))}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Nesta Tela">
                {activeShortcuts
                  .filter(([k]) => !shortcuts?.["global"]?.[k])
                  .map(([key, desc]) => (
                    <CommandItem
                      key={key}
                      className="flex justify-between items-center py-2 px-4 rounded-md aria-selected:bg-zinc-900"
                    >
                      <span className="text-zinc-300">{desc}</span>
                      <div className="flex gap-1">
                        {key.split("+").map((k) => (
                          <Kbd key={k}>{k}</Kbd>
                        ))}
                      </div>
                    </CommandItem>
                  ))}
                {activeShortcuts.filter(([k]) => !shortcuts?.["global"]?.[k])
                  .length === 0 && (
                  <div className="py-6 text-center text-sm text-zinc-500">
                    Nenhum atalho específico para esta tela.
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
