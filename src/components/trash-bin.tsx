import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

export function TrashBin() {
  const { setNodeRef, isOver } = useDroppable({
    id: "trash",
  });

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-12 right-12 z-50 flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-200 ${
        isOver
          ? "border-red-600 bg-zinc-900 text-red-400"
          : "border-indigo-600 bg-zinc-900 text-zinc-400"
      }`}
    >
      <Trash2 className="h-8 w-8" />
    </div>
  );
}
