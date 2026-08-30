import React, { useState } from 'react';
import { Plus, Database, Hash, FileSpreadsheet, TrendingUp, Layers, Settings2 } from 'lucide-react';
import { DatasetAnalysis, ChartConfig, FilterState, DataRow } from '../types/data';
import { DataFilterPanel } from './DataFilterPanel';
import { ChartCard } from './ChartCard';
import { ChartBuilderModal } from './ChartBuilderModal';
import { ChartFocusModal } from './ChartFocusModal';

interface DashboardProps {
  analysis: DatasetAnalysis;
  charts: ChartConfig[];
  setCharts: React.Dispatch<React.SetStateAction<ChartConfig[]>>;
  filteredRows: DataRow[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenCastModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analysis,
  charts,
  setCharts,
  filteredRows,
  filters,
  setFilters,
  onOpenCastModal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | null>(null);
  const [focusedChart, setFocusedChart] = useState<ChartConfig | null>(null);

  const primaryQuant = analysis.quantColumns[0];
  const primaryQual = analysis.qualColumns[0];

  const handleSaveChart = (chartConfig: ChartConfig) => {
    setCharts(prev => {
      const exists = prev.some(c => c.id === chartConfig.id);
      if (exists) {
        return prev.map(c => c.id === chartConfig.id ? chartConfig : c);
      }
      return [...prev, chartConfig];
    });
  };

  const handleDeleteChart = (id: string) => {
    setCharts(prev => prev.filter(c => c.id !== id));
  };

  const handleEditChart = (config: ChartConfig) => {
    setEditingChart(config);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Records */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Rows</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {filteredRows.length.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400">
              of {analysis.totalRows.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Total Attributes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Attributes</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {analysis.totalColumns}
            </span>
            {onOpenCastModal && (
              <button
                onClick={onOpenCastModal}
                className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center space-x-0.5"
              >
                <Settings2 className="w-3 h-3" />
                <span>Cast</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Metric Sum */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {primaryQuant ? `Primary Metric (${primaryQuant.name})` : 'Metric Summary'}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {primaryQuant?.quantStats
                ? primaryQuant.quantStats.sum > 100000
                  ? `$${(primaryQuant.quantStats.sum / 1000).toFixed(1)}k`
                  : primaryQuant.quantStats.sum.toLocaleString()
                : 'N/A'}
            </span>
            <span className="text-xs text-emerald-500 font-semibold">
              Avg: {primaryQuant?.quantStats?.mean.toFixed(1) ?? 'N/A'}
            </span>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {primaryQual ? `Top Category (${primaryQual.name})` : 'Category Summary'}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white truncate max-w-[140px]">
              {primaryQual?.qualStats?.topCategory || 'N/A'}
            </span>
            <span className="text-xs text-amber-500 font-semibold">
              {primaryQual?.qualStats?.topCount || 0} items
            </span>
          </div>
        </div>
      </div>

      {/* Global Filter Bar */}
      <DataFilterPanel
        columns={analysis.columns}
        filters={filters}
        setFilters={setFilters}
        totalRows={analysis.totalRows}
        filteredCount={filteredRows.length}
      />

      {/* Dashboard Visualizations Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Automated Dashboard Visuals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High-performance downsampled charts built from your dataset schema.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingChart(null);
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Chart</span>
        </button>
      </div>

      {/* Charts Grid */}
      {charts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map(config => (
            <ChartCard
              key={config.id}
              config={config}
              data={filteredRows}
              onEdit={handleEditChart}
              onDelete={handleDeleteChart}
              onFocus={(c) => setFocusedChart(c)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No active charts</h3>
          <p className="text-xs text-slate-500 mt-1">Click "Add Custom Chart" to build a new visualization.</p>
        </div>
      )}

      {/* Modals */}
      <ChartBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        columns={analysis.columns}
        onSave={handleSaveChart}
        editingChart={editingChart}
      />

      <ChartFocusModal
        chart={focusedChart}
        data={filteredRows}
        onClose={() => setFocusedChart(null)}
      />
    </div>
  );
};
