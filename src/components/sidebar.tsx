import type { ElementCollection } from "@/manager";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { useDraggable } from "@dnd-kit/core";
import { Loader2 } from "lucide-react";

export default function Sidebar({
  elements,
  onSave,
  isLoading,
}: {
  elements: ElementCollection;
  onSave: () => void;
  isLoading?: boolean;
}) {
  return (
    <Card className="sticky top-8 w-[320] p-8 rounded-2xl bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-zinc-300/60">Componentes</CardTitle>
        <p className="text-xs text-zinc-300/40">Arraste e solte para inserir</p>
        <Separator className="my-2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {/** biome-ignore lint/suspicious/noExplicitAny: Ignore */}
        {Object.entries(elements).map(([key, value]: [string, any]) => (
          <DraggableItem key={key} id={key}>
            <Card className="p-2">
              <CardContent className="flex items-center justify-start gap-2">
                <value.icon className="text-orange-400" />
                <p className="font-bold">{value.label}</p>
              </CardContent>
            </Card>
          </DraggableItem>
        ))}
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="secondary" className="cursor-pointer">
          Editar post
        </Button>
        <Button
          variant="secondary"
          className="bg-green-800 cursor-pointer hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando
            </>
          ) : (
            "Salvar"
          )}
        </Button>
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
        <data.icon className="text-orange-400" />
        <p className="font-bold">{data.label}</p>
      </CardContent>
    </Card>
  );
};
