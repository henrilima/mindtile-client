import type { ElementCollection, Post } from "@/types";
import { PostSettingsModal } from "./post-settings-modal";
import { Button } from "./ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { useDraggable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";

export default function Sidebar({
  elements,
  onSave,
  isLoading,
  post,
}: {
  elements: ElementCollection;
  onSave: () => void;
  isLoading?: boolean;
  post: Post;
}) {
  const groups = {
    Conteúdo: ["title", "subtitle", "text", "blockquote", "code", "callout"],
    Mídia: ["image", "embed"],
    Interativo: [
      "poll",
      "button",
      "accordion",
      "checklist",
      "timeline",
      "tabs",
      "voting",
    ],
    Estrutura: ["separator", "spacer"],
  };

  return (
    <Card className="sticky top-8 w-[320px] rounded-2xl bg-zinc-950 flex flex-col max-h-[calc(100vh-4rem)] shadow-xl border-zinc-800">
      <CardHeader className="pb-4 shrink-0">
        <CardTitle className="text-zinc-300">Componentes</CardTitle>
        <p className="text-xs text-zinc-500">
          Arraste e solte para personalizar
        </p>
        <Separator className="mt-2 bg-zinc-800" />
      </CardHeader>

      <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {Object.entries(groups).map(([groupName, keys]) => (
            <div key={groupName} className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">
                {groupName}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {keys.map((key) => {
                  const element = elements[key];
                  if (!element) return null;
                  return (
                    <DraggableItem key={key} id={key}>
                      <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all cursor-grab group">
                        <element.icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 text-center">
                          {element.label}
                        </span>
                      </div>
                    </DraggableItem>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardFooter className="pt-4 pb-6 shrink-0 bg-zinc-950 rounded-b-2xl border-t border-zinc-900">
        <div className="flex w-full gap-2 flex-col">
          <PostSettingsModal post={post} />
          <Button
            variant="default"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function DraggableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab ${isDragging ? "opacity-50" : ""}`}
    >
      {children}
    </div>
  );
}

Sidebar.Preview = function Preview({
  id,
  elements,
}: {
  id: string;
  elements: ElementCollection;
}) {
  const data = elements[id];
  if (!data) return null;

  return (
    <Card className="p-2">
      <CardContent className="flex items-center justify-start gap-2">
        <data.icon className="text-pink-400" />
        <p className="font-bold">{data.label}</p>
      </CardContent>
    </Card>
  );
};
