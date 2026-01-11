import { Lightbulb, Palette } from "lucide-react";
import type { CanvasElement } from "@/types";
import { ELEMENT_COLORS } from "@/colors";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function CalloutElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const colorValue = element.props?.color || "#eab308";

  if (mode === "view") {
    return (
      <div
        className="w-full my-6 flex items-start gap-4 p-5 rounded-xl border shadow-sm backdrop-blur-sm bg-zinc-900/50"
        style={{
          borderColor: `${colorValue}40`,
        }}
      >
        <div className="shrink-0">
          <div
            className="p-2.5 rounded-lg border shadow-inner"
            style={{
              backgroundColor: `${colorValue}`,
            }}
          >
            <Lightbulb
              className="w-5 h-5 text-zinc-950"
              strokeWidth={2.5}
            />
          </div>
        </div>
        <div className="flex-1 py-0.5">
          <p className="text-zinc-200 text-base leading-relaxed font-medium">
            {element.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative w-full flex gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
      <div className="shrink-0 flex flex-col items-center gap-2">
        <div
          className="p-2 rounded-lg bg-zinc-800"
          style={{ color: colorValue }}
        >
          <Lightbulb className="w-5 h-5" />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Palette className="w-3 h-3 text-zinc-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 grid grid-cols-5 gap-1 bg-zinc-900 border-zinc-800">
            {ELEMENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                  element.props?.color === color.value
                    ? "border-white"
                    : "border-transparent",
                )}
                style={{ backgroundColor: color.value }}
                onClick={() =>
                  onUpdate?.(element.id, {
                    props: { ...element.props, color: color.value },
                  })
                }
                title={color.name}
              />
            ))}
          </PopoverContent>
        </Popover>
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
