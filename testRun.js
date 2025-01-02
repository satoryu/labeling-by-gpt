import { proposeLabels } from "./ai.js";
import dotenv from "dotenv";
dotenv.config();

export async function run() {
  const issues = [
    {
      title: "This is a test issue",
      body: "This is a test issue body"
    },
    {
      title: "This is new coolest feature request",
      body: "This is the most incredible feature request you've never seen"
    },
    {
      title: "This product has a bug",
      body: "this product does not work what I expected."
    }
  ];
  const availableLabels = {
    data: [
      {
        name: "bug",
        description: "This label is for bugs"
      },
      {
        name: "enhancement",
        description: "This label is for enhancements"
      },
      {
        name: "question",
        description: "This label is for questions"
      }
    ]
  };
  const apiKey = process.env.OPENAI_API_KEY;

  const labels = await Promise.all(issues.map((issue) => (proposeLabels(issue, availableLabels.data, { apiKey, logger: console }))))

  console.log(labels);
}

await run();