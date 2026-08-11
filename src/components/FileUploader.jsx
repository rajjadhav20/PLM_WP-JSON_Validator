import { Upload, FileJson } from "lucide-react";

export default function FileUploader({ onFileSelected }) {
  function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

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

      <p>Select a JSON file from your local computer to validate it.</p>

      <label className="upload-button">
        <Upload size={18} />
        Browse JSON File
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFile}
          hidden
        />
      </label>

      <small>Only .json files are supported.</small>
    </div>
  );
}
