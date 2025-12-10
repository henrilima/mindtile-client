"use client";
import { useState } from "react";
import Image from "next/image";
import type { CanvasElement } from "@/manager";
import { uploadImage } from "@/services/upload";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Maximize2,
  Monitor,
  Smartphone,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export function ImageElement({
  element,
  onUpdate,
}: {
  element: CanvasElement;
  onUpdate?: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  const [isEditing, setIsEditing] = useState(!element.content);
  const [hasError, setHasError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "link">("upload");

  const width = element.props?.width || "full";
  const url = element.content || "";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const uploadedUrl = await uploadImage(file);
        onUpdate?.(element.id, { content: uploadedUrl });
        setHasError(false);
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
        setHasError(true);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="w-full bg-zinc-900 p-4 border border-zinc-800 rounded-xl shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <ImageIcon className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-200">
            Editar Imagem
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            {url && (
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-900 border border-zinc-700">
                  <Image
                    src={url}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    Imagem atual
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{url}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                  onClick={() => onUpdate?.(element.id, { content: "" })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Origem
              </span>

              <div className="flex p-1 bg-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === "upload"
                      ? "bg-zinc-600 text-zinc-100 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("link")}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === "link"
                      ? "bg-zinc-600 text-zinc-100 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Link
                </button>
              </div>

              <div className="min-h-[60px]">
                {activeTab === "upload" ? (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="flex items-center justify-start w-full h-10 px-4 gap-2 text-sm font-medium text-zinc-300 bg-transparent border border-zinc-700 rounded-md cursor-pointer hover:bg-zinc-800 focus-within:ring-2 focus-within:ring-zinc-600 transition-colors">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {isUploading ? "Enviando..." : "Escolher arquivo"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="mt-2 text-xs text-zinc-500">
                      Formatos suportados: JPG, PNG, GIF, WEBP
                    </p>
                  </div>
                ) : (
                  <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="absolute inset-y-0 top-[-20] left-0 flex items-center pl-3 pointer-events-none">
                      <LinkIcon className="w-4 h-4 text-zinc-500" />
                    </div>
                    <Input
                      className="pl-9 bg-transparent border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                      placeholder="https://exemplo.com/imagem.jpg"
                      defaultValue={url}
                      onBlur={(e) => {
                        if (e.target.value) {
                          onUpdate?.(element.id, { content: e.target.value });
                          setHasError(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onUpdate?.(element.id, {
                            content: e.currentTarget.value,
                          });
                          setHasError(false);
                        }
                      }}
                    />
                    <p className="mt-2 text-xs text-zinc-500">
                      Cole o link direto da imagem
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Tamanho
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 border ${
                  width === "full"
                    ? "bg-zinc-700 text-zinc-100 border-zinc-600 hover:bg-zinc-600 hover:text-zinc-50"
                    : "text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
                onClick={() =>
                  onUpdate?.(element.id, {
                    props: { ...element.props, width: "full" },
                  })
                }
              >
                <Monitor className="w-4 h-4 mr-2" />
                Cheia
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 border ${
                  width === "half"
                    ? "bg-zinc-700 text-zinc-100 border-zinc-600 hover:bg-zinc-600 hover:text-zinc-50"
                    : "text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
                onClick={() =>
                  onUpdate?.(element.id, {
                    props: { ...element.props, width: "half" },
                  })
                }
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Metade
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
          {url && (
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setIsEditing(false)}
            className="ml-auto bg-white text-zinc-900 hover:bg-zinc-200"
          >
            Concluir
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group ${
        width === "half" ? "w-1/2" : "w-full"
      } transition-all duration-200`}
    >
      {hasError ? (
        <Button
          type="button"
          className="w-full h-48 bg-zinc-100 flex items-center justify-center text-red-400 border-2 border-dashed border-red-200 rounded-md cursor-pointer hover:bg-zinc-50"
          onClick={() => setIsEditing(true)}
        >
          Link quebrado
        </Button>
      ) : (
        <div className="relative">
          <Image
            src={url}
            alt="Imagem do post"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto rounded-md object-cover hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer"
            unoptimized
            onError={() => setHasError(true)}
            onClick={() => onUpdate && setIsEditing(true)}
          />

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full shadow-lg h-8 w-8 bg-white/90 hover:bg-white text-zinc-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-screen max-h-screen p-4 border-none bg-black/95">
                <div className="relative w-full h-[85vh]">
                  <Image
                    src={url}
                    alt="Fullscreen view"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
