import { DataRow } from '../types/data';

export interface SampleDataset {
  name: string;
  description: string;
  category: string;
  rows: DataRow[];
}

export function generate100kRows(): DataRow[] {
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  const categories = ['Electronics', 'Software', 'Furniture', 'Apparel', 'Services'];
  const segments = ['Enterprise', 'SMB', 'Consumer', 'Government'];

  const rows: DataRow[] = [];
  const startDate = new Date('2025-01-01').getTime();
  const dayMs = 86400000;

  for (let i = 1; i <= 100000; i++) {
    const reg = regions[i % regions.length];
    const cat = categories[(i * 3) % categories.length];
    const seg = segments[(i * 7) % segments.length];
    const sales = Number((500 + (i % 950) * 12.5).toFixed(2));
    const qty = 1 + (i % 50);
    const rating = Number((3.0 + (i % 21) * 0.1).toFixed(1));
    const dateStr = new Date(startDate + (i % 365) * dayMs).toISOString().split('T')[0];

    rows.push({
      TransactionID: `TX-${100000 + i}`,
      Region: reg,
      Category: cat,
      Segment: seg,
      Sales: sales,
      Quantity: qty,
      Rating: rating,
      Date: dateStr
    });
  }

  return rows;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    name: 'Sales & Regional Revenue',
    description: 'Quarterly sales performance across regions, product categories, revenue, discounts, and customer ratings.',
    category: 'Retail & E-commerce',
    rows: [
      { Region: 'North America', Category: 'Electronics', Sales: 45200, Quantity: 120, Discount: 0.05, Date: '2026-01-15', Rating: 4.8, Satisfaction: 'High' },
      { Region: 'North America', Category: 'Furniture', Sales: 28400, Quantity: 65, Discount: 0.10, Date: '2026-01-20', Rating: 4.2, Satisfaction: 'Medium' },
      { Region: 'Europe', Category: 'Electronics', Sales: 51200, Quantity: 140, Discount: 0.08, Date: '2026-02-02', Rating: 4.6, Satisfaction: 'High' },
      { Region: 'Europe', Category: 'Apparel', Sales: 18900, Quantity: 210, Discount: 0.15, Date: '2026-02-11', Rating: 3.9, Satisfaction: 'Medium' },
      { Region: 'Asia Pacific', Category: 'Electronics', Sales: 64800, Quantity: 195, Discount: 0.02, Date: '2026-02-18', Rating: 4.9, Satisfaction: 'High' },
      { Region: 'Asia Pacific', Category: 'Furniture', Sales: 31500, Quantity: 80, Discount: 0.12, Date: '2026-03-01', Rating: 4.1, Satisfaction: 'Medium' },
      { Region: 'Latin America', Category: 'Apparel', Sales: 14200, Quantity: 175, Discount: 0.20, Date: '2026-03-05', Rating: 3.5, Satisfaction: 'Low' },
      { Region: 'Latin America', Category: 'Electronics', Sales: 22800, Quantity: 90, Discount: 0.05, Date: '2026-03-12', Rating: 4.3, Satisfaction: 'High' },
      { Region: 'North America', Category: 'Apparel', Sales: 29800, Quantity: 290, Discount: 0.10, Date: '2026-03-19', Rating: 4.0, Satisfaction: 'Medium' },
      { Region: 'Europe', Category: 'Furniture', Sales: 38700, Quantity: 95, Discount: 0.07, Date: '2026-03-24', Rating: 4.5, Satisfaction: 'High' },
      { Region: 'Asia Pacific', Category: 'Apparel', Sales: 27400, Quantity: 240, Discount: 0.18, Date: '2026-04-02', Rating: 3.8, Satisfaction: 'Medium' },
      { Region: 'Middle East', Category: 'Electronics', Sales: 39100, Quantity: 110, Discount: 0.04, Date: '2026-04-10', Rating: 4.7, Satisfaction: 'High' }
    ]
  },
  {
    name: 'Customer Experience Survey',
    description: 'Survey dataset tracking CSAT score, resolution time, NPS rating, feedback theme, and monthly spend.',
    category: 'Customer Support',
    rows: [
      { Segment: 'Enterprise', SupportChannel: 'Email', CSAT: 4.9, ResolutionHours: 1.2, NPS: 9, Sentiment: 'Positive', MonthlySpend: 4500, IssueCategory: 'Billing' },
      { Segment: 'SMB', SupportChannel: 'Chat', CSAT: 4.2, ResolutionHours: 3.5, NPS: 8, Sentiment: 'Positive', MonthlySpend: 850, IssueCategory: 'Integration' },
      { Segment: 'Enterprise', SupportChannel: 'Phone', CSAT: 4.7, ResolutionHours: 0.8, NPS: 10, Sentiment: 'Positive', MonthlySpend: 12000, IssueCategory: 'Feature Request' },
      { Segment: 'Consumer', SupportChannel: 'Chat', CSAT: 3.1, ResolutionHours: 8.4, NPS: 5, Sentiment: 'Neutral', MonthlySpend: 49, IssueCategory: 'Bug Report' },
      { Segment: 'SMB', SupportChannel: 'Email', CSAT: 3.8, ResolutionHours: 4.2, NPS: 7, Sentiment: 'Neutral', MonthlySpend: 1200, IssueCategory: 'Billing' },
      { Segment: 'Enterprise', SupportChannel: 'Chat', CSAT: 4.8, ResolutionHours: 1.5, NPS: 9, Sentiment: 'Positive', MonthlySpend: 8200, IssueCategory: 'Integration' },
      { Segment: 'Consumer', SupportChannel: 'Social', CSAT: 2.2, ResolutionHours: 14.1, NPS: 3, Sentiment: 'Negative', MonthlySpend: 29, IssueCategory: 'Performance' },
      { Segment: 'SMB', SupportChannel: 'Phone', CSAT: 4.5, ResolutionHours: 2.1, NPS: 8, Sentiment: 'Positive', MonthlySpend: 1500, IssueCategory: 'Feature Request' },
      { Segment: 'Consumer', SupportChannel: 'Chat', CSAT: 4.0, ResolutionHours: 2.9, NPS: 7, Sentiment: 'Positive', MonthlySpend: 99, IssueCategory: 'Onboarding' },
      { Segment: 'Enterprise', SupportChannel: 'Phone', CSAT: 5.0, ResolutionHours: 0.5, NPS: 10, Sentiment: 'Positive', MonthlySpend: 15000, IssueCategory: 'Onboarding' }
    ]
  },
  {
    name: 'Tableau-Scale Benchmark (100,000 Rows)',
    description: 'Ultra large synthetic dataset with 100,000 records to test Web Worker async processing and LTTB downsampling speed.',
    category: 'Big Data Benchmark',
    rows: [] // Loaded lazily via generator
  }
];
