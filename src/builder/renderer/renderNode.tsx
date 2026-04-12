import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode } from "../types";

interface Props {
  node: BuilderNode;
}

export function RenderNode({ node }: Props) {
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const setSelectedNode = useBuilderStore((s) => s.setSelectedNode);

  const isSelected = selectedNodeId === node.id;
  const selectedClass = isSelected ? "outline-2 outline-blue-500 outline-offset-2" : "";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };

  switch (node.type) {
    case "container":
      return (
        <div className={selectedClass} onClick={handleClick}>
          {node.children.map((child) => (
            <RenderNode key={child.id} node={child} />
          ))}
        </div>
      );
    case "text":
      return (
        <p className={selectedClass} onClick={handleClick}>
          {(node.props.text as string) ?? "Text"}
        </p>
      );
    case "button":
      return (
        <button className={selectedClass} onClick={handleClick}>
          {(node.props.label as string) ?? "Button"}
        </button>
      );
    default:
      return null;
  }
}
