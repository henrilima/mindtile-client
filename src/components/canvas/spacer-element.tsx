"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/types";

export function SpacerElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const height = element.props?.height || 24;

  if (mode === "view") {
    return <div style={{ height: `${height}px` }} className="w-full" />;
  }

  return (
    <div className="w-full relative group py-2">
      <div
        className="w-full bg-zinc-900/50 border border-dashed border-zinc-800 rounded flex flex-col items-center justify-center transition-all hover:bg-zinc-900"
        style={{ height: `${Math.max(height, 24)}px` }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-zinc-500 font-mono select-none bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
            {height}px
          </span>
        </div>
      </div>

      <div className="absolute -bottom-4 left-0 right-0 z-10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
        <div className="w-48 bg-zinc-900 border border-zinc-800 p-2 rounded-lg shadow-xl">
          <Slider
            value={[height]}
            min={8}
            max={128}
            step={8}
            onValueChange={(value) =>
              onUpdate?.(element.id, {
                props: { ...element.props, height: value[0] },
              })
            }
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
