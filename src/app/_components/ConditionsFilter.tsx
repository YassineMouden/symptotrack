"use client";

export type SortOption = "confidence" | "alphabetical" | "severity";
export type FilterOption = "all" | "serious" | "common";

interface ConditionsFilterProps {
  sortOption: SortOption;
  filterOption: FilterOption;
  onChangeSortOption: (option: SortOption) => void;
  onChangeFilterOption: (option: FilterOption) => void;
  totalConditions: number;
  filteredCount: number;
}

export default function ConditionsFilter({
  sortOption,
  filterOption,
  onChangeSortOption,
  onChangeFilterOption,
  totalConditions,
  filteredCount
}: ConditionsFilterProps) {
  return (
    <div className="mb-4 flex flex-col space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{filteredCount}</span> of <span className="font-medium">{totalConditions}</span> conditions
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort options */}
        <div className="flex items-center">
          <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortOption}
            onChange={(e) => onChangeSortOption(e.target.value as SortOption)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="confidence">Confidence</option>
            <option value="severity">Severity</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        
        {/* Filter buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter:
          </span>
          <div className="flex space-x-1 rounded-md bg-white p-1 shadow-sm dark:bg-gray-700">
            <button
              onClick={() => onChangeFilterOption("all")}
              className={`rounded px-2 py-1 text-xs font-medium ${
                filterOption === "all"
                  ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => onChangeFilterOption("serious")}
              className={`rounded px-2 py-1 text-xs font-medium ${
                filterOption === "serious"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Serious
            </button>
            <button
              onClick={() => onChangeFilterOption("common")}
              className={`rounded px-2 py-1 text-xs font-medium ${
                filterOption === "common"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Common
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 