"use client";

import { Plus, Trash2, GripVertical, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import type { CanvasElement } from "@/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  votes?: number;
}

export function PollElement({
  element,
  mode = "edit",
  onUpdate,
}: {
  element: CanvasElement;
  mode?: "edit" | "view";
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = element.content || "";
  const options: PollOption[] = element.props?.options || [
    { id: "1", text: "Opção 1" },
    { id: "2", text: "Opção 2" },
  ];

  const correctOptionId = element.props?.correctOptionId;

  const handleAddOption = () => {
    const newOption = {
      id: Math.random().toString(36).substring(7),
      text: `Opção ${options.length + 1}`,
    };
    onUpdate?.(element.id, {
      props: { ...element.props, options: [...options, newOption] },
    });
  };

  const handleRemoveOption = (id: string) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        options: options.filter((opt) => opt.id !== id),
        correctOptionId: correctOptionId === id ? undefined : correctOptionId,
      },
    });
  };

  const handleUpdateOption = (id: string, text: string) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        options: options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
      },
    });
  };

  const handleSetCorrectOption = (id: string) => {
    onUpdate?.(element.id, {
      props: {
        ...element.props,
        correctOptionId: id === correctOptionId ? undefined : id,
      },
    });
  };

  if (mode === "view") {
    return (
      <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-semibold text-zinc-100 text-center">
          {question}
        </h3>
        <div className="space-y-3">
          {options.map((option) => {
            if (selectedOption) {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === correctOptionId;

              let styles = "";
              let icon = null;

              if (isCorrect) {
                styles =
                  "bg-emerald-500/10 border-emerald-500/50 text-emerald-200";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
              } else if (isSelected) {
                styles =
                  "bg-yellow-500/10 border-yellow-500/50 text-yellow-200";
              } else {
                styles = "bg-red-500/10 border-red-500/50 text-red-200";
              }

              return (
                <div
                  key={option.id}
                  className={cn(
                    "w-full p-4 rounded-lg flex items-center justify-between border transition-all duration-200",
                    styles,
                  )}
                >
                  <span className="font-medium">{option.text}</span>
                  {icon}
                </div>
              );
            }

            return (
              <button
                type="button"
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={cn(
                  "w-full p-4 rounded-lg flex items-center justify-between transition-all duration-200 group cursor-pointer",
                  "bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-200",
                )}
              >
                <span className="font-medium">{option.text}</span>
                <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-500" />
              </button>
            );
          })}
        </div>
        {selectedOption && element.props?.explanation && (
          <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-800 text-sm text-zinc-400">
            <p className="font-medium text-zinc-300 mb-1">Explicação:</p>
            {element.props.explanation}
          </div>
        )}
        {selectedOption && (
          <div className="flex justify-center pt-2 border-t border-zinc-800/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOption(null)}
              className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-2">
        <label
          htmlFor={`poll-question-${element.id}`}
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
        >
          Pergunta
        </label>
        <Input
          id={`poll-question-${element.id}`}
          value={question}
          onChange={(e) => onUpdate?.(element.id, { content: e.target.value })}
          placeholder="Qual é a sua pergunta?"
          className="bg-zinc-950 border-zinc-800 focus:ring-indigo-500/20 text-lg font-medium"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
            Opções (Selecione a correta)
          </span>
        </div>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2 group">
              <div className="cursor-grab text-zinc-600 hover:text-zinc-400">
                <GripVertical className="w-4 h-4" />
              </div>
              <button
                type="button"
                onClick={() => handleSetCorrectOption(option.id)}
                className={cn(
                  "p-1 rounded-full transition-colors",
                  correctOptionId === option.id
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-zinc-600 hover:text-zinc-400",
                )}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <Input
                value={option.text}
                onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className={cn(
                  "bg-zinc-950 border-zinc-800 focus:ring-indigo-500/20",
                  correctOptionId === option.id &&
                    "border-emerald-500/50 text-emerald-100 placeholder:text-emerald-500/30",
                )}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(option.id)}
                disabled={options.length <= 2}
                className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddOption}
          className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar opção
        </Button>
      </div>
      <div className="space-y-2">
        <label
          htmlFor={`poll-explanation-${element.id}`}
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
        >
          Explicação da resposta (Opcional)
        </label>
        <Input
          id={`poll-explanation-${element.id}`}
          value={element.props?.explanation || ""}
          onChange={(e) =>
            onUpdate?.(element.id, {
              props: { ...element.props, explanation: e.target.value },
            })
          }
          placeholder="Explique porque a resposta está correta..."
          className="bg-zinc-950 border-zinc-800 focus:ring-indigo-500/20"
        />
      </div>
    </div>
  );
}
