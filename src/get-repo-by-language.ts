import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../../.env" });

import { error } from "./utils/globals";

import { fetchReposByLanguage } from "./utils/getRepoByLanguage";
import { octokit } from "./utils/octokit";

import { Octokit } from "./utils/octokitTypes";

async function start() {
  try {
    const client = (await octokit()) as Octokit;
    await fetchReposByLanguage(client);
  } catch (err) {
    error(err);
    return err;
  }
  return "success";
}

start();
