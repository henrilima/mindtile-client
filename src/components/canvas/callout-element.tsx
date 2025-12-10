"use client";

import { Lightbulb } from "lucide-react";
import type { CanvasElement } from "@/manager";

export function CalloutElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  if (mode === "view") {
    return (
      <div className="w-full my-4 flex gap-4 p-4 rounded-xl bg-zinc-500/10 border border-yellow-400/60">
        <div className="shrink-0">
          <div className="p-2 rounded-lg bg-zinc-500/20 text-indigo-400">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-indigo-200 text-sm leading-relaxed">
            {element.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
      <div className="shrink-0">
        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500">
          <Lightbulb className="w-5 h-5 text-yellow-300" />
        </div>
      </div>
      <textarea
        className="flex-1 bg-transparent border-none outline-none text-zinc-300 text-sm leading-relaxed resize-none placeholder:text-zinc-600"
        placeholder="Digite uma ideia, dica ou observação..."
        rows={2}
        value={element.content || ""}
        onChange={(e) => {
          onUpdate?.(element.id, { content: e.target.value });
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
    </div>
  );
}
