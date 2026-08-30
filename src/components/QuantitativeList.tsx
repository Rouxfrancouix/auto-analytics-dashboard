import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Calculator, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ColumnProfile } from '../types/data';

interface QuantitativeListProps {
  quantColumns: ColumnProfile[];
  onOpenCastModal?: () => void;
}

type SortField = 'name' | 'mean' | 'median' | 'min' | 'max' | 'sum' | 'stdDev' | 'missingCount';

export const QuantitativeList: React.FC<QuantitativeListProps> = ({ quantColumns, onOpenCastModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = quantColumns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    let valA: any = 0;
    let valB: any = 0;

    if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortField === 'missingCount') {
      valA = a.missingCount;
      valB = b.missingCount;
    } else if (a.quantStats && b.quantStats) {
      valA = a.quantStats[sortField as keyof typeof a.quantStats] ?? 0;
      valB = b.quantStats[sortField as keyof typeof b.quantStats] ?? 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    return sortAsc ? <ArrowUp className="w-3 h-3 text-sky-500" /> : <ArrowDown className="w-3 h-3 text-sky-500" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            <span>Quantitative Metrics & Statistical Audit</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated statistical calculations across all numeric attributes. Click headers to sort.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenCastModal && (
            <button
              onClick={onOpenCastModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Cast / Add Field</span>
            </button>
          )}

          <div className="relative w-full md:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter columns..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Quantitative Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold">
              <th onClick={() => handleSort('name')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Column Name</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th onClick={() => handleSort('sum')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Total Sum</span>
                  {renderSortIcon('sum')}
                </div>
              </th>
              <th onClick={() => handleSort('mean')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Mean (Avg)</span>
                  {renderSortIcon('mean')}
                </div>
              </th>
              <th onClick={() => handleSort('median')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Median</span>
                  {renderSortIcon('median')}
                </div>
              </th>
              <th onClick={() => handleSort('min')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Min</span>
                  {renderSortIcon('min')}
                </div>
              </th>
              <th onClick={() => handleSort('max')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Max</span>
                  {renderSortIcon('max')}
                </div>
              </th>
              <th onClick={() => handleSort('stdDev')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Std Dev</span>
                  {renderSortIcon('stdDev')}
                </div>
              </th>
              <th onClick={() => handleSort('missingCount')} className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <div className="flex items-center space-x-1">
                  <span>Missing</span>
                  {renderSortIcon('missingCount')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {paginated.map(col => {
              const stats = col.quantStats;
              if (!stats) return null;

              return (
                <tr key={col.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold font-sans text-slate-900 dark:text-white">
                    {col.name}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {stats.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {stats.mean.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {stats.median.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {stats.min.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {stats.max.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {stats.stdDev.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {col.missingCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-sans font-semibold">
                        {col.missingCount} ({((col.missingCount / col.totalCount) * 100).toFixed(1)}%)
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
          <span className="text-slate-500">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
