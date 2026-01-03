import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { CanvasElement } from "@/types";
import { renderElement } from "@/utils";

export function SortableItem({
  element,
  onUpdate,
}: {
  element: CanvasElement;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
    marginTop: "8px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        isDragging
          ? "w-full py-2 transition-all outline-none"
          : "relative flex items-start gap-2 group hover:bg-zinc-900/40 p-2 -ml-2 rounded-lg transition-colors border border-transparent hover:border-zinc-800/50 outline-none"
      }
    >
      {isDragging ? (
        <div className="w-full h-1 bg-indigo-500 rounded relative">
          <div className="absolute -left-2 -top-1 w-3 h-3 bg-indigo-500 rounded-full shadow-sm" />
        </div>
      ) : (
        <>
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded -ml-1 shrink-0"
            aria-label="Arrastar elemento"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            {renderElement(element, onUpdate)}
          </div>
        </>
      )}
    </div>
  );
}
