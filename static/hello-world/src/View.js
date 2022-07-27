import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
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
    console.log("findProject", findProject);
    const issueTypes = findProject?.issueTypes;
    console.log("issueTypes", issueTypes);
    if (context && projectName && issueTypes) {
      issueTypes.forEach((issue) => {
        invoke("getIssueCount", {
          projectName,
          issueType: issue.id,
        }).then((res) => {
          console.log("issue", issue.name, res.total, "added");
          setChartData((prev) => [
            ...prev,
            { name: issue.name, value: res.total },
          ]);
        });
      });
    }
  }, [context]);

  useEffect(() => {
    console.log("ChartData", chartData);
  }, [chartData]);

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
                {data01[index]?.name} ({value})
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
