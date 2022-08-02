const chartByTypes = [
  { label: "Issue Type", value: "issuetype", field: "name" },
  { label: "Priority", value: "priority", field: "name" },
  { label: "Status", value: "status", field: "name" },
  { label: "Project", value: "project", field: "name" },
  { label: "Reporter", value: "reporter", field: "displayName" },
  {
    label: "Assignee",
    value: "assignee",
    pipeline: (data) => (data ? data.displayName : "Unassigned"),
  },
  {
    label: "Created",
    value: "created",
    pipeline: (data) => moment(data).format("DD/MM/YYYY"),
  },
  {
    label: "Creator",
    value: "creator",
    field: "displayName",
  },
  {
    label: "Resolved2",
    value: "resolution",
    pipeline: (data) => (data?.name == "Done" ? "Resolved" : "Unresolved"),
  },
];

export { chartByTypes };
