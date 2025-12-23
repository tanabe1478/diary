import { describe, it, expect } from "vitest";
import { getIssue, listIssues, listIssueComments } from "./issue";

// Note: DATA_DIRECTORY_PATH environment variable is set in vitest.config.ts
// to point to __fixtures__ directory for testing

describe("getIssue", () => {
  it("should read and parse an issue correctly", async () => {
    const issue = await getIssue({ issueNumber: 1 });

    expect(issue.number).toBe(1);
    expect(issue.title).toBe("Test Issue with Basic Markdown");
    expect(issue.created_at).toBe("2024-01-01T10:00:00Z");
    expect(issue.user.login).toBe("testuser");
    expect(issue.body).toContain("This is a test issue");
    expect(issue.bodyHTML).toBeTruthy();
  });

  it("should convert markdown to HTML", async () => {
    const issue = await getIssue({ issueNumber: 1 });

    // Check that HTML conversion worked
    expect(issue.bodyHTML).toContain("<h1>");
    expect(issue.bodyHTML).toContain("<strong>bold</strong>");
    expect(issue.bodyHTML).toContain("<em>italic</em>");
    expect(issue.bodyHTML).toContain("<ul>");
    expect(issue.bodyHTML).toContain("<pre>");
    expect(issue.bodyHTML).toContain("</code>");
  });

  it("should handle GitHub Flavored Markdown", async () => {
    const issue = await getIssue({ issueNumber: 2 });

    expect(issue.number).toBe(2);
    expect(issue.title).toBe("Test Issue with GitHub Flavored Markdown");

    // Check that GFM features are rendered
    expect(issue.bodyHTML).toContain("<table>");
    expect(issue.bodyHTML).toContain("input"); // Task lists use checkboxes
  });
});

describe("listIssues", () => {
  it("should list all issues", async () => {
    const issues = await listIssues();

    expect(issues).toHaveLength(2);
    expect(issues[0].number).toBeDefined();
    expect(issues[0].title).toBeDefined();
    expect(issues[0].created_at).toBeDefined();
  });

  it("should sort issues by created_at in descending order", async () => {
    const issues = await listIssues();

    // Issue 2 was created after issue 1, so it should come first
    expect(issues[0].number).toBe(2);
    expect(issues[1].number).toBe(1);
  });

  it("should include issue body", async () => {
    const issues = await listIssues();

    expect(issues[0].body).toBeTruthy();
    expect(issues[0].body).toContain("# GitHub Flavored Markdown Test");
  });
});

describe("listIssueComments", () => {
  it("should list comments for an issue", async () => {
    const comments = await listIssueComments({ issueNumber: 1 });

    expect(comments).toHaveLength(1);
    expect(comments[0].id).toBe(1);
    expect(comments[0].body).toContain("This is a comment");
    expect(comments[0].bodyHTML).toBeTruthy();
  });

  it("should convert comment markdown to HTML", async () => {
    const comments = await listIssueComments({ issueNumber: 1 });

    expect(comments[0].bodyHTML).toContain(
      "<strong>additional information</strong>",
    );
  });

  it("should return empty array for issue without comments", async () => {
    const comments = await listIssueComments({ issueNumber: 2 });

    expect(comments).toHaveLength(0);
  });

  it("should sort comments by created_at in ascending order", async () => {
    const comments = await listIssueComments({ issueNumber: 1 });

    // Should be in chronological order
    expect(comments[0].created_at).toBe("2024-01-01T11:00:00Z");
  });
});
