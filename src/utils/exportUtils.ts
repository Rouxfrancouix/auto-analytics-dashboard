import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { DatasetAnalysis } from '../types/data';

// 1. PDF Export via Print Engine
export function printReport() {
  window.print();
}

// 2. Multi-Sheet Excel Workbook Export (.xlsx)
export function exportToExcelWorkbook(dataset: DatasetAnalysis) {
  if (!dataset || !dataset.rows || dataset.rows.length === 0) return;

  const workbook = XLSX.utils.book_new();

  // Sheet 1: Executive Summary & Overview
  const summaryData = [
    ['DOCUMENT METADATA'],
    ['Report Title', dataset.report.title],
    ['Subtitle', dataset.report.subtitle],
    ['Author', dataset.report.author],
    ['File Name', dataset.fileName],
    ['Export Date', new Date().toLocaleDateString()],
    ['Total Records', dataset.totalRows],
    ['Total Attributes', dataset.totalColumns],
    [],
    ['EXECUTIVE SUMMARY'],
    [dataset.report.executiveSummary],
    [],
    ['KEY FINDINGS'],
    ...dataset.report.keyFindings.map(f => [`• ${f}`]),
    [],
    ['STRATEGIC RECOMMENDATIONS'],
    ...dataset.report.recommendations.map(r => [`• ${r}`])
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

  // Sheet 2: Quantitative Statistical Audit
  if (dataset.quantColumns.length > 0) {
    const quantRows = dataset.quantColumns.map(col => ({
      'Attribute Name': col.name,
      'Total Sum': col.quantStats?.sum ?? 'N/A',
      'Average (Mean)': col.quantStats?.mean ?? 'N/A',
      'Median': col.quantStats?.median ?? 'N/A',
      'Minimum': col.quantStats?.min ?? 'N/A',
      'Maximum': col.quantStats?.max ?? 'N/A',
      'Standard Deviation': col.quantStats?.stdDev ?? 'N/A',
      'Missing Values': col.missingCount
    }));
    const quantSheet = XLSX.utils.json_to_sheet(quantRows);
    XLSX.utils.book_append_sheet(workbook, quantSheet, 'Quantitative Audit');
  }

  // Sheet 3: Qualitative Frequency Distribution
  if (dataset.qualColumns.length > 0) {
    const qualRows: any[] = [];
    dataset.qualColumns.forEach(col => {
      const freqs = col.qualStats?.frequencies || {};
      Object.entries(freqs).forEach(([cat, count]) => {
        qualRows.push({
          'Attribute Name': col.name,
          'Category Value': cat || '(Blank)',
          'Frequency Count': count,
          'Share (%)': Number(((count / (col.totalCount || 1)) * 100).toFixed(2))
        });
      });
    });
    const qualSheet = XLSX.utils.json_to_sheet(qualRows);
    XLSX.utils.book_append_sheet(workbook, qualSheet, 'Qualitative Frequencies');
  }

  // Sheet 4: Full Raw Dataset
  const rawSheet = XLSX.utils.json_to_sheet(dataset.rows);
  XLSX.utils.book_append_sheet(workbook, rawSheet, 'Full Raw Data');

  // Trigger Download
  const baseName = dataset.fileName.replace(/\.[^/.]+$/, '');
  XLSX.writeFile(workbook, `${baseName}_Executive_Report.xlsx`);
}

// 3. High-Resolution JPEG Image Export (.jpeg)
export async function exportElementToJPEG(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution crisp image
      useCORS: true,
      backgroundColor: '#0f172a' // Dark sleek theme or white background
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${fileName}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('JPEG Export error:', err);
  }
}

// 4. Standalone CSV Export
export function exportDatasetToCSV(dataset: DatasetAnalysis) {
  if (!dataset.rows || dataset.rows.length === 0) return;

  const headers = Object.keys(dataset.rows[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  dataset.rows.forEach(row => {
    const values = headers.map(header => {
      const val = row[header];
      const str = val === null || val === undefined ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${dataset.fileName.replace(/\.[^/.]+$/, '')}_export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 5. Standalone HTML Report Export
export function downloadHTMLReport(dataset: DatasetAnalysis) {
  const { report, quantColumns, qualColumns, totalRows, totalColumns, fileName } = dataset;

  const quantHtml = quantColumns.map(col => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${col.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.quantStats?.mean.toFixed(2) ?? 'N/A'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.quantStats?.median.toFixed(2) ?? 'N/A'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.quantStats?.min.toLocaleString() ?? 'N/A'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.quantStats?.max.toLocaleString() ?? 'N/A'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.quantStats?.stdDev.toFixed(2) ?? 'N/A'}</td>
    </tr>
  `).join('');

  const qualHtml = qualColumns.map(col => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${col.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.uniqueCount}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.qualStats?.topCategory ?? 'N/A'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${col.qualStats?.topCount ?? 0}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${report.title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.6; }
        h1 { color: #0284c7; margin-bottom: 4px; }
        h2 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 6px; margin-top: 32px; }
        .meta { color: #64748b; font-size: 0.9em; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { text-align: left; padding: 10px 8px; background: #f8fafc; border-bottom: 2px solid #cbd5e1; }
        .box { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px; margin: 16px 0; border-radius: 4px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 6px; }
      </style>
    </head>
    <body>
      <h1>${report.title}</h1>
      <div class="meta">${report.subtitle} | Author: ${report.author} | File: ${fileName} | ${new Date().toLocaleDateString()}</div>
      
      <div class="box">
        <h3>Executive Summary</h3>
        <p>${report.executiveSummary}</p>
      </div>

      <h2>Dataset Metrics</h2>
      <p>Total Records: <strong>${totalRows.toLocaleString()}</strong> | Total Attributes: <strong>${totalColumns}</strong></p>

      <h2>Quantitative Attributes Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Mean</th>
            <th>Median</th>
            <th>Min</th>
            <th>Max</th>
            <th>Std Dev</th>
          </tr>
        </thead>
        <tbody>
          ${quantHtml}
        </tbody>
      </table>

      <h2>Qualitative & Categorical Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Unique Categories</th>
            <th>Top Category</th>
            <th>Top Category Frequency</th>
          </tr>
        </thead>
        <tbody>
          ${qualHtml}
        </tbody>
      </table>

      <h2>Key Findings</h2>
      <ul>
        ${report.keyFindings.map(f => `<li>${f}</li>`).join('')}
      </ul>

      <h2>Strategic Recommendations</h2>
      <ul>
        ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName.replace(/\.[^/.]+$/, '')}_report.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
