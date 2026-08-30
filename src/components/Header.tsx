import React from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Layers,
  FileText,
  Upload,
  Sun,
  Moon,
  Download,
  Sparkles,
  Grid,
  Menu,
  Zap,
  Printer,
  Image as ImageIcon
} from 'lucide-react';
import { SAMPLE_DATASETS } from '../utils/sampleData';

interface HeaderProps {
  activeTab: 'dashboard' | 'pivot' | 'quantitative' | 'qualitative' | 'report';
  setActiveTab: (tab: 'dashboard' | 'pivot' | 'quantitative' | 'qualitative' | 'report') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLoadSample: (sampleIndex: number) => void;
  onNewUpload: () => void;
  hasData: boolean;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onExportJPEG: () => void;
  onExportHTML: () => void;
  onToggleSidebar: () => void;
  totalRows: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onLoadSample,
  onNewUpload,
  hasData,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  onExportJPEG,
  onExportHTML,
  onToggleSidebar
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Sidebar Toggle */}
          <div className="flex items-center space-x-3">
            {hasData && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:block"
                title="Toggle Sidebar Drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewUpload}>
              <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl text-white shadow-md shadow-sky-500/20">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">AutoAnalytics</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                    <span>Tableau-Engine</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                  Web-Worker Powered • 100k+ Large Data Visualizer
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          {hasData && (
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('pivot')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'pivot'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-sky-500" />
                <span>Pivot Matrix</span>
              </button>

              <button
                onClick={() => setActiveTab('quantitative')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'quantitative'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Quantitative</span>
              </button>

              <button
                onClick={() => setActiveTab('qualitative')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'qualitative'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Qualitative</span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'report'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Report</span>
              </button>
            </nav>
          )}

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Quick Sample Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Samples</span>
              </button>
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block z-50">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Quick Load Demo Datasets
                </div>
                {SAMPLE_DATASETS.map((ds, idx) => (
                  <button
                    key={ds.name}
                    onClick={() => onLoadSample(idx)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
                  >
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{ds.name}</span>
                      {idx === 2 && <span className="text-[9px] bg-emerald-500 text-white font-mono px-1.5 py-0.5 rounded-full">100k Rows</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{ds.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {hasData && (
              <>
                <button
                  onClick={onNewUpload}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Push Data</span>
                </button>

                {/* Comprehensive Export Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition shadow-xs">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report &rarr;</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-1.5 hidden group-hover:block z-50">
                    <button
                      onClick={onExportExcel}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-2 font.semibold"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-bold">Excel Workbook (.xlsx)</div>
                        <div className="text-[10px] text-slate-400">Multi-sheet summary & dataset</div>
                      </div>
                    </button>
                    <button
                      onClick={onExportPDF}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-2 font-semibold"
                    >
                      <Printer className="w-4 h-4 text-rose-500" />
                      <div>
                        <div className="font-bold">PDF Document (.pdf)</div>
                        <div className="text-[10px] text-slate-400">Print-ready executive report</div>
                      </div>
                    </button>
                    <button
                      onClick={onExportJPEG}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-2 font-semibold"
                    >
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="font-bold">JPEG Image (.jpeg)</div>
                        <div className="text-[10px] text-slate-400">High-res canvas snapshot</div>
                      </div>
                    </button>
                    <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                    <button
                      onClick={onExportHTML}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-2 font-medium"
                    >
                      <FileText className="w-4 h-4 text-sky-500" />
                      <span>Export HTML Report</span>
                    </button>
                    <button
                      onClick={onExportCSV}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center space-x-2 font-medium"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                      <span>Export Raw CSV Data</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
