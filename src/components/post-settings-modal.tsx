"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updatePost } from "@/actions";
import type { Post } from "@/types";
import { Categories } from "@/categories";
import { cn } from "@/lib/utils";
import { ELEMENT_COLORS } from "@/colors";

export function PostSettingsModal({
  post,
  onUpdate,
}: {
  post: Post;
  onUpdate?: (post: Post) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [progressColor, setProgressColor] = useState(
    post.props?.progress_color || "#6366f1",
  );

  const handleToggleTag = (tagKey: string) => {
    if (tags.includes(tagKey)) {
      setTags(tags.filter((t) => t !== tagKey));
    } else {
      setTags([...tags, tagKey]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await updatePost(String(post.id), {
        title,
        content,
        tags,
        props: { progress_color: progressColor },
      });

      if (success) {
        toast.success("Post atualizado com sucesso!");
        onUpdate?.({
          ...post,
          title,
          content,
          tags,
          props: { ...post.props, progress_color: progressColor },
        });
        setOpen(false);
      } else {
        toast.error("Erro ao atualizar post.");
      }
    } catch {
      toast.error("Erro ao atualizar post.");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = Object.entries(Categories)
    .sort(([, a], [, b]) => {
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;

      return a.label.localeCompare(b.label);
    })
    .map(([key, value]) => ({
      value: key,
      label: value.label,
      color: value.color,
      isDark: value.isDark,
    }));

  // Sort selected tags for display
  const sortedSelectedTags = [...tags].sort((a, b) => {
    const catA = Categories[a];
    const catB = Categories[b];
    // Priority first
    if (catA?.priority && !catB?.priority) return -1;
    if (!catA?.priority && catB?.priority) return 1;
    // Alphabetical
    return (catA?.label || a).localeCompare(catB?.label || b);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="cursor-pointer flex-1">
          Editar post
        </Button>
      </DialogTrigger>
      {/* onOpenAutoFocus={(e) => e.preventDefault()} prevents auto-focusing the first input */}
      <DialogContent
        className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Editar Detalhes do Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-700 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Descrição / Resumo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-zinc-900 border-zinc-700 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-zinc-900/50 rounded-md min-h-[40px] border border-zinc-800">
              {tags.length === 0 && (
                <span className="text-sm text-zinc-500 italic p-1">
                  Nenhuma tag selecionada
                </span>
              )}
              {sortedSelectedTags.map((tag) => {
                const category = Categories[tag];
                const hasColor = !!category?.color;
                return (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={cn(
                      "gap-1 hover:opacity-80 transition-opacity",
                      hasColor
                        ? `${category.color} text-black font-medium`
                        : "bg-stone-700 text-white",
                    )}
                  >
                    {category?.label || tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={cn(
                        "ml-1 rounded-full p-0.5 hover:bg-black/20",
                        hasColor ? "text-black/70" : "text-white/70",
                      )}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>

            {/* Custom Scrollable List for Tags */}
            <div className="h-[200px] overflow-y-auto rounded-md border border-zinc-700 bg-zinc-900 p-1">
              {categoryOptions.map((option) => {
                const isSelected = tags.includes(option.value);
                const hasColor = !!option.color;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggleTag(option.value)}
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-all mb-1 group overflow-hidden cursor-pointer",
                      // Text color logic:
                      hasColor && isSelected
                        ? "text-stone-950 font-medium"
                        : "text-zinc-300",
                      !hasColor ? "hover:bg-zinc-800 hover:text-white" : "",
                      isSelected && !hasColor && "bg-zinc-800 text-white",
                      isSelected && "ring-1 ring-inset ring-white/20",
                    )}
                  >
                    {/* Background Color Layer */}
                    {hasColor && (
                      <div
                        className={cn(
                          "absolute inset-0 transition-opacity",
                          option.color,
                          isSelected
                            ? "opacity-90"
                            : "opacity-35 group-hover:opacity-30",
                        )}
                      />
                    )}

                    {/* Content Layer */}
                    <span className="relative z-10 flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm transition-colors border-2",
                          isSelected
                            ? hasColor
                              ? "bg-black text-white border-black" // Selected + Color: Black box
                              : "bg-white text-black border-white" // Selected + Dark: White box
                            : hasColor
                              ? "border-black/50 group-hover:border-black" // Unselected + Color: Black border
                              : "border-white/50 group-hover:border-white bg-black/10", // Unselected + Dark: White border
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3" strokeWidth={3} />
                        )}
                      </div>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Progress Color Selection */}
            <div className="space-y-2 pt-2 border-t border-zinc-800 mt-4">
              <Label>Cor da Barra de Progresso</Label>
              <div className="flex gap-2 flex-wrap max-w-[280px]">
                {ELEMENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setProgressColor(color.value)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all hover:scale-110 border border-transparent",
                      color.tailwind,
                      progressColor === color.value &&
                        "ring-2 ring-white ring-offset-2 ring-offset-zinc-950",
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
