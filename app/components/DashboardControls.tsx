interface DashboardControlsProps {
  filter: string;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoRefresh: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
  fetchedAt: string;
}

export function DashboardControls({
  filter,
  onFilterChange,
  onRefresh,
  isRefreshing,
  autoRefresh,
  onAutoRefreshChange,
  fetchedAt,
}: DashboardControlsProps) {
  return (
    <section className="dashboard-controls" aria-label="Dashboard controls">
      <div className="dashboard-controls__row">
        <label className="filter-field">
          <span className="filter-field__label">Filter by name or symbol</span>
          <input
            type="search"
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            placeholder='Try "eth" or "solana"'
            className="filter-field__input"
          />
        </label>

        <div className="dashboard-controls__actions">
          <label className="toggle-field">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => onAutoRefreshChange(event.target.checked)}
            />
            <span>Auto-refresh (60s)</span>
          </label>

          <button
            type="button"
            className="button button--primary"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing…" : "Refresh rates"}
          </button>
        </div>
      </div>

      <p className="dashboard-controls__meta">
        Last updated:{" "}
        <time dateTime={fetchedAt}>
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "medium",
          }).format(new Date(fetchedAt))}
        </time>
      </p>
    </section>
  );
}
