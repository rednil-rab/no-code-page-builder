export type NodeType = "container" | "text" | "button";

export interface BuilderNode {
  id: string;
  type: NodeType;
  props: Record<string, string | number | boolean>;
  children: BuilderNode[];
}