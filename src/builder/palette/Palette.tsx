import { useDraggable } from "@dnd-kit/core";

import { cn } from "../../lib/cn";
import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode, NodeType } from "../types";

const NODE_TYPES: {
  type: NodeType;
  label: string;
  defaultProps: Record<string, string | number | boolean>;
}[] = [
  { type: "text", label: "Text", defaultProps: { text: "Text block", span: "col-span-2", padding: "p-2", height: "h-10" } },
  { type: "button", label: "Button", defaultProps: { label: "Click me", bg: "bg-blue", span: "col-span-1", padding: "p-2", height: "h-10" } },
];

function findNode(tree: BuilderNode, id: string): BuilderNode | null {
  if (tree.id === id) return tree;
  for (const child of tree.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

interface PaletteItemProps {
  type: NodeType;
  label: string;
  defaultProps: Record<string, string | number | boolean>;
  onAdd: () => void;
}

function PaletteItem({ type, label, defaultProps, onAdd }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { source: "palette", nodeType: type, label, defaultProps },
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "text-left px-3 py-2 rounded-md text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-grab",
        isDragging && "opacity-40"
      )}
      onClick={onAdd}
    >
      {label}
    </button>
  );
}

export function Palette() {
  const tree = useBuilderStore((s) => s.tree);
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const addNode = useBuilderStore((s) => s.addNode);

  const handleAdd = (type: NodeType, defaultProps: Record<string, string | number | boolean>) => {
    let parentId = "root";
    if (selectedNodeId) {
      const selected = findNode(tree, selectedNodeId);
      if (selected?.type === "container") parentId = selectedNodeId;
    }
    addNode(parentId, {
      id: crypto.randomUUID(),
      type,
      props: defaultProps,
      children: [],
      indexMap: {},
    });
  };

  return (
    <aside className="w-48 shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Components
      </h2>
      {NODE_TYPES.map(({ type, label, defaultProps }) => (
        <PaletteItem
          key={type}
          type={type}
          label={label}
          defaultProps={defaultProps}
          onAdd={() => handleAdd(type, defaultProps)}
        />
      ))}
    </aside>
  );
}
