export default function ValidationSummary({ result }) {
  if (!result) {
    return null;
  }

  const errorCount = result.errors?.length ?? 0;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span>Status</span>

        <strong className={result.valid ? "success" : "error"}>
          {result.valid ? ": VALID" : ": INVALID"}
        </strong>
      </div>

      <div className="summary-card">
        <span>Errors: </span>

        <strong className={errorCount === 0 ? ": success" : ": error"}>
          {errorCount}
        </strong>
      </div>

      <div className="summary-card">
        <span>File</span>

        <strong title={result.fileName}>{result.fileName}</strong>
      </div>

      <div className="summary-card">
        <span>Schema: </span>

        <strong>PLM WP / Draft 2020-12</strong>
      </div>
    </div>
  );
}
