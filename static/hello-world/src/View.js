import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
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

function View({ projects }) {
  const [context, setContext] = useState();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {}, []);

  useEffect(() => {
    view.getContext().then(setContext);
  }, []);

  useEffect(() => {
    const projectName = context?.extension?.gadgetConfiguration?.project?.value;
    const findProject = projects.find((e) => e.name == projectName);
    const issueTypes = findProject?.issueTypes;
    if (context && projectName && issueTypes) {
      issueTypes.forEach((issue, index) => {
        invoke("getIssueCount", {
          projectName,
          issueType: issue.id,
        }).then((res) => {
          setChartData((prev) => [
            ...prev,
            {
              name: issue.name,
              value: res.total,
              fill: COLORS[index % COLORS.length],
            },
          ]);
        });
      });
    }
  }, [context]);

  if (!context || chartData.length < 1) {
    return "Loading...";
  }

  const projectName =
    context?.extension?.gadgetConfiguration?.project?.value || projects[0].name;

  return (
    <div style={styles.container}>
      <div style={{ fontSize: 25 }}>{projectName}</div>
      <PieChart width={400} height={400}>
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
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
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
};
export default View;
