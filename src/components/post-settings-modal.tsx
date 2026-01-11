"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/services/upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Check,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
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
  const [date, setDate] = useState(
    post.date
      ? new Date(post.date).toISOString().slice(0, 16)
      : new Date().toISOString().split("T")[0] + "T00:00",
  );
  const [progressColor, setProgressColor] = useState(
    post.props?.progress_color || "#6366f1",
  );
  const [readingTime, setReadingTime] = useState(
    post.props?.reading_time || "5 min",
  );
  const [coverImage, setCoverImage] = useState(post.props?.cover_image || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadImage(file);
        setCoverImage(uploadedUrl);
        toast.success("Imagem enviada com sucesso!");
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        toast.error("Erro ao enviar imagem.");
      } finally {
        setIsUploading(false);
      }
    }
  };

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
        date,
        props: {
          progress_color: progressColor,
          cover_image: coverImage,
          reading_time: readingTime,
        },
      });

      if (success) {
        toast.success("Post atualizado com sucesso!");
        onUpdate?.({
          ...post,
          title,
          content,
          tags,
          date,
          props: {
            ...post.props,
            progress_color: progressColor,
            cover_image: coverImage,
            reading_time: readingTime,
          },
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

  const sortedSelectedTags = [...tags].sort((a, b) => {
    const catA = Categories[a];
    const catB = Categories[b];
    if (catA?.priority && !catB?.priority) return -1;
    if (!catA?.priority && catB?.priority) return 1;
    return (catA?.label || a).localeCompare(catB?.label || b);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg h-10 cursor-pointer"
        >
          Editar Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-zinc-100 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Editar Detalhes do Post
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-zinc-400">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500/20 rounded-lg h-10"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="date" className="text-zinc-400">
              Data e Hora de Publicação
            </Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500/20 rounded-lg h-10 calendar-dark"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="readingTime" className="text-zinc-400">
              Tempo de Leitura (Estimado)
            </Label>
            <Input
              id="readingTime"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              placeholder="Ex: 5 min"
              className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500/20 rounded-lg h-10"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="content" className="text-zinc-400">
              Descrição / Resumo
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500/20 rounded-lg min-h-[100px]"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-zinc-400">Capa do Post</Label>
            <div className="space-y-3 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
              {coverImage ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-zinc-800 group">
                  <Image
                    src={coverImage}
                    alt="Capa do post"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setCoverImage("")}
                      className="h-9 rounded-lg px-4 font-medium cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover Capa
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full h-32 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-3 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900/50 hover:text-zinc-300 transition-all cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="p-3 rounded-full bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">
                    Clique para fazer upload da capa
                  </span>
                </button>
              )}

              <div className="flex gap-2">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Ou cole a URL da imagem aqui..."
                  className="bg-zinc-900 border-zinc-800 h-10 text-sm rounded-lg flex-1"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-zinc-400">Tags</Label>

            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-zinc-900/30 rounded-xl min-h-[50px] border border-zinc-800/50">
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
                      "gap-1 hover:opacity-90 transition-opacity pl-2 pr-1 py-1 rounded-md text-sm font-medium border-none",
                      hasColor
                        ? `${category.color} text-black/90`
                        : "bg-zinc-700 text-zinc-100",
                    )}
                  >
                    {category?.label || tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className={cn(
                        "ml-1 rounded-full p-0.5 hover:bg-black/10 transition-colors cursor-pointer",
                        hasColor ? "text-black/60" : "text-white/60",
                      )}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                );
              })}
            </div>

            <div className="h-[220px] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 custom-scrollbar">
              {categoryOptions.map((option) => {
                const isSelected = tags.includes(option.value);
                const hasColor = !!option.color;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggleTag(option.value)}
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all mb-1 group overflow-hidden cursor-pointer border border-transparent",
                      hasColor && isSelected
                        ? "text-stone-950 font-semibold bg-white/5"
                        : "text-zinc-400 font-medium",
                      !hasColor ? "hover:bg-zinc-800 hover:text-zinc-100" : "",
                      isSelected &&
                        !hasColor &&
                        "bg-zinc-800 text-zinc-100 border-zinc-700",
                    )}
                  >
                    {hasColor && (
                      <div
                        className={cn(
                          "absolute inset-0 transition-opacity rounded-lg",
                          option.color,
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-20",
                        )}
                      />
                    )}

                    <span className="relative z-10 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded transition-all border",
                          isSelected
                            ? hasColor
                              ? "bg-black text-white border-black"
                              : "bg-indigo-500 text-white border-indigo-500"
                            : hasColor
                              ? "border-black/20 group-hover:border-black/50"
                              : "border-zinc-700 group-hover:border-zinc-500 bg-zinc-950/50",
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        )}
                      </div>
                      <span
                        className={cn(hasColor && isSelected && "text-black")}
                      >
                        {option.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-zinc-800 mt-6">
              <Label className="text-zinc-400">Cor da Barra de Progresso</Label>
              <div className="flex gap-3 flex-wrap">
                {ELEMENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setProgressColor(color.value)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all hover:scale-110 border-2 border-transparent cursor-pointer",
                      color.tailwind,
                      progressColor === color.value &&
                        "ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950 scale-110",
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-lg h-10 px-4 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg h-10 px-6 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
