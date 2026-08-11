export default function JsonViewer({ jsonText }) {
  if (!jsonText) return null;

  return (
    <div className="json-panel">
      <div className="panel-header">
        <h2>JSON Preview</h2>
      </div>

      <pre>
        {jsonText.split("\n").map((line, index) => (
          <div className="json-line" key={index}>
            <span className="line-number">{index + 1}</span>
            <span>{line || " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
