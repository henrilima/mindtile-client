"use client";

import { Globe } from "lucide-react";
import type { CanvasElement } from "@/manager";

export function EmbedElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const src = element.content || "";
  // Simple check for YouTube to convert to embed URL if needed could go here,
  // but for now we assume direct URL or handle generic iframe.

  if (mode === "view") {
    if (!src) return null;
    return (
      <div className="w-full my-4 aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
        <iframe
          src={src}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded content"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
        <Globe className="w-4 h-4 text-zinc-500" />
        <input
          className="flex-1 bg-transparent border-none outline-none text-zinc-300 text-sm placeholder:text-zinc-600"
          placeholder="https://exemplo.com/embed/..."
          value={element.content || ""}
          onChange={(e) => onUpdate?.(element.id, { content: e.target.value })}
        />
      </div>
      {src && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 opacity-50 hover:opacity-100 transition-opacity">
          <iframe
            src={src}
            className="w-full h-full pointer-events-none"
            title="Preview"
          />
        </div>
      )}
    </div>
  );
}
