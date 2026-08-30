import React, { useState, useMemo } from 'react';
import { Grid, ArrowRightLeft } from 'lucide-react';
import { ColumnProfile, DataRow, AggregationMode } from '../types/data';

interface PivotTableProps {
  columns: ColumnProfile[];
  rows: DataRow[];
}

export const PivotTable: React.FC<PivotTableProps> = ({ columns, rows }) => {
  const qualCols = columns.filter(c => c.type === 'qualitative' || c.type === 'date');
  const quantCols = columns.filter(c => c.type === 'quantitative');

  const [rowDimension, setRowDimension] = useState<string>(qualCols[0]?.name || columns[0]?.name || '');
  const [colDimension, setColDimension] = useState<string>(qualCols[1]?.name || qualCols[0]?.name || '');
  const [valueMetric, setValueMetric] = useState<string>(quantCols[0]?.name || columns[0]?.name || '');
  const [aggregation, setAggregation] = useState<AggregationMode>('sum');

  // Compute 2D Matrix
  const matrixData = useMemo(() => {
    if (!rows || rows.length === 0 || !rowDimension || !colDimension || !valueMetric) {
      return { rowHeaders: [], colHeaders: [], cellValues: {}, rowTotals: {}, colTotals: {}, grandTotal: 0 };
    }

    const rowSet = new Set<string>();
    const colSet = new Set<string>();
    const store: Record<string, Record<string, number[]>> = {};

    rows.forEach(r => {
      const rKey = String(r[rowDimension] ?? '(Blank)');
      const cKey = String(r[colDimension] ?? '(Blank)');
      const val = Number(r[valueMetric]) || 0;

      rowSet.add(rKey);
      colSet.add(cKey);

      if (!store[rKey]) store[rKey] = {};
      if (!store[rKey][cKey]) store[rKey][cKey] = [];
      store[rKey][cKey].push(val);
    });

    const rowHeaders = Array.from(rowSet).slice(0, 30); // Top 30 row dimensions
    const colHeaders = Array.from(colSet).slice(0, 15); // Top 15 col dimensions

    const calcAgg = (arr: number[]) => {
      if (!arr || arr.length === 0) return 0;
      if (aggregation === 'sum') return arr.reduce((a, b) => a + b, 0);
      if (aggregation === 'avg') return arr.reduce((a, b) => a + b, 0) / arr.length;
      if (aggregation === 'count') return arr.length;
      if (aggregation === 'min') return Math.min(...arr);
      if (aggregation === 'max') return Math.max(...arr);
      return 0;
    };

    const cellValues: Record<string, Record<string, number>> = {};
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};
    let allValues: number[] = [];

    rowHeaders.forEach(r => {
      cellValues[r] = {};
      let rArr: number[] = [];
      colHeaders.forEach(c => {
        const list = store[r]?.[c] || [];
        const aggregated = calcAgg(list);
        cellValues[r][c] = aggregated;
        rArr.push(...list);

        if (!colTotals[c]) colTotals[c] = 0;
      });
      rowTotals[r] = calcAgg(rArr);
      allValues.push(...rArr);
    });

    colHeaders.forEach(c => {
      let cArr: number[] = [];
      rowHeaders.forEach(r => {
        const list = store[r]?.[c] || [];
        cArr.push(...list);
      });
      colTotals[c] = calcAgg(cArr);
    });

    const grandTotal = calcAgg(allValues);

    return { rowHeaders, colHeaders, cellValues, rowTotals, colTotals, grandTotal };
  }, [rows, rowDimension, colDimension, valueMetric, aggregation]);

  const maxCellValue = useMemo(() => {
    let max = 0;
    Object.values(matrixData.cellValues).forEach(rObj => {
      Object.values(rObj).forEach(v => {
        if (v > max) max = v;
      });
    });
    return max || 1;
  }, [matrixData]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Grid className="w-5 h-5 text-sky-500" />
            <span>Tableau Pivot Table & Cross-Tab Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2D multidimensional aggregation matrix. Select row/column dimensions and value metric.
          </p>
        </div>

        {/* Pivot Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Row Dimension */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Rows</label>
            <select
              value={rowDimension}
              onChange={(e) => setRowDimension(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {columns.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Column Dimension */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Columns</label>
            <select
              value={colDimension}
              onChange={(e) => setColDimension(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {columns.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Metric */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Value Metric</label>
            <select
              value={valueMetric}
              onChange={(e) => setValueMetric(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
            >
              {columns.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Aggregation */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Func</label>
            <select
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as AggregationMode)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium uppercase"
            >
              <option value="sum">Sum</option>
              <option value="avg">Avg</option>
              <option value="count">Count</option>
              <option value="min">Min</option>
              <option value="max">Max</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cross-Tab Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse font-mono">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans font-bold">
              <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">
                {rowDimension} \ {colDimension}
              </th>
              {matrixData.colHeaders.map(c => (
                <th key={c} className="py-3 px-3 text-right border border-slate-200 dark:border-slate-700">
                  {c}
                </th>
              ))}
              <th className="py-3 px-3 text-right bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-200 border border-slate-200 dark:border-slate-700">
                Total ({aggregation.toUpperCase()})
              </th>
            </tr>
          </thead>
          <tbody>
            {matrixData.rowHeaders.map(r => (
              <tr key={r} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                  {r}
                </td>
                {matrixData.colHeaders.map(c => {
                  const val = matrixData.cellValues[r]?.[c] || 0;
                  const ratio = Math.min(val / (maxCellValue || 1), 1);
                  const heatOpacity = (ratio * 0.35).toFixed(2);

                  return (
                    <td
                      key={c}
                      className="py-2.5 px-3 text-right border border-slate-200 dark:border-slate-800 transition"
                      style={{ backgroundColor: ratio > 0 ? `rgba(2, 132, 199, ${heatOpacity})` : undefined }}
                    >
                      {val !== 0 ? val.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
                    </td>
                  );
                })}
                <td className="py-2.5 px-3 text-right font-bold text-sky-600 dark:text-sky-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  {matrixData.rowTotals[r]?.toLocaleString(undefined, { maximumFractionDigits: 1 }) || '0'}
                </td>
              </tr>
            ))}
            {/* Column Totals Row */}
            <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
              <td className="py-3 px-4 font-sans border border-slate-200 dark:border-slate-700">
                Total ({aggregation.toUpperCase()})
              </td>
              {matrixData.colHeaders.map(c => (
                <td key={c} className="py-3 px-3 text-right border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400">
                  {matrixData.colTotals[c]?.toLocaleString(undefined, { maximumFractionDigits: 1 }) || '0'}
                </td>
              ))}
              <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950 border border-slate-200 dark:border-slate-700">
                {matrixData.grandTotal.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
