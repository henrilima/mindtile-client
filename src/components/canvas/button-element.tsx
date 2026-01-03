"use client";

import type { CanvasElement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ExternalLink,
  MousePointerClick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ELEMENT_COLORS } from "@/colors";

export function ButtonElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const label = element.content || "";
  const url = element.props?.url || "";
  const variant = element.props?.variant || "default";
  const align = element.props?.align || "start";
  const customColor = element.props?.color;

  if (mode === "view") {
    if (!label) return null;

    // Construct dynamic styles
    const style: React.CSSProperties = {};
    if (customColor) {
      if (variant === "default") {
        style.backgroundColor = customColor;
        style.color = "#ffffff";
        style.boxShadow = `0 10px 15px -3px ${customColor}40`;
      } else if (variant === "outline") {
        style.borderColor = customColor;
        style.color = customColor;
      } else if (variant === "secondary") {
        style.backgroundColor = customColor;
        style.color = "#ffffff";
      } else if (variant === "ghost" || variant === "link") {
        style.color = customColor;
      }
    }

    return (
      <div
        className={cn(
          "w-full flex py-2",
          align === "center" && "justify-center",
          align === "end" && "justify-end",
          align === "start" && "justify-start",
        )}
      >
        <Button
          variant={variant === "default" ? "default" : (variant as any)}
          asChild
          style={style}
          className={cn(
            "rounded-md transition-all duration-300 transform hover:scale-105",
            !customColor &&
              variant === "default" &&
              "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20",
            !customColor &&
              variant === "secondary" &&
              "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
            !customColor &&
              variant === "outline" &&
              "border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900",
          )}
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            {label}
            {variant !== "link" && <ExternalLink className="w-4 h-4 ml-2" />}
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <MousePointerClick className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Botão
          </span>
        </div>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={(val) =>
            val &&
            onUpdate?.(element.id, { props: { ...element.props, align: val } })
          }
        >
          <ToggleGroupItem value="start" size="sm">
            <AlignLeft className="w-3 h-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" size="sm">
            <AlignCenter className="w-3 h-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="end" size="sm">
            <AlignRight className="w-3 h-3" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor={`button-text-${element.id}`}
            className="text-xs text-zinc-500 font-medium"
          >
            Texto do Botão
          </label>
          <Input
            id={`button-text-${element.id}`}
            value={label}
            onChange={(e) =>
              onUpdate?.(element.id, { content: e.target.value })
            }
            placeholder="Clique aqui"
            className="bg-zinc-950 border-zinc-800"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`button-url-${element.id}`}
            className="text-xs text-zinc-500 font-medium"
          >
            Link de Destino
          </label>
          <Input
            id={`button-url-${element.id}`}
            value={url}
            onChange={(e) =>
              onUpdate?.(element.id, {
                props: { ...element.props, url: e.target.value },
              })
            }
            placeholder="https://exemplo.com"
            className="bg-zinc-950 border-zinc-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor={`button-style-${element.id}`}
            className="text-xs text-zinc-500 font-medium"
          >
            Estilo
          </label>
          <Select
            value={variant}
            onValueChange={(val) =>
              onUpdate?.(element.id, {
                props: { ...element.props, variant: val },
              })
            }
          >
            <SelectTrigger
              id={`button-style-${element.id}`}
              className="w-full bg-zinc-950 border-zinc-800"
            >
              <SelectValue placeholder="Selecione o estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Destaque (Sólido)</SelectItem>
              <SelectItem value="secondary">Secundário</SelectItem>
              <SelectItem value="outline">Contorno</SelectItem>
              <SelectItem value="ghost">Transparente</SelectItem>
              <SelectItem value="link">Apenas Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="text-xs text-zinc-500 font-medium">Cor</span>
          <div className="flex gap-2 flex-wrap">
            {ELEMENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() =>
                  onUpdate?.(element.id, {
                    props: { ...element.props, color: color.value },
                  })
                }
                className={cn(
                  "w-6 h-6 rounded-full transition-all hover:scale-110 border border-transparent",
                  color.tailwind,
                  customColor === color.value &&
                    "ring-2 ring-white ring-offset-2 ring-offset-zinc-950",
                )}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
