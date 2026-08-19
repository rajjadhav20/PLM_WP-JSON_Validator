import { AlertCircle, Copy, Check } from "lucide-react";

import { useState } from "react";

export default function ErrorInspector({ error, selectedNode }) {
  const [copied, setCopied] = useState("");

  async function copyText(value, type) {
    if (value === undefined || value === null) {
      return;
    }

    await navigator.clipboard.writeText(String(value));

    setCopied(type);

    setTimeout(() => {
      setCopied("");
    }, 1500);
  }

  if (!error && !selectedNode) {
    return (
      <div className="inspector-empty">
        <AlertCircle size={28} />

        <p>Select a validation error or JSON node to inspect it.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-inspector">
        <div className="inspector-header">
          <AlertCircle size={20} />

          <h2>Validation Error</h2>
        </div>

        <div className="inspector-category">{error.category}</div>

        <div className="inspector-section">
          <label>Message</label>

          <p>{error.message}</p>
        </div>

        <div className="inspector-section">
          <label>JSON Path</label>

          <div className="copy-row">
            <code>{error.path}</code>

            <button onClick={() => copyText(error.path, "path")}>
              {copied === "path" ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        <div className="inspector-grid">
          <div>
            <label>Line</label>

            <strong>{error.lineNumber ?? "N/A"}</strong>
          </div>

          <div>
            <label>Column</label>

            <strong>{error.column ?? "N/A"}</strong>
          </div>
        </div>

        <div className="inspector-section">
          <label>AJV Keyword</label>

          <code>{error.keyword}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="node-inspector">
      <div className="inspector-header">
        <h2>JSON Node</h2>
      </div>

      <div className="inspector-section">
        <label>Name</label>

        <strong>{selectedNode.name}</strong>
      </div>

      <div className="inspector-section">
        <label>JSON Path</label>

        <div className="copy-row">
          <code>{selectedNode.path}</code>

          <button onClick={() => copyText(selectedNode.path, "node-path")}>
            {copied === "node-path" ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      <div className="inspector-section">
        <label>Type</label>

        <code>{selectedNode.type}</code>
      </div>

      <div className="inspector-section">
        <label>Value</label>

        <pre>{JSON.stringify(selectedNode.value, null, 2)}</pre>
      </div>
    </div>
  );
}
