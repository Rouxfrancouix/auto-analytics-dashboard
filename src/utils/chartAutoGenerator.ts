import { ColumnProfile, ChartConfig } from '../types/data';

const CHART_COLORS = [
  '#0284c7', // Sky blue
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#14b8a6', // Teal
];

export function generateDefaultCharts(columns: ColumnProfile[]): ChartConfig[] {
  const quant = columns.filter(c => c.type === 'quantitative');
  const qual = columns.filter(c => c.type === 'qualitative');
  const dates = columns.filter(c => c.type === 'date');

  const charts: ChartConfig[] = [];

  // Chart 1: Categorical vs Primary Quantitative (Bar Chart)
  if (qual.length > 0 && quant.length > 0) {
    charts.push({
      id: 'auto-bar-1',
      title: `${quant[0].name} by ${qual[0].name}`,
      type: 'bar',
      xAxisKey: qual[0].name,
      yAxisKey: quant[0].name,
      aggregation: 'sum',
      color: CHART_COLORS[0],
      description: `Total ${quant[0].name} aggregated across top ${qual[0].name} categories.`
    });
  }

  // Chart 2: Time Series (Line Chart) or 2nd Categorical Bar
  if (dates.length > 0 && quant.length > 0) {
    charts.push({
      id: 'auto-line-1',
      title: `${quant[0].name} Trend Over Time`,
      type: 'line',
      xAxisKey: dates[0].name,
      yAxisKey: quant[0].name,
      aggregation: 'avg',
      color: CHART_COLORS[1],
      description: `Average ${quant[0].name} timeline over ${dates[0].name}.`
    });
  } else if (qual.length > 1 && quant.length > 0) {
    charts.push({
      id: 'auto-bar-2',
      title: `${quant[0].name} Breakdown by ${qual[1].name}`,
      type: 'bar',
      xAxisKey: qual[1].name,
      yAxisKey: quant[0].name,
      aggregation: 'sum',
      color: CHART_COLORS[1],
      description: `Distribution of ${quant[0].name} by ${qual[1].name}.`
    });
  }

  // Chart 3: Proportional Share (Pie / Donut Chart)
  if (qual.length > 0) {
    const mainQual = qual[0];
    const mainQuant = quant.length > 0 ? quant[0] : null;
    charts.push({
      id: 'auto-pie-1',
      title: `${mainQual.name} Composition`,
      type: 'pie',
      xAxisKey: mainQual.name,
      yAxisKey: mainQuant ? mainQuant.name : mainQual.name,
      aggregation: mainQuant ? 'sum' : 'count',
      color: CHART_COLORS[2],
      description: `Percentage share distribution of ${mainQual.name}.`
    });
  }

  // Chart 4: Correlation (Scatter Plot or 2nd Metric Bar/Area)
  if (quant.length >= 2) {
    charts.push({
      id: 'auto-scatter-1',
      title: `${quant[1].name} vs ${quant[0].name} Correlation`,
      type: 'scatter',
      xAxisKey: quant[0].name,
      yAxisKey: quant[1].name,
      color: CHART_COLORS[3],
      description: `Relationship comparison between ${quant[0].name} and ${quant[1].name}.`
    });
  } else if (quant.length === 1 && qual.length > 0) {
    charts.push({
      id: 'auto-area-1',
      title: `Average ${quant[0].name} by ${qual[0].name}`,
      type: 'area',
      xAxisKey: qual[0].name,
      yAxisKey: quant[0].name,
      aggregation: 'avg',
      color: CHART_COLORS[4],
      description: `Mean ${quant[0].name} across ${qual[0].name}.`
    });
  }

  return charts;
}
