"use client";

import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/manager";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const COLORS = [
  { name: "White", value: "text-zinc-100", bg: "bg-zinc-100" },
  { name: "Red", value: "text-red-400", bg: "bg-red-400" },
  { name: "Orange", value: "text-orange-400", bg: "bg-orange-400" },
  { name: "Yellow", value: "text-yellow-400", bg: "bg-yellow-400" },
  { name: "Green", value: "text-green-400", bg: "bg-green-400" },
  { name: "Emerald", value: "text-emerald-400", bg: "bg-emerald-400" },
  { name: "Blue", value: "text-blue-400", bg: "bg-blue-400" },
  { name: "Purple", value: "text-purple-400", bg: "bg-purple-400" },
];

export function TitleElement({
  element,
  onUpdate,
  mode = "edit",
  type = "title",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
  type?: "title" | "subtitle";
}) {
  const color = element.props?.color || "text-zinc-100"; // Default white/zinc-100
  // Note: subtitles traditionally used text-gray-300, but logic can handle specific default later if needed.
  // For now let's use the passed color or default.

  const baseStyle =
    type === "title"
      ? "w-full text-xl font-bold tracking-tight wrap-break-word sm:text-2xl md:text-4xl"
      : "w-full text-md font-medium tracking-tight wrap-break-word sm:text-1xl md:text-2xl";

  // If no color prop is set, subtitles default to gray-300 in utils, but here we can stick to the palette system.
  // We'll trust the prop if present, else default.

  const finalClass = cn(baseStyle, color);

  if (mode === "view") {
    if (type === "title") {
      return <h1 className={finalClass}>{element.content}</h1>;
    }
    return <h2 className={finalClass}>{element.content}</h2>;
  }

  return (
    <div className="group relative w-full flex items-center gap-2">
      <div className="flex-1">
        <input
          className={cn(
            finalClass,
            "bg-transparent border-none outline-none placeholder:text-zinc-500/50",
          )}
          placeholder={type === "title" ? "Título" : "Subtítulo"}
          value={element.content || ""}
          onChange={(e) => onUpdate?.(element.id, { content: e.target.value })}
        />
      </div>

      {/* Color picker trigger - shows on hover/focus */}
      <div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-900"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full",
                  COLORS.find((c) => c.value === color)?.bg || "bg-zinc-100",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <div className="flex gap-2 flex-wrap max-w-[170px]">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() =>
                    onUpdate?.(element.id, {
                      props: { ...element.props, color: c.value },
                    })
                  }
                  className={cn(
                    "w-6 h-6 rounded-full border border-zinc-700 hover:scale-110 transition-transform flex items-center justify-center",
                    c.bg,
                  )}
                  title={c.name}
                >
                  {color === c.value && (
                    <Check className="w-3 h-3 text-zinc-900 font-bold" />
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
