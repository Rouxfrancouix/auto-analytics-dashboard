import React from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { ColumnProfile, FilterState } from '../types/data';

interface DataFilterPanelProps {
  columns: ColumnProfile[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalRows: number;
  filteredCount: number;
}

export const DataFilterPanel: React.FC<DataFilterPanelProps> = ({
  columns,
  filters,
  setFilters,
  totalRows,
  filteredCount
}) => {
  const qualCols = columns.filter(c => c.type === 'qualitative' && c.uniqueCount <= 20);

  const handleCategoryToggle = (colName: string, category: string) => {
    setFilters(prev => {
      const currentSelected = prev.selectedCategories[colName] || [];
      const updated = currentSelected.includes(category)
        ? currentSelected.filter(c => c !== category)
        : [...currentSelected, category];

      return {
        ...prev,
        selectedCategories: {
          ...prev.selectedCategories,
          [colName]: updated
        }
      };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategories: {},
      numericRanges: {}
    });
  };

  const hasActiveFilters = filters.searchTerm !== '' || Object.values(filters.selectedCategories).some(arr => arr.length > 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            placeholder="Search records across all attributes..."
            className="w-full pl-10 pr-10 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {filters.searchTerm && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-500" />
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredCount.toLocaleString()}</strong> of {totalRows.toLocaleString()} rows
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {qualCols.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Category Filters:
          </span>
          {qualCols.slice(0, 3).map(col => {
            const categories = Object.keys(col.qualStats?.frequencies || {}).slice(0, 8);
            const activeList = filters.selectedCategories[col.name] || [];

            return (
              <div key={col.name} className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{col.name}:</span>
                <div className="flex flex-wrap gap-1">
                  {categories.map(cat => {
                    const isSelected = activeList.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryToggle(col.name, cat)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
