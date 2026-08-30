import React, { useState } from 'react';
import { X, RefreshCcw, Plus, Check } from 'lucide-react';
import { ColumnProfile, ColumnType, DataRow } from '../types/data';

interface ColumnCastModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnProfile[];
  onUpdateColumnType: (colName: string, newType: ColumnType) => void;
  onAddCalculatedField: (fieldName: string, formulaColA: string, operator: '*' | '/' | '+' | '-', formulaColB: string | number) => void;
}

export const ColumnCastModal: React.FC<ColumnCastModalProps> = ({
  isOpen,
  onClose,
  columns,
  onUpdateColumnType,
  onAddCalculatedField
}) => {
  const [activeTab, setActiveTab] = useState<'cast' | 'calc'>('cast');

  // Calculated Field state
  const [calcName, setCalcName] = useState('');
  const [colA, setColA] = useState(columns.find(c => c.type === 'quantitative')?.name || columns[0]?.name || '');
  const [operator, setOperator] = useState<'*' | '/' | '+' | '-'>('*');
  const [colB, setColB] = useState(columns.find(c => c.type === 'quantitative' && c.name !== colA)?.name || '10');

  if (!isOpen) return null;

  const handleCreateCalculatedField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcName.trim()) return;
    onAddCalculatedField(calcName.trim(), colA, operator, isNaN(Number(colB)) ? colB : Number(colB));
    setCalcName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('cast')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'cast'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Cast Data Types
            </button>
            <button
              onClick={() => setActiveTab('calc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'calc'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              + Calculated Field
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {activeTab === 'cast' ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-500">
              Override data field classifications if a quantitative metric was detected as qualitative text.
            </p>
            <div className="space-y-2">
              {columns.map(col => (
                <div
                  key={col.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{col.name}</span>
                    <span className="text-[10px] text-slate-400 block">Sample: {col.sampleValues.slice(0, 2).join(', ')}</span>
                  </div>

                  <div className="flex space-x-1">
                    {(['quantitative', 'qualitative', 'date'] as ColumnType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => onUpdateColumnType(col.name, t)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg capitalize font-semibold transition ${
                          col.type === t
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCalculatedField} className="space-y-4">
            <p className="text-xs text-slate-500">
              Create a new mathematical column by multiplying, dividing, adding, or subtracting existing attributes.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Field Name</label>
              <input
                type="text"
                value={calcName}
                onChange={(e) => setCalcName(e.target.value)}
                placeholder="e.g. Net Revenue or Profit Margin"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Metric A</label>
                <select
                  value={colA}
                  onChange={(e) => setColA(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Operator</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="*">* (Multiply)</option>
                  <option value="/">/ (Divide)</option>
                  <option value="+">+ (Add)</option>
                  <option value="-">- (Subtract)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Metric B or Value</label>
                <input
                  type="text"
                  value={colB}
                  onChange={(e) => setColB(e.target.value)}
                  placeholder="Metric or constant number"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
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
                Create Field
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
