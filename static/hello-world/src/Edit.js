import React, { useState } from "react";
import Form, { Field } from "@atlaskit/form";
import TextField from "@atlaskit/textfield";
import Button, { ButtonGroup } from "@atlaskit/button";
import { view } from "@forge/bridge";
import Select from "@atlaskit/select";

const chartByTypes = [
  { label: "Issue Type", value: "issuetype", field: "name" },
  { label: "Priority", value: "priority", field: "name" },
  { label: "Status", value: "status", field: "name" },
  { label: "Project", value: "project", field: "name" },
  { label: "Reporter", value: "reporter", field: "displayName" },
  {
    label: "Assignee",
    value: "assignee",
    pipeline: (data) => (data ? data.displayName : "None"),
  },
  {
    label: "Created",
    value: "created",
    pipeline: (data) => moment(data).format("DD/MM/YYYY"),
  },
];

function Configration({ projects, filters }) {
  const onSubmit = () => {
    if (!selectedSourceOrFilter || !selectedSource || !chartBy) {
      return;
    }
    const formData = {
      selectedSourceOrFilter,
      selectedSource,
      chartBy,
    };
    view.submit(formData);
  };

  const [context, setContext] = useState();

  const [selectedSource, setSelectedSource] = useState();
  const [selectedSourceOrFilter, setSelectedSourceFilter] = useState();
  const [chartBy, setChartBy] = useState();

  React.useEffect(() => {
    view.getContext().then(setContext);
  }, []);
  React.useEffect(() => {
    if (context) {
      setSelectedSource(
        context?.extension?.gadgetConfiguration?.selectedSource
      );
      setSelectedSourceFilter(
        context?.extension?.gadgetConfiguration?.selectedSourceOrFilter
      );
      setChartBy(context?.extension?.gadgetConfiguration?.chartBy);
    }
  }, [context]);

  return (
    <div style={{ minHeight: 300 }}>
      <>
        <div
          style={{
            ...styles.filterContainer,
            justifyContent: "flex-start",
          }}
        >
          <div
            style={{
              ...styles.column,
              width: 20 + "%",
              marginRight: 15,
            }}
          >
            <Select
              inputId="single-select-example"
              className="single-select"
              classNamePrefix="react-select"
              options={[
                { label: "Project", value: "projects" },
                { label: "Filters", value: "filters" },
              ]}
              placeholder="Choose a source"
              value={selectedSource}
              onChange={(selected) => setSelectedSource(selected)}
            />
          </div>
          <div style={styles.column}>
            <Select
              inputId="single-select-example"
              className="single-select"
              classNamePrefix="react-select"
              value={selectedSourceOrFilter}
              options={
                selectedSource?.value == "projects"
                  ? projects.map((e) => ({
                      value: e.name,
                      label: e.name,
                      type: "projects",
                    }))
                  : selectedSource?.value == "filters"
                  ? filters.map((e) => ({
                      label: e.name,
                      value: e.id,
                      jql: e.jql,
                      type: "filters",
                    }))
                  : [{ label: "Loading...", value: "loading" }]
              }
              onChange={(selectedSourceOrFilter) => {
                setSelectedSourceFilter(selectedSourceOrFilter);
              }}
              placeholder="Choose a project or filter"
            />
          </div>
        </div>
        <div style={{ ...styles.column, marginTop: 20 }}>
          <Select
            inputId="single-select-example"
            className="single-select"
            classNamePrefix="react-select"
            options={chartByTypes}
            value={chartBy}
            onChange={(selected) => setChartBy(selected)}
            placeholder="Chart By"
          />
        </div>
      </>
      <br />
      <ButtonGroup>
        <Button type="submit" onClick={onSubmit}>
          Save
        </Button>
        <Button appearance="subtle" onClick={view.close}>
          Cancel
        </Button>
      </ButtonGroup>
    </div>
  );
}
const styles = {
  column: {
    width: "45%",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
};

export default Configration;
