const core = require("@actions/core");
const github = require("@actions/github");
const { Configuration, OpenAIApi } = require("openai");

(async function () {
  try {
    const apiKey = core.getInput("openai-api-key");
    const githubToken = core.getInput("github-token");

    const octokit = github.getOctokit(githubToken);

    const issue = await octokit.rest.issues.get({ ...github.context.issue });
    core.info(JSON.stringify({...issue}))
    const labels = await octokit.rest.issues.listLabelsForRepo({
      ...github.context.repo,
    });

    const prompt = `
    You have a role to manage a GitHub repository. Given an issue information (subject and body), choose suitable labels to it from the labels available for the repository.

    Use the following format:
    LABELS: "the names of the chosen labels, each name must not be surrounded double quotes, separated by a comma"

    Only use the following labels:
    \`\`\`
    ${JSON.stringify(labels, null, 2)}
    \`\`\`

    ## ISSUE ##
    SUBJECT: ${issue.title}
    BODY: ${issue.body}
  `;
    core.debug(`Prompt: ${prompt}`);

    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
    });

    core.debug(`Completion: ${completion.data.choices[0].text}`);
  } catch (error) {
    core.setFailed(`Error Message: ${error.stack}`);
  }
})();
