import React, { useState } from 'react';
import { Upload, FileCode, Sparkles, FileSpreadsheet, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataRow } from '../types/data';
import { SAMPLE_DATASETS } from '../utils/sampleData';

interface DataUploaderProps {
  onDataLoaded: (fileName: string, rows: DataRow[]) => void;
  onLoadSample: (index: number) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({ onDataLoaded, onLoadSample }) => {
  const [activeInput, setActiveInput] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (ext === 'csv' || ext === 'txt') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            onDataLoaded(fileName, results.data as DataRow[]);
          } else {
            setErrorMsg('Parsed CSV file contains no data rows.');
          }
        },
        error: (err) => {
          setErrorMsg(`CSV Parse Error: ${err.message}`);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json<DataRow>(worksheet);
          if (json && json.length > 0) {
            onDataLoaded(fileName, json);
          } else {
            setErrorMsg('Excel sheet is empty.');
          }
        } catch (err: any) {
          setErrorMsg(`Excel File Read Error: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onDataLoaded(fileName, parsed);
          } else if (typeof parsed === 'object') {
            onDataLoaded(fileName, [parsed]);
          } else {
            setErrorMsg('JSON file does not contain an array of data rows.');
          }
        } catch (err: any) {
          setErrorMsg(`Invalid JSON Syntax: ${err.message}`);
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMsg('Unsupported file format. Please upload CSV, XLSX, XLS, or JSON.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    Papa.parse(pastedText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          onDataLoaded('Pasted_Data.csv', results.data as DataRow[]);
        } else {
          setErrorMsg('Could not parse tabular rows from pasted text.');
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Welcome Banner */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-5xl">
          Automated Data Analysis & Custom Dashboards
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Push your data file or select a sample dataset. We'll automatically profile metrics, generate interactive charts, sort qualitative & quantitative lists, and build exportable reports.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveInput('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeInput === 'upload'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
            <button
              onClick={() => setActiveInput('paste')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeInput === 'paste'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Paste Data</span>
            </button>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
            Supports CSV, Excel (.xlsx), & JSON
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Upload Mode */}
        {activeInput === 'upload' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
              isDragging
                ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          >
            <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Drag & Drop your dataset here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              or browse from your local computer
            </p>
            <label className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition cursor-pointer shadow-md">
              <span>Select CSV / Excel / JSON File</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Paste Mode */}
        {activeInput === 'paste' && (
          <div>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste comma-separated (CSV) or tab-separated data here..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleParsePastedText}
                disabled={!pastedText.trim()}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition disabled:opacity-50"
              >
                <span>Analyze Pasted Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instant 1-Click Sample Datasets */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Or Start Instantly with Sample Datasets</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_DATASETS.map((ds, idx) => (
            <div
              key={ds.name}
              onClick={() => onLoadSample(idx)}
              className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 rounded-2xl p-5 transition shadow-sm hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {ds.category}
                  </span>
                  <FileSpreadsheet className="w-5 h-5 text-sky-500 group-hover:scale-110 transition" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {ds.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {ds.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-medium text-sky-600 dark:text-sky-400">
                <span>{ds.rows.length} Data Rows</span>
                <span className="group-hover:translate-x-1 transition flex items-center">
                  Load & Analyze &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
