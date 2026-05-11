import { create } from "zustand";

import type { BuilderNode } from "../types";

interface BuilderState {
  tree: BuilderNode;
  selectedNodeId: string | null;

  // actions
  setSelectedNode: (id: string | null) => void;
  addNode: (parentId: string, node: BuilderNode) => void;
  updateNode: (id: string, props: Record<string, string | number | boolean>) => void;
  deleteNode: (id: string) => void;
  reorderNodes: (parentId: string, activeId: string, overId: string) => void;
}

const initialTree: BuilderNode = {
  id: "root",
  type: "container",
  props: {},
  children: [],
  indexMap: {},
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  tree: initialTree,
  selectedNodeId: null,

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addNode: (parentId, newNode) => {
    const addRecursive = (node: BuilderNode): BuilderNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
          indexMap: { ...node.indexMap, [newNode.id]: node.children.length },
        };
      }
      return {
        ...node,
        children: node.children.map(addRecursive),
      };
    };

    set({
      tree: addRecursive(get().tree),
    });
  },

  updateNode: (id, newProps) => {
    const updateRecursive = (node: BuilderNode): BuilderNode => {
      if (node.id === id) {
        return {
          ...node,
          props: { ...node.props, ...newProps },
        };
      }
      return {
        ...node,
        children: node.children.map(updateRecursive),
      };
    };

    set({
      tree: updateRecursive(get().tree),
    });
  },

  deleteNode: (id) => {
    const deleteRecursive = (node: BuilderNode): BuilderNode => {
      return {
        ...node,
        children: node.children
          .filter((child) => child.id !== id)
          .map(deleteRecursive),
      };
    };

    set({
      tree: deleteRecursive(get().tree),
      selectedNodeId: null,
    });
  },

  reorderNodes: (parentId, activeId, overId) => {
    const reorder = (node: BuilderNode): BuilderNode => {
      if (node.id === parentId) {
        const children = [...node.children];
        const fromIndex = children.findIndex((c) => c.id === activeId);
        const toIndex = children.findIndex((c) => c.id === overId);
        if (fromIndex === -1 || toIndex === -1) return node;
        const [moved] = children.splice(fromIndex, 1);
        children.splice(toIndex, 0, moved);
        return { ...node, children };
      }
      return { ...node, children: node.children.map(reorder) };
    };
    set({ tree: reorder(get().tree) });
  },
}));