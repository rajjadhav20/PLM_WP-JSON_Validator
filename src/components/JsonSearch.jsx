import { Search, X } from "lucide-react";

export default function JsonSearch({ value, onChange, resultCount = 0 }) {
  return (
    <div className="json-search">
      <Search size={18} />

      <input
        type="text"
        placeholder="Search JSON keys or values..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {value && (
        <button onClick={() => onChange("")}>
          <X size={16} />
        </button>
      )}

      {value && <span className="search-count">{resultCount} match(es)</span>}
    </div>
  );
}
