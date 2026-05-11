import { type ReactNode } from "react";

import { useBuilderStore } from "../store/useBuilderStore";
import type { BuilderNode } from "../types";

function findNode(tree: BuilderNode, id: string): BuilderNode | null {
  if (tree.id === id) return tree;
  for (const child of tree.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function PropertiesPanel() {
  const tree = useBuilderStore((s) => s.tree);
  const selectedNodeId = useBuilderStore((s) => s.selectedNodeId);
  const updateNode = useBuilderStore((s) => s.updateNode);

  if (!selectedNodeId) {
    return (
      <aside className="w-56 shrink-0 border-l border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-400">Select a component to edit its properties.</p>
      </aside>
    );
  }

  const node = findNode(tree, selectedNodeId);
  if (!node) return null;

  const update = (key: string, value: string) => updateNode(node.id, { [key]: value });

  return (
    <aside className="w-56 shrink-0 border-l border-slate-200 bg-white p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{node.type}</h2>

      {node.type === "text" && (
        <Field label="Content">
          <input
            className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
            value={(node.props.text as string) ?? ""}
            onChange={(e) => update("text", e.target.value)}
          />
        </Field>
      )}

      {node.type === "button" && (
        <Field label="Label">
          <input
            className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
            value={(node.props.label as string) ?? ""}
            onChange={(e) => update("label", e.target.value)}
          />
        </Field>
      )}

      {node.type !== "container" && (
        <>
          <Field label="Column span">
            <Select
              value={(node.props.span as string) ?? "col-span-1"}
              onChange={(v) => update("span", v)}
              options={[
                { label: "1 / 3", value: "col-span-1" },
                { label: "2 / 3", value: "col-span-2" },
                { label: "Full", value: "col-span-3" },
              ]}
            />
          </Field>

          <Field label="Padding">
            <Select
              value={(node.props.padding as string) ?? "p-2"}
              onChange={(v) => update("padding", v)}
              options={["p-1", "p-2", "p-4", "p-6", "p-8"].map((v) => ({ label: v, value: v }))}
            />
          </Field>

          <Field label="Height">
            <Select
              value={(node.props.height as string) ?? "h-10"}
              onChange={(v) => update("height", v)}
              options={["h-8", "h-10", "h-16", "h-24", "h-32", "h-auto"].map((v) => ({ label: v, value: v }))}
            />
          </Field>

          <Field label="Background">
            <Select
              value={(node.props.bg as string) ?? ""}
              onChange={(v) => update("bg", v)}
              options={[
                { label: "None", value: "" },
                { label: "White", value: "bg-white" },
                { label: "Slate 100", value: "bg-slate-100" },
                { label: "Blue 100", value: "bg-blue-100" },
                { label: "Blue 500", value: "bg-blue-500" },
                { label: "Green 100", value: "bg-green-100" },
                { label: "Red 100", value: "bg-red-100" },
              ]}
            />
          </Field>
        </>
      )}
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      className="w-full px-2 py-1 text-sm border border-slate-200 rounded bg-white"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
