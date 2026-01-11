"use client";

import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/types";
import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { ELEMENT_COLORS } from "@/colors";

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
  const colorValue = element.props?.color || "#fafafa";
  const activeColor = ELEMENT_COLORS.find(
    (c) => c.value === colorValue || c.text === colorValue,
  );
  const colorClass = activeColor?.text || "text-zinc-50";

  const baseStyle =
    type === "title"
      ? "w-full text-xl font-bold tracking-tight wrap-break-word sm:text-2xl md:text-4xl"
      : "w-full text-md font-medium tracking-tight wrap-break-word sm:text-1xl md:text-2xl";

  const finalClass = cn(baseStyle, colorClass);

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
                  activeColor?.tailwind || "bg-zinc-50",
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <div className="flex gap-2 flex-wrap max-w-[170px]">
              {ELEMENT_COLORS.map((c) => (
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
                    c.tailwind,
                  )}
                  title={c.name}
                >
                  {(colorValue === c.value || colorValue === c.text) && (
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
