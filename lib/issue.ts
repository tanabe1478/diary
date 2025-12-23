import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export type Issue = {
  number: number;
  title: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    html_url: string;
  };
  body: string;
  bodyHTML: string;
};

export type IssueComment = {
  id: number;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    html_url: string;
  };
  body: string;
  bodyHTML: string;
};

const dataDirectoryPath = process.env.DATA_DIRECTORY_PATH || "./data";

export async function getIssue({
  issueNumber,
}: {
  issueNumber: number;
}): Promise<Issue> {
  const filePath = `${dataDirectoryPath}/issues/${issueNumber}/issue.md`;
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  const issueMatter = matter(content);
  const body = issueMatter.content;
  const bodyHTML = await renderMarkdown(body);
  return {
    body,
    bodyHTML,
    ...issueMatter.data,
  } as Issue;
}

export async function listIssues(): Promise<Omit<Issue, "bodyHTML">[]> {
  const paths = await glob(`${dataDirectoryPath}/issues/*/issue.md`);
  return paths
    .map((filePath) => {
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;
      return {
        body,
        ...issueMatter.data,
      } as Omit<Issue, "bodyHTML">;
    })
    .sort(byCreatedAt)
    .reverse();
}

export async function listIssueComments({
  issueNumber,
}: {
  issueNumber: number;
}): Promise<IssueComment[]> {
  const paths = await glob(
    `${dataDirectoryPath}/issues/${issueNumber}/issue_comments/*.md`,
  );
  const issueComments = await Promise.all(
    paths.map(async (filePath: string) => {
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;
      const bodyHTML = await renderMarkdown(body);
      return {
        body,
        bodyHTML,
        ...issueMatter.data,
      } as IssueComment;
    }),
  );
  return issueComments.sort(byCreatedAt);
}

function byCreatedAt(a: any, b: any) {
  if (a.created_at < b.created_at) {
    return -1;
  } else if (a.created_at > b.created_at) {
    return 1;
  } else {
    return 0;
  }
}

async function renderMarkdown(content: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: process.env.GITHUB_REPOSITORY || "github/dummy",
    })
    .use(remarkRehype)
    .use(rehypeStringify);

  const result = await processor.process(content);
  return result.toString();
}
