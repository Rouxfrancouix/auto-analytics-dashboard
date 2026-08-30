import React, { useState } from 'react';
import { Layers, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { ColumnProfile } from '../types/data';

interface QualitativeListProps {
  qualColumns: ColumnProfile[];
}

export const QualitativeList: React.FC<QualitativeListProps> = ({ qualColumns }) => {
  const [selectedColIndex, setSelectedColIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  if (!qualColumns || qualColumns.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        No qualitative categorical columns detected in this dataset.
      </div>
    );
  }

  const selectedCol = qualColumns[selectedColIndex] || qualColumns[0];
  const frequencies = selectedCol.qualStats?.frequencies || {};

  const categories = Object.entries(frequencies)
    .filter(([cat]) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortAsc ? a[1] - b[1] : b[1] - a[1]);

  const totalOccurrences = Object.values(frequencies).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Column Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>Qualitative & Categorical Breakdown</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated frequency distribution, category ranking, and unique text item analysis.
          </p>
        </div>

        {/* Column Selectors */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {qualColumns.map((col, idx) => (
            <button
              key={col.name}
              onClick={() => { setSelectedColIndex(idx); setSearchTerm(''); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedColIndex === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {col.name} ({col.uniqueCount} unique)
            </button>
          ))}
        </div>
      </div>

      {/* Selected Column Detail View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Attribute: <span className="text-indigo-600 dark:text-indigo-400">{selectedCol.name}</span>
            </h3>
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Unique Categories: <strong>{selectedCol.uniqueCount}</strong></span>
              <span>Top Category: <strong>{selectedCol.qualStats?.topCategory}</strong> ({selectedCol.qualStats?.topCount} times)</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search filter */}
            <div className="relative w-full md:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <span>Sort by Count</span>
              {sortAsc ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Frequency List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4">Category / Value</th>
                <th className="py-3 px-4 text-right">Frequency Count</th>
                <th className="py-3 px-4 text-right">Percentage Share</th>
                <th className="py-3 px-4 w-1/3">Visual Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map(([category, count]) => {
                const pct = ((count / (totalOccurrences || 1)) * 100).toFixed(1);
                return (
                  <tr key={category} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {category || '(Empty)'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {count.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      {pct}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
