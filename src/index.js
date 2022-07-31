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

resolver.define("getFilters", async ({ context, payload }) => {
  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/filter/search?expand=description,owner,jql,viewUrl,searchUrl,favourite,favouritedCount,sharePermissions,editPermissions,isWritable,subscriptions`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

  return await response.json();
});

resolver.define(
  "getIssues",
  async ({ context, payload: { projectName, jql } }) => {
    const response = await api
      .asApp()
      .requestJira(
        route`/rest/api/3/search?expand=operations,versionedRepresentations,editmeta,changelog,customfield_10010.requestTypePractice,renderedFields&jql=project=${projectName} ${jql}`,
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
