import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { type ReactNode, useState } from "react";
import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode, NodeType } from "../types";

function findParentId(nodeId: string, node: BuilderNode): string | null {
  for (const child of node.children) {
    if (child.id === nodeId) return node.id;
    const found = findParentId(nodeId, child);
    if (found) return found;
  }
  return null;
}

export function BuilderDndContext({ children }: { children: ReactNode }) {
  const tree = useBuilderStore((s) => s.tree);
  const addNode = useBuilderStore((s) => s.addNode);
  const reorderNodes = useBuilderStore((s) => s.reorderNodes);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.source === "palette") setActiveLabel(data.label as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLabel(null);
    if (!over) return;

    const data = active.data.current as {
      source: "palette" | "canvas";
      label?: string;
      nodeType?: NodeType;
      defaultProps?: Record<string, string | number | boolean>;
      nodeId?: string;
    };

    if (data.source === "palette" && data.nodeType) {
      addNode("root", {
        id: crypto.randomUUID(),
        type: data.nodeType,
        props: data.defaultProps ?? {},
        children: [],
        indexMap: {},
      });
    } else if (data.source === "canvas" && data.nodeId) {
      const overId = over.id as string;
      if (data.nodeId === overId) return;
      const parentId = findParentId(data.nodeId, tree);
      if (parentId) reorderNodes(parentId, data.nodeId, overId);
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay>
        {activeLabel && (
          <div className="px-3 py-2 rounded-md text-sm bg-white border border-blue-400 shadow-lg opacity-80 cursor-grabbing">
            {activeLabel}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
