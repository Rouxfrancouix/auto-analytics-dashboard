import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DataUploader } from './components/DataUploader';
import { Dashboard } from './components/Dashboard';
import { PivotTable } from './components/PivotTable';
import { QuantitativeList } from './components/QuantitativeList';
import { QualitativeList } from './components/QualitativeList';
import { ReportView } from './components/ReportView';
import { ColumnCastModal } from './components/ColumnCastModal';

import { DatasetAnalysis, ChartConfig, FilterState, DataRow, ColumnType } from './types/data';
import { profileDataset } from './utils/dataProfiler';
import { SAMPLE_DATASETS, generate100kRows } from './utils/sampleData';
import {
  printReport,
  exportToExcelWorkbook,
  exportElementToJPEG,
  exportDatasetToCSV,
  downloadHTMLReport
} from './utils/exportUtils';

export function App() {
  const [analysis, setAnalysis] = useState<DatasetAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pivot' | 'quantitative' | 'qualitative' | 'report'>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCastModalOpen, setIsCastModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing Dataset...');

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategories: {},
    numericRanges: {}
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDataLoaded = (fileName: string, rows: DataRow[]) => {
    setIsLoading(true);
    setLoadingText(`Profiling ${rows.length.toLocaleString()} records via Web Worker...`);

    setTimeout(() => {
      const profiled = profileDataset(fileName, rows);
      setAnalysis(profiled);
      setCharts(profiled.defaultCharts);
      setFilters({
        searchTerm: '',
        selectedCategories: {},
        numericRanges: {}
      });
      setIsLoading(false);
      setActiveTab('dashboard');
    }, 50);
  };

  const handleLoadSample = (index: number) => {
    if (index === 2) {
      // 100,000 Row Tableau Benchmark
      setIsLoading(true);
      setLoadingText('Generating 100,000 Synthetic Enterprise Rows...');
      setTimeout(() => {
        const rows = generate100kRows();
        handleDataLoaded('Tableau_Benchmark_100k.csv', rows);
      }, 50);
    } else {
      const ds = SAMPLE_DATASETS[index];
      if (ds) {
        handleDataLoaded(`${ds.name}.csv`, ds.rows);
      }
    }
  };

  const handleNewUpload = () => {
    setAnalysis(null);
    setCharts([]);
  };

  const handleUpdateColumnType = (colName: string, newType: ColumnType) => {
    if (!analysis) return;
    setAnalysis(prev => {
      if (!prev) return null;
      const updatedCols = prev.columns.map(c => {
        if (c.name === colName) {
          return { ...c, type: newType };
        }
        return c;
      });

      return {
        ...prev,
        columns: updatedCols,
        quantColumns: updatedCols.filter(c => c.type === 'quantitative'),
        qualColumns: updatedCols.filter(c => c.type === 'qualitative'),
        dateColumns: updatedCols.filter(c => c.type === 'date')
      };
    });
  };

  const handleAddCalculatedField = (
    fieldName: string,
    formulaColA: string,
    operator: '*' | '/' | '+' | '-',
    formulaColB: string | number
  ) => {
    if (!analysis || !analysis.rows) return;

    const newRows = analysis.rows.map(row => {
      const valA = Number(row[formulaColA]) || 0;
      const valB = typeof formulaColB === 'number' ? formulaColB : (Number(row[formulaColB]) || 0);

      let result = 0;
      if (operator === '*') result = valA * valB;
      else if (operator === '/') result = valB !== 0 ? valA / valB : 0;
      else if (operator === '+') result = valA + valB;
      else if (operator === '-') result = valA - valB;

      return {
        ...row,
        [fieldName]: Number(result.toFixed(2))
      };
    });

    handleDataLoaded(analysis.fileName, newRows);
  };

  // Real-time filtered rows
  const filteredRows = useMemo(() => {
    if (!analysis || !analysis.rows) return [];

    return analysis.rows.filter(row => {
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matches = Object.values(row).some(val =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(term)
        );
        if (!matches) return false;
      }

      for (const [colName, selectedValues] of Object.entries(filters.selectedCategories)) {
        if (selectedValues && selectedValues.length > 0) {
          const rowVal = String(row[colName] ?? '');
          if (!selectedValues.includes(rowVal)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [analysis, filters]);

  const handleExportJPEG = () => {
    if (!analysis) return;
    exportElementToJPEG('executive-report-canvas', `${analysis.fileName.replace(/\.[^/.]+$/, '')}_Report`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLoadSample={handleLoadSample}
        onNewUpload={handleNewUpload}
        hasData={!!analysis}
        onExportCSV={() => analysis && exportDatasetToCSV(analysis)}
        onExportExcel={() => analysis && exportToExcelWorkbook(analysis)}
        onExportPDF={printReport}
        onExportJPEG={handleExportJPEG}
        onExportHTML={() => analysis && downloadHTMLReport(analysis)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        totalRows={analysis?.totalRows || 0}
      />

      <div className="flex-1 flex">
        {/* Sidebar Drawer */}
        <Sidebar
          analysis={analysis}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenCastModal={() => setIsCastModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${
          analysis && isSidebarOpen ? 'lg:pl-72' : ''
        }`}>
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{loadingText}</h3>
                <p className="text-xs text-slate-400">High-performance Web Worker background computation</p>
              </div>
            </div>
          )}

          {!analysis ? (
            <DataUploader
              onDataLoaded={handleDataLoaded}
              onLoadSample={handleLoadSample}
            />
          ) : (
            <div>
              {activeTab === 'dashboard' && (
                <Dashboard
                  analysis={analysis}
                  charts={charts}
                  setCharts={setCharts}
                  filteredRows={filteredRows}
                  filters={filters}
                  setFilters={setFilters}
                  onOpenCastModal={() => setIsCastModalOpen(true)}
                />
              )}

              {activeTab === 'pivot' && (
                <PivotTable
                  columns={analysis.columns}
                  rows={filteredRows}
                />
              )}

              {activeTab === 'quantitative' && (
                <QuantitativeList
                  quantColumns={analysis.quantColumns}
                  onOpenCastModal={() => setIsCastModalOpen(true)}
                />
              )}

              {activeTab === 'qualitative' && (
                <QualitativeList qualColumns={analysis.qualColumns} />
              )}

              {activeTab === 'report' && (
                <ReportView
                  analysis={analysis}
                  charts={charts}
                  filteredRows={filteredRows}
                  onPrint={printReport}
                  onExportExcel={() => exportToExcelWorkbook(analysis)}
                  onExportJPEG={handleExportJPEG}
                  onExportHTML={() => downloadHTMLReport(analysis)}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Column Type & Calculation Modal */}
      {analysis && (
        <ColumnCastModal
          isOpen={isCastModalOpen}
          onClose={() => setIsCastModalOpen(false)}
          columns={analysis.columns}
          onUpdateColumnType={handleUpdateColumnType}
          onAddCalculatedField={handleAddCalculatedField}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden">
        AutoAnalytics Engine • Comprehensive Export Suite (Excel, PDF, JPEG, CSV, HTML)
      </footer>
    </div>
  );
}

export default App;
