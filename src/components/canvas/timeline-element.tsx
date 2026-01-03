"use client";

import type { CanvasElement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ELEMENT_COLORS } from "@/colors";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
}

export function TimelineElement({
  element,
  onUpdate,
  mode = "edit",
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
  mode?: "edit" | "view";
}) {
  const events: TimelineEvent[] = element.props?.events || [
    {
      id: "1",
      date: "2024",
      title: "Evento 1",
      description: "Descrição do evento 1",
    },
  ];
  const colorValue = element.props?.color || "#6366f1"; // Default Indigo
  const activeColor = ELEMENT_COLORS.find((c) => c.value === colorValue);

  // Styles based on color
  const colorBg = activeColor?.tailwind || "bg-indigo-500";
  const colorText = activeColor?.text || "text-indigo-400";

  const handleAddEvent = () => {
    const newEvent = {
      id: Math.random().toString(36).substring(7),
      date: "Nova Data",
      title: "Novo Evento",
      description: "",
    };
    onUpdate?.(element.id, {
      props: { ...element.props, events: [...events, newEvent] },
    });
  };

  const handleRemoveEvent = (id: string) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        events: events.filter((e) => e.id !== id),
      },
    });
  };

  const handleUpdateEvent = (
    id: string,
    field: keyof TimelineEvent,
    value: string,
  ) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        events: events.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
      },
    });
  };

  if (mode === "view") {
    if (!events || events.length === 0) return null;
    return (
      <div className="w-full pl-6 py-4">
        <div className="relative border-l border-zinc-800 space-y-12">
          {events.map((event) => (
            <div key={event.id} className="relative pl-8">
              {/* Dot on line */}
              <div
                className={cn(
                  "absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-zinc-950",
                  colorBg,
                )}
              />

              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    colorText,
                  )}
                >
                  {event.date}
                </span>
                <h4 className="text-zinc-100 font-semibold text-lg">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-zinc-400 leading-relaxed text-base pt-1">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Timeline
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
        {events.map((event, index) => (
          <div
            key={event.id}
            className="group relative bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50 hover:border-zinc-700 transition-colors"
          >
            <div className="flex gap-2 items-start">
              <div className="mt-2 text-zinc-600 cursor-grab">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex gap-2 items-center">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <Input
                    value={event.date}
                    onChange={(e) =>
                      handleUpdateEvent(event.id, "date", e.target.value)
                    }
                    placeholder="Data / Ano"
                    className="bg-transparent border-transparent hover:bg-zinc-900 focus:bg-zinc-900 transition-colors h-8 p-1 text-sm font-medium text-zinc-400 w-32"
                  />
                </div>
                <Input
                  value={event.title}
                  onChange={(e) =>
                    handleUpdateEvent(event.id, "title", e.target.value)
                  }
                  placeholder={`Título do evento ${index + 1}`}
                  className={cn(
                    "bg-transparent border-transparent hover:bg-zinc-900 focus:bg-zinc-900 transition-colors h-8 p-1 font-semibold text-base",
                    colorText,
                  )}
                />
                <Textarea
                  value={event.description}
                  onChange={(e) =>
                    handleUpdateEvent(event.id, "description", e.target.value)
                  }
                  placeholder="Descrição do evento..."
                  className="bg-zinc-900 border-zinc-800 text-sm min-h-[60px] resize-y"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveEvent(event.id)}
                disabled={events.length <= 1}
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
          onClick={handleAddEvent}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Evento
        </Button>
      </div>
    </div>
  );
}
