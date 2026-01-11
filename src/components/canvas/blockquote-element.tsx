"use client";

import type { CanvasElement } from "@/types";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Quote, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { ELEMENT_COLORS } from "@/colors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function BlockquoteElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const author = element.props?.author || "";
  const borderColor = element.props?.borderColor || "#6366f1";

  if (mode === "view") {
    if (!element.content) return null;
    return (
      <blockquote
        className="relative my-8 pl-8 pr-6 py-6 border-l-4 bg-zinc-900/40 rounded-r-2xl transition-all hover:bg-zinc-900/60"
        style={{ borderColor: borderColor }}
      >
        <Quote
          className="absolute top-4 right-4 w-10 h-10 opacity-40"
          style={{ color: borderColor, fill: borderColor }}
        />
        <p className="text-xl md:text-2xl font-serif leading-relaxed text-zinc-200 italic relative z-10">
          "{element.content}"
        </p>
        {author && (
          <footer className="mt-4 flex items-center gap-3 text-sm text-zinc-400">
            <div className="h-px w-8 bg-zinc-700" />
            <span className="font-semibold tracking-wide uppercase text-xs">
              {author}
            </span>
          </footer>
        )}
      </blockquote>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Quote className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Citação
            </span>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 grid grid-cols-5 gap-1 bg-zinc-900 border-zinc-800">
              {ELEMENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    onUpdate?.(element.id, {
                      props: { ...element.props, borderColor: color.value },
                    })
                  }
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                    color.tailwind,
                    borderColor === color.value
                      ? "border-white"
                      : "border-transparent",
                  )}
                  title={color.name}
                />
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <Textarea
          value={element.content || ""}
          onChange={(e) => onUpdate?.(element.id, { content: e.target.value })}
          placeholder="Digite a citação aqui..."
          className="bg-transparent border-zinc-800 focus:ring-0 min-h-[80px] text-lg font-serif italic text-zinc-200 resize-none"
        />
        <Input
          value={author}
          onChange={(e) =>
            onUpdate?.(element.id, {
              props: { ...element.props, author: e.target.value },
            })
          }
          placeholder="Autor (opcional)"
          className="bg-zinc-950/50 border-zinc-800 h-8 text-sm"
        />
      </div>
    </div>
  );
}
