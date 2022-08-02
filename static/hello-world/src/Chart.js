import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line, Chart } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement
);
const backgroundColor = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
];
const borderColor = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
];
const BarChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: false,
    },
  },
};

export default function ChartData({ chartData, chartType, chartBy }) {
  console.log("chartData", chartData);
  const newData = {
    labels: chartData.map((e) => e.name),
    datasets: [
      {
        label: "Count",
        data: chartData.map((e) => e.value),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div
      style={{
        width: "65%",
        maxWidth: 400,
        minHeight: 400,
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      {chartType == "pieChart" && (
        <Pie options={{ responsive: true }} data={newData} />
      )}
      {chartType == "barChart" && (
        <Bar options={BarChartOptions} data={newData} />
      )}
      {chartType == "horizontalBarChart" && (
        <Bar options={{ ...BarChartOptions, indexAxis: "y" }} data={newData} />
      )}

      {chartType == "lineChart" && (
        <Line options={BarChartOptions} data={newData} />
      )}
    </div>
  );
}
