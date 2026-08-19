export default function ValidationErrors({ errors = [], onErrorClick }) {
  if (!errors.length) {
    return <div className="no-errors">No validation errors found. ✓</div>;
  }

  return (
    <div className="errors-panel">
      <div className="panel-header">
        <h2>Validation Errors</h2>

        <span>{errors.length} issue(s)</span>
      </div>

      {errors.map((error) => (
        <button
          className="validation-error-item"
          key={error.id}
          onClick={() => onErrorClick(error)}
          type="button"
        >
          <div className="validation-error-icon">⚠️</div>

          <div className="validation-error-content">
            <div className="validation-error-title">
              <span className="validation-error-id">#{error.id}</span>

              <strong>{error.category}</strong>
            </div>

            <p className="validation-error-message">{error.message}</p>

            <div className="validation-error-meta">
              <span>
                <strong>Path:</strong>
                <code>{error.path}</code>
              </span>

              <span>
                <strong>Line:</strong>
                <code>{error.lineNumber ?? "N/A"}</code>
              </span>

              {error.column && (
                <span>
                  <strong>Column:</strong>
                  <code>{error.column}</code>
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
