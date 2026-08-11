export default function ValidationErrors({ errors }) {
  if (!errors?.length) {
    return <div className="no-errors">✓ No validation errors found.</div>;
  }

  return (
    <div className="errors-panel">
      <h2>Validation Errors</h2>

      {errors.map((error, index) => (
        <div className="error-item" key={`${error.instancePath}-${index}`}>
          <div className="error-title">
            <span>#{index + 1}</span>
            <strong>{error.keyword}</strong>
          </div>

          <p>{error.message}</p>

          <div className="error-meta">
            <span>
              Path: <code>{error.instancePath || "/"}</code>
            </span>

            {error.schemaPath && (
              <span>
                Schema: <code>{error.schemaPath}</code>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
