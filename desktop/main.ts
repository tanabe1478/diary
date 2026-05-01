import { app, BrowserWindow, ipcMain, shell } from "electron";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";

type WriterSettings = {
  owner: string;
  repo: string;
  token: string;
  defaultLabels: string[];
  theme: "light" | "dark";
};

type IssueDraft = {
  title: string;
  body: string;
  labels: string[];
};

type GitHubIssueResponse = {
  number: number;
  html_url: string;
};

type BlogIssue = {
  number: number;
  title: string;
  body: string;
  labels: string[];
  state: string;
  updated_at: string;
  html_url: string;
};

type ImageUpload = {
  fileName: string;
  mimeType: string;
  contentBase64: string;
};

type ImageUploadResponse = {
  path: string;
  url: string;
  markdown: string;
};

const defaultSettings: WriterSettings = {
  owner: "tanabe1478",
  repo: "diary",
  token: "",
  defaultLabels: [],
  theme: "light",
};

const execFileAsync = promisify(execFile);

let mainWindow: BrowserWindow | null = null;

function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

async function readSettings(
  includeRuntimeToken = false,
): Promise<WriterSettings> {
  const envSettings = await readEnvLocalSettings();
  const runtimeToken = includeRuntimeToken ? await readGhCliToken() : "";
  const token = (savedSettings: Partial<WriterSettings>) =>
    includeRuntimeToken
      ? savedSettings.token ||
        envSettings.token ||
        runtimeToken ||
        defaultSettings.token
      : savedSettings.token || defaultSettings.token;

  try {
    const rawSettings = await fs.readFile(getSettingsPath(), "utf-8");
    const savedSettings = JSON.parse(rawSettings) as Partial<WriterSettings>;
    return {
      ...defaultSettings,
      ...envSettings,
      ...savedSettings,
      token: token(savedSettings),
    };
  } catch {
    return {
      ...defaultSettings,
      ...envSettings,
      token: token({}),
    };
  }
}

async function readEnvLocalSettings(): Promise<Partial<WriterSettings>> {
  try {
    const envPath = path.join(app.getAppPath(), ".env.local");
    const content = await fs.readFile(envPath, "utf-8");
    const env = Object.fromEntries(
      content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const [key, ...valueParts] = line.split("=");
          return [
            key.trim(),
            valueParts
              .join("=")
              .trim()
              .replace(/^["']|["']$/g, ""),
          ];
        }),
    );
    const [owner, repo] = (env.GITHUB_REPOSITORY || "").split("/");

    return {
      owner: owner || undefined,
      repo: repo || undefined,
      token: env.GITHUB_TOKEN || undefined,
    };
  } catch {
    return {};
  }
}

async function readGhCliToken(): Promise<string> {
  try {
    const { stdout } = await execFileAsync("gh", ["auth", "token"], {
      timeout: 5000,
      windowsHide: true,
    });
    return stdout.trim();
  } catch {
    return "";
  }
}

async function writeSettings(
  settings: WriterSettings,
): Promise<WriterSettings> {
  const normalizedSettings: WriterSettings = {
    owner: settings.owner.trim() || defaultSettings.owner,
    repo: settings.repo.trim() || defaultSettings.repo,
    token: settings.token.trim(),
    defaultLabels: settings.defaultLabels
      .map((label) => label.trim())
      .filter(Boolean),
    theme: settings.theme === "dark" ? "dark" : "light",
  };

  await fs.mkdir(path.dirname(getSettingsPath()), { recursive: true });
  await fs.writeFile(
    getSettingsPath(),
    JSON.stringify(normalizedSettings, null, 2),
    "utf-8",
  );

  return normalizedSettings;
}

async function createIssue(draft: IssueDraft): Promise<GitHubIssueResponse> {
  const settings = await readSettings(true);
  assertCanWrite(settings, draft);

  const labels = normalizeLabels(draft.labels);

  const response = await fetch(
    `https://api.github.com/repos/${settings.owner}/${settings.repo}/issues`,
    {
      method: "POST",
      headers: getGitHubHeaders(settings.token),
      body: JSON.stringify({
        title: draft.title.trim(),
        body: draft.body,
        labels,
      }),
    },
  );

  const responseBody = (await response.json()) as
    | GitHubIssueResponse
    | { message?: string };

  assertOk(response, responseBody);

  return responseBody as GitHubIssueResponse;
}

async function listIssues(): Promise<BlogIssue[]> {
  const settings = await readSettings(true);

  const response = await fetch(
    `https://api.github.com/repos/${settings.owner}/${settings.repo}/issues?state=all&per_page=100`,
    {
      headers: getGitHubHeaders(settings.token),
    },
  );
  const responseBody = (await response.json()) as
    | Array<{
        number: number;
        title: string;
        body: string | null;
        labels: Array<{ name: string } | string>;
        state: string;
        updated_at: string;
        html_url: string;
        pull_request?: unknown;
      }>
    | { message?: string };

  assertOk(response, responseBody);

  return (responseBody as Array<any>)
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body || "",
      labels: issue.labels.map((label: { name: string } | string) =>
        typeof label === "string" ? label : label.name,
      ),
      state: issue.state,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
    }));
}

async function updateIssue({
  number,
  draft,
}: {
  number: number;
  draft: IssueDraft;
}): Promise<GitHubIssueResponse> {
  const settings = await readSettings(true);
  assertCanWrite(settings, draft);

  const response = await fetch(
    `https://api.github.com/repos/${settings.owner}/${settings.repo}/issues/${number}`,
    {
      method: "PATCH",
      headers: getGitHubHeaders(settings.token),
      body: JSON.stringify({
        title: draft.title.trim(),
        body: draft.body,
        labels: normalizeLabels(draft.labels),
      }),
    },
  );

  const responseBody = (await response.json()) as
    | GitHubIssueResponse
    | { message?: string };

  assertOk(response, responseBody);

  return responseBody as GitHubIssueResponse;
}

async function uploadImage(upload: ImageUpload): Promise<ImageUploadResponse> {
  const settings = await readSettings(true);

  if (!settings.token) {
    throw new Error(
      "GitHub Token が設定されていません。設定画面でトークンを保存してください。",
    );
  }

  const extension = getImageExtension(upload.fileName, upload.mimeType);
  if (!extension) {
    throw new Error("PNG, JPEG, GIF, WebP の画像だけアップロードできます。");
  }

  const sizeInBytes = Math.floor((upload.contentBase64.length * 3) / 4);
  if (sizeInBytes > 8 * 1024 * 1024) {
    throw new Error("画像は8MB以下にしてください。");
  }

  const date = new Date().toISOString().slice(0, 10);
  const safeName = sanitizeFileName(upload.fileName, extension);
  const uploadPath = `public/uploads/${date}/${randomUUID()}-${safeName}`;
  const response = await fetch(
    `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${encodeURIComponentPath(uploadPath)}`,
    {
      method: "PUT",
      headers: getGitHubHeaders(settings.token),
      body: JSON.stringify({
        message: `chore: upload blog image ${safeName}`,
        content: upload.contentBase64,
        branch: "main",
      }),
    },
  );
  const responseBody = (await response.json()) as { message?: string };

  assertOk(response, responseBody);

  const url = buildPagesImageUrl(settings, uploadPath);
  const alt = path.parse(upload.fileName).name || "image";

  return {
    path: uploadPath,
    url,
    markdown: `![${alt}](${url})`,
  };
}

function assertCanWrite(settings: WriterSettings, draft: IssueDraft) {
  if (!settings.token) {
    throw new Error(
      "GitHub Token が設定されていません。設定画面でトークンを保存してください。",
    );
  }

  if (!draft.title.trim()) {
    throw new Error("Title is required.");
  }

  if (!draft.body.trim()) {
    throw new Error("Body is required.");
  }
}

function getGitHubHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "diary-writer",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function normalizeLabels(labels: string[]) {
  return labels.map((label) => label.trim()).filter(Boolean);
}

function getImageExtension(fileName: string, mimeType: string) {
  const extension = path.extname(fileName).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(extension)) {
    return extension;
  }

  const extensionByMimeType: Record<string, string> = {
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  return extensionByMimeType[mimeType] || "";
}

function sanitizeFileName(fileName: string, extension: string) {
  const parsed = path.parse(fileName);
  const baseName = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "image"}${extension}`;
}

function encodeURIComponentPath(filePath: string) {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

function buildPagesImageUrl(settings: WriterSettings, uploadPath: string) {
  const publicPath = uploadPath.replace(/^public\//, "");
  const isUserPageRepo =
    settings.repo.toLowerCase() === `${settings.owner.toLowerCase()}.github.io`;
  const repoPath = isUserPageRepo ? "" : `/${settings.repo}`;

  return `https://${settings.owner}.github.io${repoPath}/${publicPath}`;
}

function assertOk(response: Response, responseBody: unknown) {
  if (!response.ok) {
    const message =
      responseBody &&
      typeof responseBody === "object" &&
      "message" in responseBody &&
      typeof responseBody.message === "string"
        ? responseBody.message
        : "";

    throw new Error(
      message || `GitHub API request failed with status ${response.status}.`,
    );
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 980,
    minHeight: 680,
    title: "Diary Writer",
    backgroundColor: "#f7f8fb",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  void mainWindow.loadFile(
    path.join(__dirname, "../desktop/renderer/index.html"),
  );
}

app.whenReady().then(() => {
  ipcMain.handle("settings:read", () => readSettings());
  ipcMain.handle("settings:write", (_event, settings: WriterSettings) =>
    writeSettings(settings),
  );
  ipcMain.handle("issues:create", (_event, draft: IssueDraft) =>
    createIssue(draft),
  );
  ipcMain.handle("issues:list", listIssues);
  ipcMain.handle(
    "issues:update",
    (_event, payload: { number: number; draft: IssueDraft }) =>
      updateIssue(payload),
  );
  ipcMain.handle("images:upload", (_event, upload: ImageUpload) =>
    uploadImage(upload),
  );
  ipcMain.handle("links:open", (_event, url: string) =>
    shell.openExternal(url),
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
