import { useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";

import { RenderNode } from "../renderer/renderNode";
import { useBuilderStore } from "../store/useBuilderStore";

export function Canvas() {
  const tree = useBuilderStore((s) => s.tree);
  const setSelectedNode = useBuilderStore((s) => s.setSelectedNode);
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const deleteNode = useBuilderStore((s) => s.deleteNode);
  const { setNodeRef } = useDroppable({ id: "canvas-root" });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        deleteNode(selectedNodeId);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedNodeId, deleteNode]);

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-h-screen p-6 bg-slate-100 relative"
      onClick={() => setSelectedNode(null)}
    >
      <RenderNode node={tree} />
    </div>
  );
}
