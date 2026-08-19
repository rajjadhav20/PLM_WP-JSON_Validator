export default function ValidationFilters({
  errors,
  selectedFilter,
  onFilterChange,
}) {
  const filters = [
    "All",
    "Required Field",
    "Invalid Type",
    "Invalid Format",
    "Unexpected Property",
    "Invalid Value",
    "Invalid Length",
    "Invalid Array Length",
  ];

  return (
    <div className="validation-filters">
      {filters.map((filter) => {
        const count =
          filter === "All"
            ? errors.length
            : errors.filter((error) => error.category === filter).length;

        return (
          <button
            key={filter}
            className={selectedFilter === filter ? "filter active" : "filter"}
            onClick={() => onFilterChange(filter)}
          >
            {filter}

            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
