#!/usr/bin/env tsx

/**
 * Sync GitHub Issues to Markdown files
 *
 * This script fetches all issues and their comments from the GitHub repository
 * and saves them as markdown files with front matter in the data/ directory.
 *
 * Usage:
 *   GITHUB_TOKEN=xxx npm run sync-issues
 *   GITHUB_TOKEN=xxx GITHUB_REPOSITORY=owner/repo npm run sync-issues
 */

import { Octokit } from "@octokit/rest";
import * as fs from "fs-extra";
import * as path from "path";
import matter from "gray-matter";

// Configuration from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "tanabe1478/diary";
const DATA_DIR = process.env.DATA_DIR || "data";

if (!GITHUB_TOKEN) {
  console.error("Error: GITHUB_TOKEN environment variable is required");
  process.exit(1);
}

const [owner, repo] = GITHUB_REPOSITORY.split("/");
if (!owner || !repo) {
  console.error(`Error: Invalid GITHUB_REPOSITORY format: ${GITHUB_REPOSITORY}`);
  console.error("Expected format: owner/repo");
  process.exit(1);
}

// Initialize Octokit client
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

interface Issue {
  number: number;
  title: string;
  body: string | null;
  [key: string]: any;
}

interface Comment {
  id: number;
  body: string | null;
  [key: string]: any;
}

/**
 * Save issue or comment as markdown file with front matter
 */
function saveAsMarkdown(filePath: string, data: Issue | Comment, body: string): void {
  // Create a copy of data without the body field
  const { body: _body, ...frontMatter } = data;

  // Generate markdown content
  const content = matter.stringify(body || "", frontMatter);

  // Ensure directory exists
  fs.ensureDirSync(path.dirname(filePath));

  // Write file
  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * Fetch all issues from the repository
 */
async function fetchIssues(): Promise<Issue[]> {
  console.log(`Fetching issues from ${owner}/${repo}...`);

  const issues: Issue[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: "all",
      per_page: perPage,
      page,
    });

    if (response.data.length === 0) {
      break;
    }

    // Filter out pull requests (they also appear in issues API)
    const actualIssues = response.data.filter((issue) => !issue.pull_request);
    issues.push(...(actualIssues as Issue[]));

    console.log(`  Fetched page ${page}: ${actualIssues.length} issues`);

    if (response.data.length < perPage) {
      break;
    }

    page++;
  }

  console.log(`Total issues fetched: ${issues.length}`);
  return issues;
}

/**
 * Fetch all comments for an issue
 */
async function fetchComments(issueNumber: number): Promise<Comment[]> {
  const comments: Comment[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: perPage,
      page,
    });

    if (response.data.length === 0) {
      break;
    }

    comments.push(...(response.data as Comment[]));

    if (response.data.length < perPage) {
      break;
    }

    page++;
  }

  return comments;
}

/**
 * Sync a single issue
 */
async function syncIssue(issue: Issue): Promise<void> {
  const issueDir = path.join(DATA_DIR, "issues", issue.number.toString());
  const issueFile = path.join(issueDir, "issue.md");

  // Save issue
  console.log(`  Syncing issue #${issue.number}: ${issue.title}`);
  saveAsMarkdown(issueFile, issue, issue.body || "");

  // Fetch and save comments
  if (issue.comments > 0) {
    console.log(`    Fetching ${issue.comments} comments...`);
    const comments = await fetchComments(issue.number);

    const commentsDir = path.join(issueDir, "issue_comments");

    for (const comment of comments) {
      const commentFile = path.join(commentsDir, `${comment.id}.md`);
      saveAsMarkdown(commentFile, comment, comment.body || "");
    }

    console.log(`    Saved ${comments.length} comments`);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("GitHub Issues Sync");
  console.log("==================");
  console.log(`Repository: ${owner}/${repo}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log();

  try {
    // Fetch all issues
    const issues = await fetchIssues();
    console.log();

    // Sync each issue
    console.log("Syncing issues...");
    for (const issue of issues) {
      await syncIssue(issue);
    }

    console.log();
    console.log("✅ Sync completed successfully!");
    console.log(`   Total issues synced: ${issues.length}`);
  } catch (error) {
    console.error("❌ Sync failed:");
    console.error(error);
    process.exit(1);
  }
}

// Run main function
main();
