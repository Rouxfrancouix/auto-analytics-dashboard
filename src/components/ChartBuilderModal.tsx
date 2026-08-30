import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { ChartConfig, ChartType, AggregationMode, ColumnProfile } from '../types/data';

interface ChartBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnProfile[];
  onSave: (chartConfig: ChartConfig) => void;
  editingChart?: ChartConfig | null;
}

const COLOR_OPTIONS = [
  '#0284c7', // Sky Blue
  '#10b981', // Emerald Green
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
  '#f43f5e', // Rose
];

export const ChartBuilderModal: React.FC<ChartBuilderModalProps> = ({
  isOpen,
  onClose,
  columns,
  onSave,
  editingChart
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ChartType>('bar');
  const [xAxisKey, setXAxisKey] = useState('');
  const [yAxisKey, setYAxisKey] = useState('');
  const [aggregation, setAggregation] = useState<AggregationMode>('sum');
  const [color, setColor] = useState('#0284c7');

  useEffect(() => {
    if (editingChart) {
      setTitle(editingChart.title);
      setType(editingChart.type);
      setXAxisKey(editingChart.xAxisKey);
      setYAxisKey(editingChart.yAxisKey);
      setAggregation(editingChart.aggregation || 'sum');
      setColor(editingChart.color || '#0284c7');
    } else if (columns.length > 0) {
      setTitle('Custom Analysis Chart');
      setType('bar');
      setXAxisKey(columns[0].name);
      const quant = columns.find(c => c.type === 'quantitative');
      setYAxisKey(quant ? quant.name : columns[0].name);
      setAggregation('sum');
      setColor('#0284c7');
    }
  }, [editingChart, columns, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingChart ? editingChart.id : `custom-chart-${Date.now()}`,
      title: title || `${aggregation.toUpperCase()} of ${yAxisKey} by ${xAxisKey}`,
      type,
      xAxisKey,
      yAxisKey,
      aggregation,
      color
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {editingChart ? 'Customize Chart Settings' : 'Create Custom Visualization'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Chart Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chart Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sales Distribution by Category"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          {/* Chart Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chart Format / Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['bar', 'line', 'area', 'pie', 'scatter'] as ChartType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 text-xs font-semibold rounded-xl capitalize transition border ${
                    type === t
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* X Axis Column */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category / Dimension (X-Axis)
            </label>
            <select
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {columns.map(col => (
                <option key={col.name} value={col.name}>
                  {col.name} ({col.type})
                </option>
              ))}
            </select>
          </div>

          {/* Y Axis Column */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Numeric Metric (Y-Axis)
            </label>
            <select
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {columns.map(col => (
                <option key={col.name} value={col.name}>
                  {col.name} ({col.type})
                </option>
              ))}
            </select>
          </div>

          {/* Aggregation Mode */}
          {type !== 'scatter' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Aggregation Function
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['sum', 'avg', 'count', 'min', 'max'] as AggregationMode[]).map((agg) => (
                  <button
                    type="button"
                    key={agg}
                    onClick={() => setAggregation(agg)}
                    className={`py-1.5 text-xs font-medium rounded-lg uppercase transition ${
                      aggregation === agg
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {agg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Accent Color
            </label>
            <div className="flex items-center space-x-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition border-2 ${
                    color === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm"
            >
              {editingChart ? 'Save Changes' : 'Add Chart to Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
