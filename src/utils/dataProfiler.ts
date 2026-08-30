import {
  DataRow,
  ColumnProfile,
  ColumnType,
  QuantitativeStats,
  QualitativeStats,
  DateStats,
  DatasetAnalysis,
  ReportConfig
} from '../types/data';
import { generateDefaultCharts } from './chartAutoGenerator';

export function profileDataset(fileName: string, rawRows: DataRow[]): DatasetAnalysis {
  if (!rawRows || rawRows.length === 0) {
    return {
      fileName,
      rows: [],
      columns: [],
      totalRows: 0,
      totalColumns: 0,
      quantColumns: [],
      qualColumns: [],
      dateColumns: [],
      defaultCharts: [],
      report: {
        title: 'Data Analysis Report',
        subtitle: 'Automated Insight Summary',
        author: 'AutoAnalytics Engine',
        executiveSummary: 'No data available for analysis.',
        keyFindings: [],
        recommendations: []
      }
    };
  }

  // Sanitize rows: drop completely empty rows
  const rows = rawRows.filter(row => row && Object.values(row).some(v => v !== null && v !== undefined && v !== ''));

  // Get all unique keys across rows
  const keysSet = new Set<string>();
  rows.forEach(r => Object.keys(r).forEach(k => keysSet.add(k)));
  const columnNames = Array.from(keysSet);

  const columns: ColumnProfile[] = columnNames.map(colName => {
    const values = rows.map(r => r[colName]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const totalCount = rows.length;
    const missingCount = totalCount - nonNullValues.length;
    const uniqueValues = Array.from(new Set(nonNullValues));
    const uniqueCount = uniqueValues.length;
    const sampleValues = nonNullValues.slice(0, 5);

    // Determine type
    let numberCount = 0;
    let dateCount = 0;

    nonNullValues.forEach(val => {
      if (typeof val === 'number') {
        numberCount++;
      } else if (typeof val === 'string') {
        const cleaned = val.replace(/[\$,%]/g, '').trim();
        if (cleaned !== '' && !isNaN(Number(cleaned))) {
          numberCount++;
        } else if (!isNaN(Date.parse(val)) && (val.includes('-') || val.includes('/') || val.length >= 8)) {
          dateCount++;
        }
      }
    });

    const nonNullLength = nonNullValues.length || 1;
    const isNumeric = (numberCount / nonNullLength) > 0.6;
    const isDate = !isNumeric && (dateCount / nonNullLength) > 0.6;

    let type: ColumnType = 'qualitative';
    if (isNumeric) type = 'quantitative';
    else if (isDate) type = 'date';

    let quantStats: QuantitativeStats | undefined;
    let qualStats: QualitativeStats | undefined;
    let dateStats: DateStats | undefined;

    if (type === 'quantitative') {
      const numVals = nonNullValues
        .map(v => typeof v === 'number' ? v : Number(String(v).replace(/[\$,%]/g, '')))
        .filter(v => !isNaN(v));

      if (numVals.length > 0) {
        numVals.sort((a, b) => a - b);
        const min = numVals[0];
        const max = numVals[numVals.length - 1];
        const sum = numVals.reduce((acc, curr) => acc + curr, 0);
        const mean = sum / numVals.length;
        
        const median = numVals.length % 2 === 0
          ? (numVals[numVals.length / 2 - 1] + numVals[numVals.length / 2]) / 2
          : numVals[Math.floor(numVals.length / 2)];

        const variance = numVals.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / numVals.length;
        const stdDev = Math.sqrt(variance);

        quantStats = { min, max, mean, median, stdDev, sum, variance };
      }
    } else if (type === 'qualitative') {
      const frequencies: Record<string, number> = {};
      nonNullValues.forEach(v => {
        const strVal = String(v).trim();
        frequencies[strVal] = (frequencies[strVal] || 0) + 1;
      });

      let topCategory = 'N/A';
      let topCount = 0;

      Object.entries(frequencies).forEach(([cat, count]) => {
        if (count > topCount) {
          topCategory = cat;
          topCount = count;
        }
      });

      qualStats = { frequencies, topCategory, topCount };
    } else if (type === 'date') {
      const sortedDates = nonNullValues
        .map(v => String(v))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      dateStats = {
        minDate: sortedDates[0] || 'N/A',
        maxDate: sortedDates[sortedDates.length - 1] || 'N/A'
      };
    }

    return {
      name: colName,
      type,
      sampleValues,
      totalCount,
      missingCount,
      uniqueCount,
      quantStats,
      qualStats,
      dateStats
    };
  });

  const quantColumns = columns.filter(c => c.type === 'quantitative');
  const qualColumns = columns.filter(c => c.type === 'qualitative');
  const dateColumns = columns.filter(c => c.type === 'date');

  const defaultCharts = generateDefaultCharts(columns);

  // Auto generate initial report text
  const report: ReportConfig = {
    title: `${fileName.replace(/\.[^/.]+$/, '')} Executive Analysis Report`,
    subtitle: `Automated Dataset Audit & Dynamic Dashboard`,
    author: 'AutoAnalytics Engine',
    executiveSummary: `Analysis completed for dataset "${fileName}" containing ${rows.length.toLocaleString()} rows and ${columns.length} attributes (${quantColumns.length} quantitative, ${qualColumns.length} qualitative, ${dateColumns.length} temporal).`,
    keyFindings: [
      `Dataset consists of ${rows.length} records with ${columns.length} columns.`,
      quantColumns.length > 0
        ? `Primary numeric metric "${quantColumns[0].name}" ranges from ${quantColumns[0].quantStats?.min.toLocaleString()} to ${quantColumns[0].quantStats?.max.toLocaleString()} (Average: ${quantColumns[0].quantStats?.mean.toFixed(2)}).`
        : 'No primary quantitative metrics found.',
      qualColumns.length > 0
        ? `Most frequent category in "${qualColumns[0].name}" is "${qualColumns[0].qualStats?.topCategory}" (${qualColumns[0].qualStats?.topCount} occurrences).`
        : 'No qualitative categorical distributions identified.'
    ],
    recommendations: [
      'Monitor key metric variance across high-frequency categories.',
      'Explore correlation between quantitative variables using the custom chart builder.',
      'Use interactive filters to narrow down subsets for deep-dive report exports.'
    ]
  };

  return {
    fileName,
    rows,
    columns,
    totalRows: rows.length,
    totalColumns: columns.length,
    quantColumns,
    qualColumns,
    dateColumns,
    defaultCharts,
    report
  };
}
