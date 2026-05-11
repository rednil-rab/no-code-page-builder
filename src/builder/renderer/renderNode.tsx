import { rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
    <p className={cn(selectedClass, "user-select-none")} onClick={onClick} onDoubleClick={handleDoubleClick}>
      {(node.props.text as string) ?? "Text"}
    </p>
  );
};

export function RenderNode({ node }: Props) {
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const setSelectedNode = useBuilderStore((s) => s.setSelectedNode);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: node.id,
    data: { source: "canvas", nodeId: node.id },
    disabled: node.type === "container",
  });

  const sortableStyle: React.CSSProperties = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    height: "fit-content",
  };

  const isSelected = selectedNodeId === node.id;
  const selectedClass = cn(isSelected && "border border-blue-500", "rounded-md p-1 shadow-sm");

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };

  const { span, padding, height, bg } = node.props;

  switch (node.type) {
    case "container":
      return (
        <div className={cn(selectedClass, "grid grid-cols-3 gap-4 row-end row-start min-h-screen")} onClick={handleClick}>
          <SortableContext items={node.children.map((c) => c.id)} strategy={rectSortingStrategy}>
            {node.children.map((child) => (
              <RenderNode key={child.id} node={child} />
            ))}
          </SortableContext>
        </div>
      );
    case "text":
      return (
        <div ref={setNodeRef} style={sortableStyle} {...attributes} {...listeners} className={cn(span as string)}>
          <TextNode node={node} selectedClass={cn(selectedClass, padding, height, bg)} onClick={handleClick} />
        </div>
      );
    case "button":
      return (
        <button
          ref={setNodeRef}
          style={sortableStyle}
          {...attributes}
          {...listeners}
          className={cn(selectedClass, span, padding, height, bg)}
          onClick={handleClick}
        >
          {(node.props.label as string) ?? "Button"}
        </button>
      );
    default:
      return null;
  }
}
