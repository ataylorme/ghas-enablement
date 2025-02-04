import { owner, inform, error } from "./globals";

import { Octokit } from "./octokitTypes";

import {
  createVulnerabilityAlertsParameters,
  createVulnerabilityAlertsResponse,
  listVulnerabilityAlertsResponse,
  listVulnerabilityAlertsParameters,
} from "./octokitTypes";

const checkVulnerabilityAlertsStatus = async (
  requestParams: listVulnerabilityAlertsParameters,
  octokit: Octokit
): Promise<response> => {
  try {
    const { status } = (await octokit.request(
      "GET /repos/{owner}/{repo}/vulnerability-alerts",
      requestParams
    )) as listVulnerabilityAlertsResponse;
    const message = status === 204 ? "Enabled" : ("Not-Enabled" as string);
    return { status, message } as response;
  } catch (err) {
    error(
      `Problem checking if Dependabot is enabled on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};

export const enableDependabotAlerts = async (
  repo: string,
  octokit: Octokit
): Promise<response> => {
  const requestParams = {
    owner,
    repo,
    mediaType: {
      previews: ["dorian"],
    },
  } as createVulnerabilityAlertsParameters;

  const { status, message } = (await checkVulnerabilityAlertsStatus(
    requestParams,
    octokit
  )) as response;

  inform(`Is Dependabot enabled already for ${repo}? : ${message}`);

  if (status === 204) {
    return { status, message: "Repository already had Dependabot Enabled" };
  }

  try {
    const { status } = (await octokit.request(
      "PUT /repos/{owner}/{repo}/vulnerability-alerts",
      requestParams
    )) as createVulnerabilityAlertsResponse;
    inform(`Enabled Dependabot for ${repo}. Status: ${status}`);
    return { status, message: "Enabled" } as response;
  } catch (err) {
    error(
      `Problem enabling Dependabot on the following repository: ${requestParams.repo}. The error was: ${err}`
    );
    throw err;
  }
};
