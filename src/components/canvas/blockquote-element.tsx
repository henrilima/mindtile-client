"use client";

import type { CanvasElement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { ELEMENT_COLORS } from "@/colors";

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
  const borderColor = element.props?.borderColor || "#6366f1"; // Default Indigo-500

  if (mode === "view") {
    if (!element.content) return null;
    return (
      <blockquote
        className="border-l-4 pl-4 py-2 italic text-zinc-300 my-4 bg-zinc-900/30 rounded-r-lg"
        style={{ borderColor: borderColor }}
      >
        <p className="text-lg font-serif leading-relaxed mb-2">
          "{element.content}"
        </p>
        {author && (
          <footer className="text-sm text-zinc-500 font-sans not-italic">
            — <span className="font-semibold text-zinc-400">{author}</span>
          </footer>
        )}
      </blockquote>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <Quote className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Citação
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4 px-1">
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
                "w-4 h-4 rounded-full transition-all hover:scale-110",
                color.tailwind,
                borderColor === color.value &&
                  "ring-1 ring-white ring-offset-1 ring-offset-zinc-950",
              )}
              title={color.name}
            />
          ))}
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
