/**
 * Largest-Triangle-Three-Buckets (LTTB) Downsampling algorithm
 * Reduces high-frequency data series (e.g. 100,000+ points) down to a manageable target count
 * while preserving visual trends, peaks, and troughs.
 */
export function lttbDownsample<T extends { x: number; y: number }>(data: T[], threshold: number): T[] {
  if (threshold >= data.length || threshold <= 0) {
    return data;
  }

  const sampled: T[] = [];
  const bucketSize = (data.length - 2) / (threshold - 2);

  let a = 0;
  sampled.push(data[a]);

  for (let i = 0; i < threshold - 2; i++) {
    let avgX = 0;
    let avgY = 0;
    let avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    let avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    avgRangeEnd = avgRangeEnd < data.length ? avgRangeEnd : data.length;

    const avgRangeLength = avgRangeEnd - avgRangeStart;

    for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
      avgX += data[avgRangeStart].x;
      avgY += data[avgRangeStart].y;
    }

    avgX /= avgRangeLength || 1;
    avgY /= avgRangeLength || 1;

    let rangeOffs = Math.floor(i * bucketSize) + 1;
    const rangeTo = Math.floor((i + 1) * bucketSize) + 1;

    const pointAX = data[a].x;
    const pointAY = data[a].y;

    let maxArea = -1;
    let maxAreaPoint = rangeOffs;

    for (; rangeOffs < rangeTo; rangeOffs++) {
      const area = Math.abs(
        (pointAX - avgX) * (data[rangeOffs].y - pointAY) -
        (pointAX - data[rangeOffs].x) * (avgY - pointAY)
      ) * 0.5;

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = rangeOffs;
      }
    }

    sampled.push(data[maxAreaPoint]);
    a = maxAreaPoint;
  }

  sampled.push(data[data.length - 1]);
  return sampled;
}

/**
 * Bucketed Categorical Downsampling
 * Groups category rows into top N categories and bundles remaining into "Other"
 */
export function downsampleCategories(
  data: { name: string; value: number }[],
  maxCategories: number = 12
): { name: string; value: number }[] {
  if (data.length <= maxCategories) return data;

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, maxCategories - 1);
  const rest = sorted.slice(maxCategories - 1);

  const otherSum = rest.reduce((acc, curr) => acc + curr.value, 0);

  if (otherSum > 0) {
    top.push({ name: 'Other Categories', value: Number(otherSum.toFixed(2)) });
  }

  return top;
}
