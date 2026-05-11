import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { type ReactNode, useState } from "react";

import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode, NodeType } from "../types";

function findNode(tree: BuilderNode, id: string): BuilderNode | null {
  if (tree.id === id) return tree;
  for (const child of tree.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function findParentId(nodeId: string, node: BuilderNode): string | null {
  for (const child of node.children) {
    if (child.id === nodeId) return node.id;
    const found = findParentId(nodeId, child);
    if (found) return found;
  }
  return null;
}

type ActiveDrag =
  | { source: "palette"; label: string }
  | { source: "canvas"; nodeId: string };

export function BuilderDndContext({ children }: { children: ReactNode }) {
  const tree = useBuilderStore((s) => s.tree);
  const addNode = useBuilderStore((s) => s.addNode);
  const reorderNodes = useBuilderStore((s) => s.reorderNodes);
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.source === "palette") {
      setActiveDrag({ source: "palette", label: data.label as string });
    } else if (data?.source === "canvas") {
      setActiveDrag({ source: "canvas", nodeId: data.nodeId as string });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
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

  const activeNode =
    activeDrag?.source === "canvas" ? findNode(tree, activeDrag.nodeId) : null;

  const overlayLabel =
    activeDrag?.source === "palette"
      ? activeDrag.label
      : activeNode?.type === "text"
      ? (activeNode.props.text as string) ?? "Text"
      : activeNode?.type === "button"
      ? (activeNode.props.label as string) ?? "Button"
      : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay dropAnimation={null}>
        {overlayLabel && (
          <div className="px-3 py-2 rounded-md text-sm bg-white border border-blue-400 shadow-lg opacity-90 cursor-grabbing whitespace-nowrap">
            {overlayLabel}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
