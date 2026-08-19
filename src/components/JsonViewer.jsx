export default function JsonViewer({
  jsonText,
  errorLines = [],
  selectedLine,
}) {
  if (!jsonText) {
    return null;
  }

  const lines = jsonText.split("\n");

  const errorLineSet = new Set(errorLines);

  return (
    <div className="json-panel">
      <div className="panel-header">
        <h2>JSON Preview</h2>

        <span>{lines.length} lines</span>
      </div>

      <pre>
        {lines.map((line, index) => {
          const lineNumber = index + 1;

          const hasError = errorLineSet.has(lineNumber);

          const selected = selectedLine === lineNumber;

          return (
            <div
              key={lineNumber}
              id={`json-line-${lineNumber}`}
              className={`
                  json-line
                  ${hasError ? "json-line-error" : ""}
                  ${selected ? "json-line-selected" : ""}
                `}
            >
              <span className="line-number">{lineNumber}</span>

              <span>{line || " "}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
