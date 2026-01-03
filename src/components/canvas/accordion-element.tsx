"use client";

import type { CanvasElement } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ELEMENT_COLORS } from "@/colors";

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

export function AccordionElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const items: AccordionItemData[] = element.props?.items || [
    { id: "1", title: "Item 1", content: "Conteúdo do item 1" },
  ];
  const colorValue = element.props?.color || "#fafafa";
  const activeColor = ELEMENT_COLORS.find(
    (c) => c.value === colorValue || c.text === colorValue,
  );
  const colorClass = activeColor?.text || "text-zinc-50";

  const handleAddItem = () => {
    const newItem = {
      id: Math.random().toString(36).substring(7),
      title: `Item ${items.length + 1}`,
      content: "",
    };
    onUpdate?.(element.id, {
      props: { ...element.props, items: [...items, newItem] },
    });
  };

  const handleRemoveItem = (id: string) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        items: items.filter((item) => item.id !== id),
      },
    });
  };

  const handleUpdateItem = (
    id: string,
    field: "title" | "content",
    value: string,
  ) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        items: items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      },
    });
  };

  if (mode === "view") {
    if (!items || items.length === 0) return null;
    return (
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-zinc-800"
          >
            <AccordionTrigger
              className={cn(
                "text-lg cursor-pointer hover:no-underline",
                colorClass,
              )}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-base leading-relaxed">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Acordeão
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full border border-zinc-700 bg-zinc-900"
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
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

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
          >
            <div className="flex gap-2 items-start">
              <div className="mt-2 text-zinc-600 cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={item.title}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "title", e.target.value)
                  }
                  placeholder={`Título do item ${index + 1}`}
                  className={cn(
                    "bg-transparent border-transparent hover:bg-zinc-900 focus:bg-zinc-900 transition-colors font-medium h-8 p-1",
                    colorClass,
                  )}
                />
                <Textarea
                  value={item.content}
                  onChange={(e) =>
                    handleUpdateItem(item.id, "content", e.target.value)
                  }
                  placeholder="Conteúdo..."
                  className="bg-zinc-900 border-zinc-800 text-sm min-h-[60px] resize-y"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                disabled={items.length <= 1}
                className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddItem}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Item
        </Button>
      </div>
    </div>
  );
}
