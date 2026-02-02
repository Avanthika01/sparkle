import type { FilterType } from '../types/todo';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TodoFilter({
  currentFilter,
  onFilterChange,
  stats,
  onClearCompleted,
}: TodoFilterProps) {
  return (
    <div className="todo-filter">
      <span className="todo-count">
        {stats.active} item{stats.active !== 1 ? 's' : ''} left
      </span>
      <div className="filter-buttons" role="group" aria-label="Filter todos">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            className={currentFilter === value ? 'active' : ''}
            onClick={() => onFilterChange(value)}
            aria-pressed={currentFilter === value}
          >
            {label}
          </button>
        ))}
      </div>
      {stats.completed > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </div>
  );
}
