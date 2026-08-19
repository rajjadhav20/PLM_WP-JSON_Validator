import JsonTreeNode from "./JsonTreeNode";

export default function JsonTreeViewer({
  data,
  selectedPath,
  expandedPaths,
  onToggle,
  onSelect,
  searchQuery,
}) {
  if (!data) {
    return <div className="empty-tree">No JSON loaded.</div>;
  }

  return (
    <div className="json-tree">
      <JsonTreeNode
        name="ROOT"
        value={data}
        path="/"
        level={0}
        selectedPath={selectedPath}
        expandedPaths={expandedPaths}
        onToggle={onToggle}
        onSelect={onSelect}
        searchQuery={searchQuery}
      />
    </div>
  );
}
