export type HandListFilterMode = "all" | "tracked" | "matching";

type Props = {
  filterMode: HandListFilterMode;
  onModeChange: (mode: HandListFilterMode) => void;
  trackedCount: number;
  /** When true, show the “Any match” segment (tile tracking must be on). */
  tileTrackingEnabled: boolean;
  /** When false with tracking on, “Any match” is disabled until tiles are selected. */
  hasSelectedTiles: boolean;
};

/**
 * Segmented toggle: all hands, bookmarked-only, or any hand with a positive tile match.
 */
export function HandListFilterToggle({
  filterMode,
  onModeChange,
  trackedCount,
  tileTrackingEnabled,
  hasSelectedTiles,
}: Props) {
  const allActive = filterMode === "all";
  const trackedActive = filterMode === "tracked";
  const matchingActive = filterMode === "matching";
  const matchUsable = tileTrackingEnabled && hasSelectedTiles;

  const segmentClass = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-gray-900 ${
      active
        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    }`;

  return (
    <div
      className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1 dark:border-gray-600 dark:bg-gray-900/50"
      role="group"
      aria-label="Filter which hands to show"
    >
      <button
        type="button"
        aria-pressed={allActive}
        className={segmentClass(allActive)}
        onClick={() => onModeChange("all")}
      >
        All
      </button>
      <button
        type="button"
        aria-pressed={trackedActive}
        className={segmentClass(trackedActive)}
        onClick={() => onModeChange("tracked")}
      >
        Tracked{trackedCount > 0 ? ` (${trackedCount})` : ""}
      </button>
      {tileTrackingEnabled ? (
        <button
          type="button"
          aria-pressed={matchingActive}
          disabled={!matchUsable}
          title={
            matchUsable
              ? "Show only hands that share at least one tile with your selection"
              : "Add tiles from the picker to filter by match"
          }
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-gray-900 ${
            !matchUsable
              ? "cursor-not-allowed opacity-45 text-gray-500 dark:text-gray-500"
              : matchingActive
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          }`}
          onClick={() => {
            if (matchUsable) onModeChange("matching");
          }}
        >
          Any match
        </button>
      ) : null}
    </div>
  );
}
