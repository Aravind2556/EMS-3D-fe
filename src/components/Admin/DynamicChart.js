import React from "react";
import ReactApexChart from "react-apexcharts";

/**
 * Build an array of data points.
 * Each point contains:
 *   - x: the provided category (time string)
 *   - y: the numerical value
 *   - isOutOfRange: true if y is outside the [minRange, maxRange]
 */
const generateDataPoints = (minRange, maxRange, yAxis, xAxis) => {
  return yAxis.map((y, index) => ({
    x: xAxis[index],
    y,
    isOutOfRange: y < minRange || y > maxRange,
  }));
};

/**
 * Identify continuous segments where points are out-of-range.
 * To maintain continuity, the segment includes the point immediately
 * before the out-of-range block (if available) and the point immediately
 * after it ends.
 */
const getOutOfRangeSegments = (data) => {
  const segments = [];
  let currentSegment = [];
  data.forEach((point, index) => {
    if (point.isOutOfRange) {
      // Start new segment: include previous point for continuity.
      if (currentSegment.length === 0 && index > 0) {
        currentSegment.push(data[index - 1]);
      }
      currentSegment.push(point);
      // If last point is out-of-range, push the segment.
      if (index === data.length - 1) {
        segments.push(currentSegment);
      }
    } else {
      // If an out-of-range segment was in progress, finish it by adding
      // the current point (for a smooth transition) and push the segment.
      if (currentSegment.length > 0) {
        currentSegment.push(point);
        segments.push(currentSegment);
        currentSegment = [];
      }
    }
  });
  return segments;
};

const LineChart = ({ minRange, maxRange, yAxis, xAxis, title, lineColor }) => {
  // Generate the complete data set.
  const data = generateDataPoints(minRange, maxRange, yAxis, xAxis);

  // Base series: a continuous line for all points using your provided color.
  const baseSeries = {
    name: title,
    data: data.map((pt) => ({ x: pt.x, y: pt.y })),
    color: lineColor,
  };

  // Get overlay segments for out-of-range portions.
  const redSegments = getOutOfRangeSegments(data);
  const overlaySeries = redSegments.map((segment, idx) => ({
    name: `Overlay-${idx}`, // This series will be hidden from the legend.
    data: segment.map((pt) => ({ x: pt.x, y: pt.y })),
    color: "#FF0000", // Red color for out-of-range segments.
    showInLegend: false, // Hide from legend.
    dataLabels: { enabled: false },
    markers: { size: 0 },
    stroke: { curve: "smooth", width: 3 },
  }));

  const options = {
    chart: {
      type: "line",
      height: 300,
      animations: { enabled: false },
    },
    title: {
      text: title,
      align: "center",
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      // Using a category axis since your x-axis values are time strings.
      type: "category",
      categories: xAxis,
    },
    yaxis: {
      min: Math.min(...yAxis) - 5,
      max: Math.max(...yAxis) + 5,
    },
    legend: {
      show: true, // Only the base series will appear in the legend.
    },
  };

  // Combine the base series with the overlay segments.
  const series = [baseSeries, ...overlaySeries];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" height={300} />
    </div>
  );
};

export default LineChart;
