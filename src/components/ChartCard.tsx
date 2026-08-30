import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Settings, Trash2, Maximize2 } from 'lucide-react';
import { ChartConfig, DataRow } from '../types/data';
import { lttbDownsample, downsampleCategories } from '../utils/downsample';

interface ChartCardProps {
  config: ChartConfig;
  data: DataRow[];
  onEdit: (config: ChartConfig) => void;
  onDelete: (id: string) => void;
  onFocus?: (config: ChartConfig) => void;
}

const PIE_COLORS = ['#0284c7', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f43f5e'];

export const ChartCard: React.FC<ChartCardProps> = ({ config, data, onEdit, onDelete, onFocus }) => {
  // Aggregate data with downsampling for Tableau-scale performance
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const { xAxisKey, yAxisKey, aggregation = 'sum', type } = config;

    if (type === 'scatter') {
      const rawPoints = data.map((r, idx) => ({
        x: Number(r[xAxisKey]) || idx,
        y: Number(r[yAxisKey]) || 0,
        name: String(r[xAxisKey] ?? idx)
      }));

      // Downsample scatter points if > 300 to preserve performance
      return rawPoints.length > 300 ? lttbDownsample(rawPoints, 300) : rawPoints;
    }

    const map = new Map<string, { count: number; sum: number; min: number; max: number }>();

    for (let i = 0; i < data.length; i++) {
      const r = data[i];
      const xVal = String(r[xAxisKey] ?? 'Unknown');
      const yVal = Number(r[yAxisKey]) || 0;

      if (!map.has(xVal)) {
        map.set(xVal, { count: 1, sum: yVal, min: yVal, max: yVal });
      } else {
        const curr = map.get(xVal)!;
        curr.count += 1;
        curr.sum += yVal;
        curr.min = Math.min(curr.min, yVal);
        curr.max = Math.max(curr.max, yVal);
      }
    }

    const result: { name: string; value: number }[] = [];
    map.forEach((val, key) => {
      let finalVal = val.sum;
      if (aggregation === 'avg') finalVal = val.sum / val.count;
      else if (aggregation === 'count') finalVal = val.count;
      else if (aggregation === 'min') finalVal = val.min;
      else if (aggregation === 'max') finalVal = val.max;

      result.push({
        name: key,
        value: Number(finalVal.toFixed(2))
      });
    });

    if (type === 'pie') {
      return downsampleCategories(result, 8);
    }

    // Downsample if categorical series has too many entries
    return result.length > 25 ? downsampleCategories(result, 20) : result;
  }, [data, config]);

  const mainColor = config.color || '#0284c7';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {config.title}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {config.description || `${config.aggregation?.toUpperCase()} of ${config.yAxisKey} by ${config.xAxisKey}`}
          </p>
        </div>

        <div className="flex items-center space-x-1">
          {onFocus && (
            <button
              onClick={() => onFocus(config)}
              className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Fullscreen Chart Focus"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onEdit(config)}
            className="p-1.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Edit Chart Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(config.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Delete Chart"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="h-64 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {(() => {
            if (config.type === 'bar') {
              return (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="value" fill={mainColor} radius={[6, 6, 0, 0]} />
                </BarChart>
              );
            } else if (config.type === 'line') {
              return (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="value" stroke={mainColor} strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              );
            } else if (config.type === 'area') {
              return (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="value" stroke={mainColor} fill={mainColor} fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              );
            } else if (config.type === 'pie') {
              return (
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              );
            } else if (config.type === 'scatter') {
              return (
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#33415522" />
                  <XAxis dataKey="x" name={config.xAxisKey} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="y" name={config.yAxisKey} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '11px' }} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={chartData} fill={mainColor} />
                </ScatterChart>
              );
            }
            return (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415522" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill={mainColor} />
              </BarChart>
            );
          })()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
