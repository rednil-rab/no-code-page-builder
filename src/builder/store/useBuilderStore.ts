import { create } from "zustand";
import type { BuilderNode } from "../types";

interface BuilderState {
  tree: BuilderNode;
  selectedNodeId: string | null;

  // actions
  setSelectedNode: (id: string | null) => void;
  addNode: (parentId: string, node: BuilderNode) => void;
  updateNode: (id: string, props: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
}

const initialTree: BuilderNode = {
  id: "root",
  type: "container",
  props: {},
  children: [],
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
}));