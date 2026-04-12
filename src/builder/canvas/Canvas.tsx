import { RenderNode } from "../renderer/renderNode";
import { useBuilderStore } from "../store/useBuilderStore";

export function Canvas() {
  const tree = useBuilderStore((s) => s.tree);
  const setSelectedNode = useBuilderStore((s) => s.setSelectedNode);

  return (
    <div
      className="flex-1 min-h-screen p-6 bg-slate-100"
      onClick={() => setSelectedNode(null)}
    >
      <RenderNode node={tree} />
    </div>
  );
}
