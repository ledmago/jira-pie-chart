import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import View from "./View";
import Configration from "./Edit";
import Warning from "./Warning";

function App() {
  const [context, setContext] = useState();
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);

  const getProjectsPagination = (page) => {
    invoke("getProjects", { startAt: 0 }).then((response) => {
      setProjects((prev) => [...prev, ...response.values]);
      if (response.isLast == false) {
        getProjectsPagination(page + 1);
      }
    });
  };

  const getFiltersPagination = (page) => {
    invoke("getFilters").then((response) => {
      console.log(response.values);
      setFilters((prev) => [...prev, ...response.values]);
      if (response.isLast == false) {
        getFiltersPagination(page + 1);
      }
    });
  };

  useEffect(() => {
    view.getContext().then(setContext);
    getProjectsPagination(0);
    getFiltersPagination(0);
  }, []);

  if (!context) {
    return "Loading... Main" + projects.length;
  }

  return context.extension.entryPoint === "edit" ? (
    <Configration projects={projects} filters={filters} />
  ) : !context?.extension?.gadgetConfiguration?.selectedSourceOrFilter ||
    !context?.extension?.gadgetConfiguration?.chartBy ||
    !context?.extension?.gadgetConfiguration?.chartType ? (
    <Warning />
  ) : (
    <View projects={projects} filters={filters} />
  );
}

export default App;
