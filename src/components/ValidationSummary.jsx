export default function ValidationSummary({ result }) {
  if (!result) return null;

  const errorCount = result.errors.length;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span>Status</span>
        <strong className={result.valid ? "success" : "error"}>
          {result.valid ? "VALID" : "INVALID"}
        </strong>
      </div>

      <div className="summary-card">
        <span>Errors</span>
        <strong className="error">{errorCount}</strong>
      </div>

      <div className="summary-card">
        <span>File</span>
        <strong>{result.fileName}</strong>
      </div>
    </div>
  );
}
