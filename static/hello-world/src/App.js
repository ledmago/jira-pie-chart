import React, { useEffect, useState } from "react";
import { view, invoke } from "@forge/bridge";
import View from "./View";
import Configration from "./Edit";

function App() {
  const [context, setContext] = useState();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const getProjectsPagination = (page) => {
    invoke("getProjects", { startAt: 0 }).then((response) => {
      console.log("PROJECTS", response.values);
      setProjects((prev) => [...prev, ...response.values]);
      if (response.isLast == false) {
        getProjectsPagination(page + 1);
      }
    });
  };

  useEffect(() => {
    view.getContext().then(setContext);
    getProjectsPagination(0);
  }, []);

  if (!context || projects.length < 1) {
    return "Loading...";
  }

  return context.extension.entryPoint === "edit" ? (
    <Configration projects={projects} setSelectedProject={setSelectedProject} />
  ) : (
    <View projects={projects} />
  );
}

export default App;
