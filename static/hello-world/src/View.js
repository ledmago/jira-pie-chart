import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import Select from "@atlaskit/select";
import moment from "moment";
import "./table.css";
import { router } from "@forge/bridge";
import { LoadingButton } from "@atlaskit/button";
import { chartByTypes } from "./Utils";

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
import Chart from "./Chart";

function View({ projects, filters, setSelectedFilter, selectedFilter }) {
  const [context, setContext] = useState();
  const [issues, setIssues] = useState(null);
  const [chartData, setChartData] = useState([]);

  const chartBy = chartByTypes.find(
    (e) => e.value == context?.extension?.gadgetConfiguration?.chartBy.value
  );
  const selectedSourceOrFilter =
    context?.extension?.gadgetConfiguration?.selectedSourceOrFilter;

  const jqlLink = context?.siteUrl + "/issues/?jql=";
  useEffect(() => {
    view.getContext().then(setContext);
  }, []);

  //Todo : 1. artık props olarak değil direkt context üzerinden geliyor.

  const chartDataHandler = (issues) => {
    if (!issues || !chartBy || !selectedSourceOrFilter) return;
    const key = chartBy?.value;
    const field = chartBy?.field;

    const chartFields = issues.map((e, index) => {
      let val = null;
      if (e?.versionedRepresentations[key][1]) {
        val = field
          ? e?.versionedRepresentations[key][1][field]
          : e?.versionedRepresentations[key][1];
      }
      const name = chartBy?.pipeline ? chartBy?.pipeline(val) : val;
      return {
        name: name,
        key: e.key,
        value: 0,
        fill: COLORS[index % COLORS.length],
      };
    });
    let chartData = [];
    chartFields.forEach((element, index) => {
      const findNumber = chartFields.filter((q) => q.name == element.name);
      element.value = findNumber.length;
      if (chartData.findIndex((q) => q.name == element.name) < 0)
        chartData.push({
          ...element,
          value: findNumber.length,
          keys: findNumber.map((e) => e.key),
        });
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
          console.log("ISS", res);
          setIssues(res.issues);
          chartDataHandler(res.issues);
        })
        .catch((e) => console.log("HATA", e));
    }
  }, [context, selectedFilter]);

  if (!context) {
    return "Loading...2";
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
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Chart
                chartBy={chartBy}
                chartData={chartData}
                chartType={context?.extension?.gadgetConfiguration?.chartType}
              />
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>{chartBy.label}</th>
                      <th>Issues</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  {chartData.map((item) => (
                    <tr className="hoverable">
                      <td>{item.name}</td>
                      <td>
                        <div
                          style={{ color: "blue", cursor: "pointer" }}
                          onClick={() =>
                            router.open(
                              `${jqlLink}${
                                selectedSourceOrFilter?.type == "projects"
                                  ? '(project IN ("' +
                                    selectedSourceOrFilter.value +
                                    '")) '
                                  : '(filter IN ("' +
                                    selectedSourceOrFilter.value +
                                    '"))'
                              } AND (key in (${item?.keys?.join(",")}))`
                            )
                          }
                        >
                          {item.value}
                        </div>
                      </td>
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
