import React from 'react';
import { X, Maximize2 } from 'lucide-react';
import { ChartConfig, DataRow } from '../types/data';
import { ChartCard } from './ChartCard';

interface ChartFocusModalProps {
  chart: ChartConfig | null;
  data: DataRow[];
  onClose: () => void;
}

export const ChartFocusModal: React.FC<ChartFocusModalProps> = ({ chart, data, onClose }) => {
  if (!chart) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full p-6 sm:p-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 dark:bg-sky-950 text-sky-600 rounded-xl">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{chart.title}</h2>
              <p className="text-xs text-slate-500">{chart.aggregation?.toUpperCase()} of {chart.yAxisKey} by {chart.xAxisKey}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fullscreen Chart Rendering */}
        <div className="flex-1 w-full min-h-[400px]">
          <ChartCard
            config={chart}
            data={data}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
