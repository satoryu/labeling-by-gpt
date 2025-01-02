import * as core from "@actions/core";
import * as github from "@actions/github";
import { proposeLabels } from "./ai.js";

try {
  const apiKey = core.getInput("openai-api-key");
  const githubToken = core.getInput("github-token");

  const octokit = github.getOctokit(githubToken);

  const issue = await octokit.rest.issues.get({
    ...github.context.issue,
    issue_number: github.context.issue.number,
  });
  const availableLabels = await octokit.rest.issues.listLabelsForRepo({
    ...github.context.repo,
  });

  const labels = await proposeLabels(issue.data, availableLabels.data, { apiKey, logger: core } );
  core.debug(labels)

  if (labels.length > 0) {
    await octokit.rest.issues.setLabels({
      owner: github.context.issue.owner,
      repo: github.context.issue.repo,
      issue_number: github.context.issue.number,
      labels
    })
  } else {
    core.setFailed('Failed to propose labels')
  }
} catch (error) {
  core.setFailed(`Error Message: ${error.stack}`);
}
