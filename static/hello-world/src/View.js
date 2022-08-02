import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import Select from "@atlaskit/select";
import moment from "moment";
import "./table.css";
import { LoadingButton } from "@atlaskit/button";
const COLORS = [
  "#B270A2",
  "#7DCE13",
  "#0F3D3E",
  "#876445",
  "#411530",
  "#81CACF",
  "#003865",
  "#395B64",
  "#3D3C42",
  "#D61C4E",
];

function View({ projects, filters, setSelectedFilter, selectedFilter }) {
  const [context, setContext] = useState();
  const [issues, setIssues] = useState(null);
  const [chartData, setChartData] = useState([]);

  const chartBy = context?.extension?.gadgetConfiguration?.chartBy;
  const selectedSourceOrFilter =
    context?.extension?.gadgetConfiguration?.selectedSourceOrFilter;

  useEffect(() => {
    view.getContext().then(setContext);
  }, []);

  //Todo : 1. artık props olarak değil direkt context üzerinden geliyor.

  const chartDataHandler = (issues) => {
    if (!issues || !chartBy || !selectedSourceOrFilter) return;
    const key = chartBy?.value;
    const field = chartBy?.field;

    const chartFields = issues.map((e, index) => {
      const val = field
        ? e?.versionedRepresentations[key][1][field]
        : e?.versionedRepresentations[key][1];
      const name = chartBy?.pipeline ? chartBy?.pipeline(val) : val;

      return {
        name: name,
        value: 0,
        fill: COLORS[index % COLORS.length],
      };
    });
    let chartData = [];
    chartFields.forEach((element, index) => {
      const findNumber = chartFields.filter((q) => q.name == element.name);
      element.value = findNumber.length;
      if (chartData.findIndex((q) => q.name == element.name) < 0)
        chartData.push({ ...element, value: findNumber.length });
    });
    //TODO : burayı unique yap
    setChartData(chartData);
  };

  const totalChartValue = chartData
    ? chartData.reduce((acc, obj) => acc + obj?.value || 0, 0)
    : 0;

  useEffect(() => {
    if (context) {
      invoke("getIssues", {
        projectName:
          selectedSourceOrFilter?.type == "projects"
            ? selectedSourceOrFilter.value
            : "",
        jql:
          selectedSourceOrFilter?.type == "filters"
            ? selectedSourceOrFilter?.jql
                .replace("&gt;", ">")
                ?.replace("$lt;", "<")
            : "",
      })
        .then((res) => {
          setIssues(res.issues);
          chartDataHandler(res.issues);
        })
        .catch((e) => console.log("HATA", e));
    }
  }, [context, selectedFilter]);

  if (!context) {
    return "Loading...";
  }
  const projectName = context?.extension?.gadgetConfiguration?.project?.value;

  return (
    <div>
      {!issues && <>Loading...</>}
      {issues && (
        <div style={styles.container}>
          <div
            style={{
              fontSize: 17,
              marginTop: 10,
              alignSelf: "end",
            }}
          >
            {projectName}
          </div>
          {chartData.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <PieChart width={300} height={400}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    // eslint-disable-next-line
                    const radius =
                      25 + innerRadius + (outerRadius - innerRadius);
                    // eslint-disable-next-line
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    // eslint-disable-next-line
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#8884d8"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                      >
                        {chartData[index]?.name} ({value})
                      </text>
                    );
                  }}
                />
              </PieChart>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>{chartBy.label}</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  {chartData.map((item) => (
                    <tr className="hoverable">
                      <td>{item.name}</td>
                      <td>{item.value}</td>
                      <td>
                        {((item.value * 100) / totalChartValue).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                  <tr
                    style={{ borderTop: "1px solid #CCC", fontWeight: "bold" }}
                  >
                    <td>Total</td>
                    <td>{totalChartValue}</td>
                    <td>100%</td>
                  </tr>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  colm: {
    width: "45%",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
};
export default View;
