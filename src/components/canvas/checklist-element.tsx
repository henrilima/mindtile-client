"use client";

import { useState } from "react";
import type { CanvasElement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ELEMENT_COLORS } from "@/colors";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export function ChecklistElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const items: ChecklistItem[] = element.props?.items || [
    { id: "1", text: "Tarefa 1", checked: false },
    { id: "2", text: "Tarefa 2", checked: false },
  ];

  const [localItems, setLocalItems] = useState<ChecklistItem[]>(items);

  const colorValue = element.props?.color || "#6366f1";
  const activeColor = ELEMENT_COLORS.find((c) => c.value === colorValue);

  const getCheckedStyle = (isChecked: boolean) => {
    if (!isChecked)
      return "border-zinc-700 text-transparent hover:border-zinc-500";

    if (!activeColor) return "bg-indigo-500 border-indigo-500 text-white";

    return cn(activeColor.tailwind, activeColor.border, "text-white");
  };

  const handleAddItem = () => {
    const newItem = {
      id: Math.random().toString(36).substring(7),
      text: `Tarefa ${items.length + 1}`,
      checked: false,
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

  const handleUpdateItem = (id: string, text: string) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        items: items.map((item) => (item.id === id ? { ...item, text } : item)),
      },
    });
  };

  const toggleCheck = (id: string, isEditMode: boolean) => {
    if (isEditMode) {
      onUpdate?.(element.id, {
        props: {
          ...element.props,
          items: items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        },
      });
    } else {
      setLocalItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item,
        ),
      );
    }
  };

  if (mode === "view") {
    if (!items || items.length === 0) return null;
    return (
      <div className="w-full flex flex-col gap-2 my-4">
        {localItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => toggleCheck(item.id, false)}
            className="group flex items-start gap-3 w-full p-2 rounded-lg hover:bg-zinc-800/30 transition-colors text-left"
          >
            <div
              className={cn(
                "w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-all duration-200",
                getCheckedStyle(item.checked),
              )}
            >
              <Check
                className={cn(
                  "w-3.5 h-3.5",
                  item.checked ? "opacity-100" : "opacity-0",
                )}
                strokeWidth={3}
              />
            </div>
            <span
              className={cn(
                "text-base leading-relaxed transition-all duration-200",
                item.checked
                  ? "text-zinc-500 line-through decoration-zinc-600"
                  : "text-zinc-200",
              )}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Checklist
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
                  activeColor?.tailwind || "bg-indigo-500",
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
                  {colorValue === c.value && (
                    <Check className="w-3 h-3 text-zinc-900 font-bold" />
                  )}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="group flex items-center gap-2">
            <div className="cursor-grab text-zinc-600 hover:text-zinc-400">
              <GripVertical className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={() => toggleCheck(item.id, true)}
              className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                getCheckedStyle(item.checked),
              )}
            >
              <Check
                className={cn(
                  "w-3.5 h-3.5",
                  item.checked ? "opacity-100" : "opacity-0",
                )}
                strokeWidth={3}
              />
            </button>

            <Input
              value={item.text}
              onChange={(e) => handleUpdateItem(item.id, e.target.value)}
              placeholder={`Tarefa ${index + 1}`}
              className={cn(
                "bg-zinc-950 border-zinc-800 focus:ring-indigo-500/20 flex-1",
                item.checked && "text-zinc-500 line-through",
              )}
            />
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
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddItem}
          className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Tarefa
        </Button>
      </div>
    </div>
  );
}
