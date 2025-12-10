import { Separator } from "./ui/separator";
import CanvasHeader from "./canvas/canvas-header";
import type { CanvasElement, Post } from "@/manager";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./canvas/sortable-items";

export default function Canvas({
  post,
  elements,
  onUpdate,
}: {
  post: Post;
  elements: CanvasElement[];
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  const { setNodeRef } = useDroppable({ id: "canvas" });

  return (
    <Card className="w-[900] bg-transparent px-4 py-8 rounded-2xl border-4">
      <CardHeader>
        <CardTitle className="text-zinc-300/70">Pré-visualização:</CardTitle>
        <p className="text-xs text-zinc-300/40">
          É assim que vai aparecer para o usuário
        </p>
        <Separator className="my-2" />
      </CardHeader>
      <CardContent>
        <div className="w-full" ref={setNodeRef}>
          <CanvasHeader post={post}></CanvasHeader>
          {elements.length === 0 ? (
            <div>
              <p>Arraste componentes aqui.</p>
            </div>
          ) : (
            <SortableContext
              items={elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              {elements.map((el) => (
                <SortableItem key={el.id} element={el} onUpdate={onUpdate} />
              ))}
            </SortableContext>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
