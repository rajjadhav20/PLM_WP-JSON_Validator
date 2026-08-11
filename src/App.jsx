import { useState } from "react";
import { CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import FileUploader from "./components/FileUploader";
import ValidationSummary from "./components/ValidationSummary";
import ValidationErrors from "./components/ValidationErrors";
import JsonViewer from "./components/JsonViewer";
import { validateWP } from "./validators/validateWP";

export default function App() {
  const [jsonText, setJsonText] = useState("");
  const [result, setResult] = useState(null);
  const [parseError, setParseError] = useState("");

  async function handleFileSelected(file) {
    const text = await file.text();

    setJsonText(text);
    setParseError("");

    try {
      const data = JSON.parse(text);

      const validation = validateWP(data);

      setResult({
        ...validation,
        fileName: file.name,
      });
    } catch (error) {
      setResult(null);
      setParseError(`Invalid JSON syntax: ${error.message}`);
    }
  }

  function reset() {
    setJsonText("");
    setResult(null);
    setParseError("");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <ShieldCheck size={30} />
          <div>
            <h1>PLM WP JSON Validator</h1>
            <p>Local JSON validation and inspection tool</p>
          </div>
        </div>

        <button className="reset-button" onClick={reset}>
          <RotateCcw size={17} />
          Reset
        </button>
      </header>

      <main className="container">
        {!result && !parseError && (
          <FileUploader onFileSelected={handleFileSelected} />
        )}

        {parseError && (
          <div className="parse-error">
            <strong>JSON Parsing Error</strong>
            <p>{parseError}</p>
          </div>
        )}

        <ValidationSummary result={result} />

        {result && (
          <div className="status-banner">
            {result.valid ? (
              <>
                <CheckCircle2 size={22} />
                <span>
                  The uploaded PLM WP JSON passed all configured validation
                  rules.
                </span>
              </>
            ) : (
              <>
                <span className="status-cross">✕</span>
                <span>
                  The uploaded PLM WP JSON contains validation errors.
                </span>
              </>
            )}
          </div>
        )}

        {result && <ValidationErrors errors={result.errors} />}

        {jsonText && <JsonViewer jsonText={jsonText} />}
      </main>

      <footer>PLM WP JSON Validator • Frontend-only validation</footer>
    </div>
  );
}
