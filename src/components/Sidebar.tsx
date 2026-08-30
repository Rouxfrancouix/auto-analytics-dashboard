import React from 'react';
import {
  Layers,
  FileSpreadsheet,
  Hash,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Database
} from 'lucide-react';
import { ColumnProfile, DatasetAnalysis } from '../types/data';

interface SidebarProps {
  analysis: DatasetAnalysis | null;
  isOpen: boolean;
  onToggle: () => void;
  onOpenCastModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  analysis,
  isOpen,
  onToggle,
  onOpenCastModal
}) => {
  if (!analysis) return null;

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-12'
      } hidden lg:block`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm transition"
      >
        {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {isOpen ? (
        <div className="p-4 space-y-6 overflow-y-auto h-full text-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-sky-500" />
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]" title={analysis.fileName}>
                {analysis.fileName}
              </span>
            </div>
            <button
              onClick={onOpenCastModal}
              className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Manage Column Data Types"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>

          {/* Dataset Statistics */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Rows:</span>
              <strong className="text-slate-900 dark:text-white">{analysis.totalRows.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Columns:</span>
              <strong className="text-slate-900 dark:text-white">{analysis.totalColumns}</strong>
            </div>
          </div>

          {/* Quantitative Fields */}
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center space-x-1">
              <Hash className="w-3 h-3 text-emerald-500" />
              <span>Numeric Fields ({analysis.quantColumns.length})</span>
            </h4>
            <div className="space-y-1">
              {analysis.quantColumns.map(col => (
                <div key={col.name} className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-medium truncate flex justify-between items-center">
                  <span>{col.name}</span>
                  <span className="text-[10px] text-emerald-500 font-mono">avg: {col.quantStats?.mean.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Fields */}
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center space-x-1">
              <Layers className="w-3 h-3 text-indigo-500" />
              <span>Categorical Fields ({analysis.qualColumns.length})</span>
            </h4>
            <div className="space-y-1">
              {analysis.qualColumns.map(col => (
                <div key={col.name} className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-medium truncate flex justify-between items-center">
                  <span>{col.name}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">{col.uniqueCount} uniq</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center space-y-6 text-slate-400">
          <Database className="w-5 h-5 text-sky-500" />
          <Hash className="w-5 h-5 text-emerald-500" />
          <Layers className="w-5 h-5 text-indigo-500" />
        </div>
      )}
    </aside>
  );
};
