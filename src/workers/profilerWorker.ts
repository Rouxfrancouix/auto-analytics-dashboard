import { DataRow, ColumnProfile, ColumnType, QuantitativeStats, QualitativeStats, DateStats } from '../types/data';

self.onmessage = (e: MessageEvent<{ fileName: string; rows: DataRow[] }>) => {
  const { fileName, rows } = e.data;

  if (!rows || rows.length === 0) {
    self.postMessage({ success: false, error: 'Dataset is empty.' });
    return;
  }

  try {
    const keysSet = new Set<string>();
    // Collect all column keys from up to first 500 rows for speed
    const sampleSize = Math.min(rows.length, 500);
    for (let i = 0; i < sampleSize; i++) {
      if (rows[i]) {
        Object.keys(rows[i]).forEach(k => keysSet.add(k));
      }
    }
    const columnNames = Array.from(keysSet);

    const columns: ColumnProfile[] = columnNames.map(colName => {
      let missingCount = 0;
      const nonNullValues: any[] = [];
      const frequencies: Record<string, number> = {};

      let numberCount = 0;
      let dateCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const val = rows[i][colName];
        if (val === null || val === undefined || val === '') {
          missingCount++;
        } else {
          nonNullValues.push(val);

          // Type check
          if (typeof val === 'number') {
            numberCount++;
          } else if (typeof val === 'string') {
            const cleaned = val.replace(/[\$,%]/g, '').trim();
            if (cleaned !== '' && !isNaN(Number(cleaned))) {
              numberCount++;
            } else if (!isNaN(Date.parse(val)) && (val.includes('-') || val.includes('/') || val.length >= 8)) {
              dateCount++;
            }

            // Frequency tracking
            if (nonNullValues.length <= 50000) {
              frequencies[val] = (frequencies[val] || 0) + 1;
            }
          }
        }
      }

      const totalCount = rows.length;
      const uniqueCount = Object.keys(frequencies).length || new Set(nonNullValues.slice(0, 10000)).size;
      const sampleValues = nonNullValues.slice(0, 5);

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
        const numVals: number[] = [];
        for (let i = 0; i < nonNullValues.length; i++) {
          const v = nonNullValues[i];
          const num = typeof v === 'number' ? v : Number(String(v).replace(/[\$,%]/g, ''));
          if (!isNaN(num)) numVals.push(num);
        }

        if (numVals.length > 0) {
          numVals.sort((a, b) => a - b);
          const min = numVals[0];
          const max = numVals[numVals.length - 1];
          const sum = numVals.reduce((acc, curr) => acc + curr, 0);
          const mean = sum / numVals.length;

          const median = numVals.length % 2 === 0
            ? (numVals[numVals.length / 2 - 1] + numVals[numVals.length / 2]) / 2
            : numVals[Math.floor(numVals.length / 2)];

          let varianceSum = 0;
          for (let i = 0; i < numVals.length; i++) {
            varianceSum += Math.pow(numVals[i] - mean, 2);
          }
          const variance = varianceSum / numVals.length;
          const stdDev = Math.sqrt(variance);

          quantStats = { min, max, mean, median, stdDev, sum, variance };
        }
      } else if (type === 'qualitative') {
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
          .slice(0, 1000)
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

    self.postMessage({
      success: true,
      fileName,
      columns,
      totalRows: rows.length
    });
  } catch (err: any) {
    self.postMessage({ success: false, error: err.message || 'Worker processing error' });
  }
};
