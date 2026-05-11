import { useState } from "react";

import { useBuilderStore } from "../store/useBuilderStore";

interface Props {
  onClose: () => void;
}

export function ExportModal({ onClose }: Props) {
  const tree = useBuilderStore((s) => s.tree);
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(tree, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-700">Export JSON</h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              className="px-3 py-1 text-xs rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        <pre className="overflow-auto p-5 text-xs text-slate-700 font-mono leading-relaxed">
          {json}
        </pre>
      </div>
    </div>
  );
}
