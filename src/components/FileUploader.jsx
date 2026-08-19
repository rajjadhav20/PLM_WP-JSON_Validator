import { FileJson, Upload } from "lucide-react";

export default function FileUploader({ onFileSelected, disabled = false }) {
  function handleFile(event) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      alert("Please select a JSON file.");
      return;
    }

    onFileSelected(file);
  }

  return (
    <div className="upload-card">
      <div className="upload-icon">
        <FileJson size={42} />
      </div>

      <h2>Upload PLM WP JSON</h2>

      <p>
        Select a PLM Work Package JSON file from your local computer to validate
        it against the Phase 2 PLM WP schema.
      </p>

      <label className={`upload-button ${disabled ? "disabled" : ""}`}>
        <Upload size={18} />
        Browse JSON File
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFile}
          disabled={disabled}
          hidden
        />
      </label>

      <small>Only .json files are supported.</small>
    </div>
  );
}
