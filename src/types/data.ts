export type ColumnType = 'quantitative' | 'qualitative' | 'date';

export interface QuantitativeStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  sum: number;
  variance: number;
}

export interface QualitativeStats {
  frequencies: Record<string, number>;
  topCategory: string;
  topCount: number;
}

export interface DateStats {
  minDate: string;
  maxDate: string;
}

export interface ColumnProfile {
  name: string;
  type: ColumnType;
  sampleValues: any[];
  totalCount: number;
  missingCount: number;
  uniqueCount: number;
  quantStats?: QuantitativeStats;
  qualStats?: QualitativeStats;
  dateStats?: DateStats;
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter';
export type AggregationMode = 'sum' | 'avg' | 'count' | 'min' | 'max';

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  xAxisKey: string;
  yAxisKey: string;
  aggregation?: AggregationMode;
  color?: string;
  description?: string;
}

export interface ReportConfig {
  title: string;
  subtitle: string;
  author: string;
  executiveSummary: string;
  keyFindings: string[];
  recommendations: string[];
}

export interface FilterState {
  searchTerm: string;
  selectedCategories: Record<string, string[]>;
  numericRanges: Record<string, { min: number; max: number }>;
}

export type DataRow = Record<string, any>;

export interface DatasetAnalysis {
  fileName: string;
  rows: DataRow[];
  columns: ColumnProfile[];
  totalRows: number;
  totalColumns: number;
  quantColumns: ColumnProfile[];
  qualColumns: ColumnProfile[];
  dateColumns: ColumnProfile[];
  defaultCharts: ChartConfig[];
  report: ReportConfig;
}
