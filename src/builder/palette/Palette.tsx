import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode, NodeType } from "../types";

const NODE_TYPES: {
  type: NodeType;
  label: string;
  defaultProps: Record<string, unknown>;
}[] = [
  { type: "container", label: "Container", defaultProps: {} },
  { type: "text", label: "Text", defaultProps: { text: "Text block" } },
  { type: "button", label: "Button", defaultProps: { label: "Click me" } },
];

function findNode(tree: BuilderNode, id: string): BuilderNode | null {
  if (tree.id === id) return tree;
  for (const child of tree.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function Palette() {
  const tree = useBuilderStore((s) => s.tree);
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const addNode = useBuilderStore((s) => s.addNode);

  const handleAdd = (type: NodeType, defaultProps: Record<string, unknown>) => {
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
    });
  };

  return (
    <aside className="w-48 shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Components
      </h2>
      {NODE_TYPES.map(({ type, label, defaultProps }) => (
        <button
          key={type}
          className="text-left px-3 py-2 rounded-md text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer"
          onClick={() => handleAdd(type, defaultProps)}
        >
          {label}
        </button>
      ))}
    </aside>
  );
}
