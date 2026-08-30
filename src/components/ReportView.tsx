import React, { useState } from 'react';
import { Printer, Download, Plus, Trash2, Edit2, FileText, CheckCircle2, AlertCircle, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { DatasetAnalysis, ReportConfig, ChartConfig, DataRow } from '../types/data';
import { ChartCard } from './ChartCard';

interface ReportViewProps {
  analysis: DatasetAnalysis;
  charts: ChartConfig[];
  filteredRows: DataRow[];
  onPrint: () => void;
  onExportExcel: () => void;
  onExportJPEG: () => void;
  onExportHTML: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  analysis,
  charts,
  filteredRows,
  onPrint,
  onExportExcel,
  onExportJPEG,
  onExportHTML
}) => {
  const [report, setReport] = useState<ReportConfig>(analysis.report);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [newFinding, setNewFinding] = useState('');
  const [newRec, setNewRec] = useState('');

  const handleAddFinding = () => {
    if (!newFinding.trim()) return;
    setReport(prev => ({
      ...prev,
      keyFindings: [...prev.keyFindings, newFinding.trim()]
    }));
    setNewFinding('');
  };

  const handleRemoveFinding = (index: number) => {
    setReport(prev => ({
      ...prev,
      keyFindings: prev.keyFindings.filter((_, i) => i !== index)
    }));
  };

  const handleAddRecommendation = () => {
    if (!newRec.trim()) return;
    setReport(prev => ({
      ...prev,
      recommendations: [...prev.recommendations, newRec.trim()]
    }));
    setNewRec('');
  };

  const handleRemoveRecommendation = (index: number) => {
    setReport(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Export Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl print:hidden shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>Executive Report Formatting & Export Suite</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize summary text, key findings, and recommendations. Export to Excel, PDF, or JPEG.
          </p>
        </div>

        {/* 1-Click Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>PDF (.pdf)</span>
          </button>

          <button
            onClick={onExportJPEG}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-xs"
          >
            <ImageIcon className="w-4 h-4" />
            <span>JPEG (.jpeg)</span>
          </button>

          <button
            onClick={onExportHTML}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>
        </div>
      </div>

      {/* Report Document Canvas */}
      <div
        id="executive-report-canvas"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 shadow-lg space-y-8 print:shadow-none print:border-none print:p-0"
      >
        {/* Document Header */}
        <div className="border-b-2 border-sky-600 pb-6">
          <input
            type="text"
            value={report.title}
            onChange={(e) => setReport(prev => ({ ...prev, title: e.target.value }))}
            className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 focus:outline-none tracking-tight"
          />
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <input
              type="text"
              value={report.subtitle}
              onChange={(e) => setReport(prev => ({ ...prev, subtitle: e.target.value }))}
              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
            />
            <span>•</span>
            <input
              type="text"
              value={`Author: ${report.author}`}
              onChange={(e) => setReport(prev => ({ ...prev, author: e.target.value.replace('Author: ', '') }))}
              className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:outline-none"
            />
            <span>•</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>File: {analysis.fileName}</span>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="bg-sky-50/60 dark:bg-sky-950/30 border-l-4 border-sky-600 rounded-r-2xl p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider">
              Executive Summary
            </h3>
            <button
              onClick={() => setIsEditingSummary(!isEditingSummary)}
              className="p-1 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900 rounded transition print:hidden"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {isEditingSummary ? (
            <textarea
              rows={4}
              value={report.executiveSummary}
              onChange={(e) => setReport(prev => ({ ...prev, executiveSummary: e.target.value }))}
              className="w-full text-xs bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {report.executiveSummary}
            </p>
          )}
        </div>

        {/* Dataset Key Statistics Summary Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            1. Key Quantitative Attributes Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  <th className="py-2.5 px-3">Metric Name</th>
                  <th className="py-2.5 px-3">Average (Mean)</th>
                  <th className="py-2.5 px-3">Median</th>
                  <th className="py-2.5 px-3">Min</th>
                  <th className="py-2.5 px-3">Max</th>
                  <th className="py-2.5 px-3">Total Sum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {analysis.quantColumns.map(col => (
                  <tr key={col.name}>
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">{col.name}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{col.quantStats?.mean.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{col.quantStats?.median.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{col.quantStats?.min.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-slate-500">{col.quantStats?.max.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-emerald-600 font-semibold">{col.quantStats?.sum.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Embedded Charts Section */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            2. Visual Analytics & Dashboard Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {charts.slice(0, 4).map(config => (
              <ChartCard
                key={config.id}
                config={config}
                data={filteredRows}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Key Findings List */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            3. Automated Key Findings
          </h3>
          <ul className="space-y-2">
            {report.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{finding}</span>
                </div>
                <button
                  onClick={() => handleRemoveFinding(idx)}
                  className="text-slate-400 hover:text-rose-500 transition ml-2 print:hidden"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-2 pt-2 print:hidden">
            <input
              type="text"
              value={newFinding}
              onChange={(e) => setNewFinding(e.target.value)}
              placeholder="Add custom finding bullet point..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleAddFinding}
              className="px-3 py-1.5 rounded-xl bg-sky-600 text-white font-semibold text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Finding</span>
            </button>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            4. Strategic Recommendations
          </h3>
          <ul className="space-y-2">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start justify-between bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-3 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
                <button
                  onClick={() => handleRemoveRecommendation(idx)}
                  className="text-slate-400 hover:text-rose-500 transition ml-2 print:hidden"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-2 pt-2 print:hidden">
            <input
              type="text"
              value={newRec}
              onChange={(e) => setNewRec(e.target.value)}
              placeholder="Add strategic recommendation bullet..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleAddRecommendation}
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Recommendation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
