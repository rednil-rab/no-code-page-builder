import React, { useState } from "react";

import { cn } from "../../lib/cn";
import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode } from "../types";

interface Props {
  node: BuilderNode;
}

const TextNode: React.FC<{ node: BuilderNode; selectedClass: string; onClick: (e: React.MouseEvent) => void }> = ({
  node,
  selectedClass,
  onClick,
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState((node.props.text as string) ?? "Text");
  const updateNode = useBuilderStore((s) => s.updateNode);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    updateNode(node.id, { text });
  };
  
  if (editing) {
    return (
      <input
        className={selectedClass}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }
  return (
    <p className={selectedClass} onClick={onClick} onDoubleClick={handleDoubleClick}>
      {(node.props.text as string) ?? "Text"}
    </p>
  );
};

export function RenderNode({ node }: Props) {
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const setSelectedNode = useBuilderStore((s) => s.setSelectedNode);

  const isSelected = selectedNodeId === node.id;
  const selectedClass = cn(isSelected && "outline-2 outline-blue-500 outline-offset-2");

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
        <TextNode node={node} selectedClass={selectedClass} onClick={handleClick} />
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
