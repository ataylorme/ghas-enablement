import { inform, error } from "./globals";

import { createReposListFile } from "./writeToFile";

import { Octokit } from "./octokitTypes";

import { listOrgReposParameters, listOrgReposResponse } from "./octokitTypes";

export const fetchReposByUser = async (octokit: Octokit): Promise<response> => {
  try {
    const requestParams = {
      type: "all",
      per_page: 100,
      org: process.env.GITHUB_ORG,
    } as listOrgReposParameters;

    const repos = (await octokit.paginate(
      "GET /orgs/{org}/repos",
      requestParams,
      (response: listOrgReposResponse) =>
        response.data.map((repo) => {
          const permission = repo.permissions ? repo.permissions.admin : false;
          if (permission) {
            return {
              enableDependabot: false,
              repo: repo.name,
            };
          }
          return {};
        })
    )) as usersWriteAdminReposArray;

    inform(repos);

    const arr = repos.filter(
      (repo) => Object.keys(repo).length !== 0
    ) as usersWriteAdminReposArray;

    inform(arr);

    await createReposListFile(arr);

    inform(`
      Please review the generated list found in the repos.json file.
      By default, Dependabot is disabled. You can enable it by changing false to true next to the repos you would like Dependabot enabled for in the repos.json file.
    `);

    return { status: 200, message: "sucess" };
  } catch (err) {
    error(err);
    throw err;
  }
};
