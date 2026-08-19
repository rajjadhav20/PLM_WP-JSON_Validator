function getValueType(value) {
  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
}

function formatPrimitive(value) {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}

export default function JsonTreeNode({
  name,
  value,
  path,
  level = 0,
  selectedPath,
  expandedPaths,
  onToggle,
  onSelect,
  searchQuery = "",
}) {
  const type = getValueType(value);

  const isObject = type === "object";

  const isArray = type === "array";

  const isContainer = isObject || isArray;

  const isExpanded = expandedPaths.has(path);

  const isSelected = selectedPath === path;

  const searchText = `${name} ${formatPrimitive(value)}`.toLowerCase();

  const matchesSearch =
    searchQuery && searchText.includes(searchQuery.toLowerCase());

  function handleClick() {
    onSelect({
      path,
      name,
      value,
      type,
    });
  }

  return (
    <div className="json-tree-node">
      <div
        className={`
          json-tree-row
          ${isSelected ? "tree-selected" : ""}
          ${matchesSearch ? "tree-search-match" : ""}
        `}
        style={{
          paddingLeft: `${level * 22}px`,
        }}
        onClick={handleClick}
      >
        {isContainer ? (
          <button
            className="tree-toggle"
            onClick={(event) => {
              event.stopPropagation();

              onToggle(path);
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <span className="tree-spacer" />
        )}

        <span className="tree-key">{name}</span>

        <span className={`tree-type type-${type}`}>{type}</span>

        {!isContainer && (
          <span className="tree-value">{formatPrimitive(value)}</span>
        )}
      </div>

      {isContainer && isExpanded && (
        <div className="tree-children">
          {isArray
            ? value.map((item, index) => (
                <JsonTreeNode
                  key={`${path}/${index}`}
                  name={index}
                  value={item}
                  path={`${path}/${index}`}
                  level={level + 1}
                  selectedPath={selectedPath}
                  expandedPaths={expandedPaths}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  searchQuery={searchQuery}
                />
              ))
            : Object.entries(value).map(([key, childValue]) => (
                <JsonTreeNode
                  key={`${path}/${key}`}
                  name={key}
                  value={childValue}
                  path={`${path}/${key}`}
                  level={level + 1}
                  selectedPath={selectedPath}
                  expandedPaths={expandedPaths}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  searchQuery={searchQuery}
                />
              ))}
        </div>
      )}
    </div>
  );
}
