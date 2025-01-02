import OpenAI from 'openai';

export async function proposeLabels(issue, availableLabels, { apiKey = null, logger = console }) {
  const system_prompt = `
    You have a role to manage a GitHub repository. Given an issue information (subject and body), choose suitable labels to it from the labels available for the repository.

    Use the following format:
    LABELS: "the names of the chosen labels, each name must not be surrounded double quotes, separated by a comma"

    Only use the following labels:
    \`\`\`
    ${JSON.stringify(availableLabels, null, 2)}
    \`\`\`
  `

  const user_prompt = `
    ## ISSUE ##
    SUBJECT: ${issue.title}
    BODY: ${issue.body}
  `;

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: user_prompt }
    ],
    temperature: 0,
  });
  logger.debug(completion.choices[0].message.content);

  let labels = /LABELS\: (.+)/g.exec(completion.choices[0].message.content)
  labels = labels[1].trim().split(/,\s*/)

  return labels
}