"use client";
import { useState } from "react";
import { toast } from "sonner";

import type { CanvasElement, ElementType, Post } from "@/types";
import { saveBlocks } from "@/actions";
import Canvas from "./canvas";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { elementsList, renderElement } from "@/utils";
import { TrashBin } from "./trash-bin";
import Sidebar from "./sidebar";
import { Loader2 } from "lucide-react";

export default function Builder({ post }: { post: Post }) {
  const dndContextId = "mindtile-builder";
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>(
    post.blocks
      ? post.blocks
          .sort((a, b) => a.position - b.position)
          .map((block) => ({
            id: block.id
              ? String(block.id)
              : `${block.type}_${Math.random().toString(36).substring(2, 9)}`,
            type: block.type,
            content: block.content,
            props: block.props,
          }))
      : [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleUpdateElement(id: string, updates: Partial<CanvasElement>) {
    setCanvasElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    );
  }

  async function handleSave() {
    setIsSaving(true);
    const blocks = canvasElements.map((el, index) => ({
      position: index + 1,
      type: el.type,
      content: el.content || "",
      props: el.props,
    }));

    try {
      const success = await saveBlocks(post.id, blocks);
      if (success) {
        toast.success("Salvo com sucesso!");
      } else {
        toast.error("Erro ao salvar.");
      }
    } catch {
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active?.id ? String(event.active.id) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIdVal = String(active.id);
    const overIdVal = String(over.id);

    if (overIdVal === "trash") {
      if (!(activeIdVal in elementsList)) {
        setCanvasElements((items) =>
          items.filter((item) => item.id !== activeIdVal),
        );
      }
      setActiveId(null);
      return;
    }

    if (activeIdVal in elementsList) {
      const type = activeIdVal as ElementType;
      const newElement: CanvasElement = {
        id: `${type}_${Date.now()}`,
        type,
        props: {},
      };

      setCanvasElements((prev) => {
        if (overIdVal === "canvas") {
          return [...prev, newElement];
        }

        const index = prev.findIndex((el) => el.id === overIdVal);
        if (index !== -1) {
          const newArr = [...prev];
          newArr.splice(index + 1, 0, newElement);
          return newArr;
        }

        return [...prev, newElement];
      });
    } else {
      if (activeIdVal !== overIdVal) {
        setCanvasElements((items) => {
          const oldIndex = items.findIndex((item) => item.id === activeIdVal);
          const newIndex = items.findIndex((item) => item.id === overIdVal);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }

    setActiveId(null);
  }

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {activeId ? (
        <style>{`
          body {
            cursor: grabbing !important;
          }
           body * {
            cursor: grabbing !important;
          }
        `}</style>
      ) : null}
      <div className="relative w-full min-h-screen p-8 flex items-start justify-center gap-8">
        <Sidebar
          elements={elementsList}
          onSave={handleSave}
          isLoading={isSaving}
          post={post}
        />
        <Canvas
          post={post}
          elements={canvasElements}
          onUpdate={handleUpdateElement}
        />
        <TrashBin />

        {isSaving && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg shadow-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span className="font-medium text-zinc-200">Salvando...</span>
            </div>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeId ? (
          elementsList[activeId] ? (
            <Sidebar.Preview id={activeId} elements={elementsList} />
          ) : (
            (() => {
              const el = canvasElements.find((e) => e.id === activeId);
              return el ? <div>{renderElement(el)}</div> : null;
            })()
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
