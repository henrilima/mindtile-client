"use client";

import { useState } from "react";
import type { CanvasElement } from "@/types";
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

interface TabItem {
  id: string;
  title: string;
  content: string;
}

export function TabsElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const tabs: TabItem[] = element.props?.tabs || [
    { id: "1", title: "Aba 1", content: "Conteúdo da aba 1" },
    { id: "2", title: "Aba 2", content: "Conteúdo da aba 2" },
  ];

  // View mode local state
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "1");

  const colorValue = element.props?.color || "#6366f1"; // Default Indigo
  const activeColor = ELEMENT_COLORS.find((c) => c.value === colorValue);

  const colorBg = activeColor?.tailwind || "bg-indigo-500";
  const colorText = activeColor?.text || "text-indigo-400";

  const handleAddTab = () => {
    const newTab = {
      id: Math.random().toString(36).substring(7),
      title: `Aba ${tabs.length + 1}`,
      content: "",
    };
    onUpdate?.(element.id, {
      props: { ...element.props, tabs: [...tabs, newTab] },
    });
  };

  const handleRemoveTab = (id: string) => {
    const newTabs = tabs.filter((t) => t.id !== id);
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        tabs: newTabs,
      },
    });
    if (activeTabId === id && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleUpdateTab = (
    id: string,
    field: "title" | "content",
    value: string,
  ) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        tabs: tabs.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
      },
    });
  };

  if (mode === "view") {
    if (!tabs || tabs.length === 0) return null;

    // Ensure active tab exists
    const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

    return (
      <div className="w-full my-6">
        {/* Tab Headers */}
        <div className="flex flex-wrap border-b border-zinc-800">
          {tabs.map((tab) => {
            const isActive = tab.id === currentTab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px hover:text-zinc-200",
                  isActive
                    ? cn(
                        "text-zinc-100",
                        activeColor?.border
                          ? `border-${activeColor.value}`
                          : "border-indigo-500",
                      ) // This assumes standard styling, better to use direct style or specific class map
                    : "text-zinc-400 border-transparent hover:border-zinc-700",
                )}
                style={isActive ? { borderColor: colorValue } : {}}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="py-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-zinc-300 leading-relaxed min-h-[100px] whitespace-pre-wrap">
            {currentTab.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Abas de Conteúdo
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full border border-zinc-700 bg-zinc-900"
            >
              <div className={cn("w-3 h-3 rounded-full", colorBg)} />
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

      <div className="space-y-4">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className="group relative bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
          >
            <div className="flex gap-2 items-start">
              <div className="mt-2 text-zinc-600 cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={tab.title}
                  onChange={(e) =>
                    handleUpdateTab(tab.id, "title", e.target.value)
                  }
                  placeholder={`Título da Aba ${index + 1}`}
                  className={cn(
                    "bg-transparent border-transparent hover:bg-zinc-900 focus:bg-zinc-900 transition-colors font-medium h-8 p-1",
                    colorText,
                  )}
                />
                <Textarea
                  value={tab.content}
                  onChange={(e) =>
                    handleUpdateTab(tab.id, "content", e.target.value)
                  }
                  placeholder="Conteúdo da aba..."
                  className="bg-zinc-900 border-zinc-800 text-sm min-h-[80px] resize-y"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTab(tab.id)}
                disabled={tabs.length <= 1}
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
          onClick={handleAddTab}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Aba
        </Button>
      </div>
    </div>
  );
}
