"use client";

import { Plus, Trash2, GripVertical, Percent } from "lucide-react";
import type { CanvasElement } from "@/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { voteOnBlock } from "@/actions";
import { useParams } from "next/navigation";

interface VotingOption {
  id: string;
  text: string;
}

interface VotingProps {
  question?: string;
  options?: VotingOption[];
  votes?: Record<string, number>;
}

export function VotingElement({
  element,
  mode = "edit",
  onUpdate,
}: {
  element: CanvasElement;
  mode?: "edit" | "view";
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  const params = useParams();
  const postId = params.id as string;

  const props = (element.props as VotingProps) || {};
  const question = element.content || "";
  const options = props.options || [
    { id: "1", text: "Sim" },
    { id: "2", text: "Não" },
  ];
  const votes = props.votes || {};
  const [localVotes, setLocalVotes] = useState(votes);

  useEffect(() => {
    setLocalVotes(votes);
  }, [votes]);

  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && mode === "view" && postId) {
      const voted = localStorage.getItem(`voting:${postId}:${element.id}`);
      if (voted) {
        setHasVoted(true);
      }
    }
  }, [element.id, mode, postId]);

  const totalVotes = Object.values(localVotes).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  const handleAddOption = () => {
    const newOption = {
      id: Math.random().toString(36).substring(7),
      text: `Opção ${options.length + 1}`,
    };
    onUpdate?.(element.id, {
      props: { ...props, options: [...options, newOption] },
    });
  };

  const handleRemoveOption = (id: string) => {
    const newVotes = { ...votes };
    delete newVotes[id];

    onUpdate?.(element.id, {
      props: {
        ...props,
        options: options.filter((opt) => opt.id !== id),
        votes: newVotes,
      },
    });
  };

  const handleUpdateOption = (id: string, text: string) => {
    onUpdate?.(element.id, {
      props: {
        ...props,
        options: options.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
      },
    });
  };

  const handleVote = async (optionId: string) => {
    if (hasVoted && mode === "view") return;

    const currentCount = localVotes[optionId] || 0;
    const newVotes = { ...localVotes, [optionId]: currentCount + 1 };

    setLocalVotes(newVotes);

    if (onUpdate) {
      onUpdate(element.id, {
        props: { ...props, votes: newVotes },
      });
    } else if (mode === "view" && postId) {
      setHasVoted(true);
      localStorage.setItem(`voting:${postId}:${element.id}`, "true");

      await voteOnBlock(postId, element.id, optionId);
    }
  };

  if (mode === "view") {
    return (
      <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
        <h3 className="text-xl font-semibold text-zinc-100 text-center mb-6">
          {question}
        </h3>
        <div className="space-y-4">
          {options.map((option) => {
            const count = localVotes[option.id] || 0;
            const percentage =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm text-zinc-400 mb-1">
                  <span className="font-medium text-zinc-200">
                    {option.text}
                  </span>
                  <span>{percentage}%</span>
                </div>
                <button
                  type="button"
                  disabled={hasVoted}
                  className={cn(
                    "relative w-full h-10 bg-zinc-800 rounded-lg overflow-hidden group text-left block border-none p-0 m-0",
                    hasVoted ? "cursor-default opacity-80" : "cursor-pointer",
                  )}
                  onClick={() => handleVote(option.id)}
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 bg-indigo-500/20 transition-all duration-500 ease-out",
                      !hasVoted && "group-hover:bg-indigo-500/30",
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 border-r-2 border-indigo-500/50 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="absolute inset-0 flex items-center px-4">
                    <span className="text-xs text-zinc-500 font-mono"></span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        <div className="text-center text-xs text-zinc-500 mt-4">
          {totalVotes} votos registrados
          {hasVoted && (
            <span className="block text-indigo-400 mt-1">
              Obrigado por votar!
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-2">
        <label
          htmlFor={`voting-question-${element.id}`}
          className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
        >
          Pergunta da Votação
        </label>
        <Input
          id={`voting-question-${element.id}`}
          value={question}
          onChange={(e) => onUpdate?.(element.id, { content: e.target.value })}
          placeholder="O que as pessoas devem votar?"
          className="bg-zinc-950 border-zinc-800 focus:ring-indigo-500/20 text-lg font-medium"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
            Opções de Resposta
          </span>
        </div>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2 group">
              <div className="cursor-grab text-zinc-600 hover:text-zinc-400">
                <GripVertical className="w-4 h-4" />
              </div>
              <Input
                value={option.text}
                onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                placeholder={`Opção ${index + 1}`}
                className="bg-zinc-950 border-zinc-800 focus:ring-indigo-500/20"
              />
              <Button
                type="button"
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
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddOption}
          className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar opção
        </Button>
      </div>

      <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50 text-sm text-zinc-500 text-center italic">
        <Percent className="w-4 h-4 inline mr-2 text-zinc-600" />
        As porcentagens serão calculadas automaticamente baseadas nas respostas.
      </div>
    </div>
  );
}
