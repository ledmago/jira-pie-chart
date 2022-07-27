import Resolver from "@forge/resolver";
import api, { storage, route } from "@forge/api";
const resolver = new Resolver();

resolver.define("getProjects", async ({ context, payload: { startAt } }) => {
  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/project/search?expand=description,lead,issueTypes,url,projectKeys,permissions,insight&startAt=${startAt}&maxResults=500`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
  const data = await response.json();
  return data;
});

resolver.define(
  "getIssueCount",
  async ({ context, payload: { projectName, issueType } }) => {
    const response = await api
      .asApp()
      .requestJira(
        route`/rest/api/3/search?jql=project=${projectName} AND issuetype=${issueType}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
    const data = await response.json();
    return data;
  }
);

resolver.define("getText", (req) => {
  console.log(req);

  return "Hello world!";
});

export const handler = resolver.getDefinitions();
