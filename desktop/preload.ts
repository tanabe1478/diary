import { contextBridge, ipcRenderer } from "electron";

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

contextBridge.exposeInMainWorld("diaryWriter", {
  readSettings: () =>
    ipcRenderer.invoke("settings:read") as Promise<WriterSettings>,
  writeSettings: (settings: WriterSettings) =>
    ipcRenderer.invoke("settings:write", settings) as Promise<WriterSettings>,
  createIssue: (draft: IssueDraft) =>
    ipcRenderer.invoke("issues:create", draft) as Promise<{
      number: number;
      html_url: string;
    }>,
  listIssues: () => ipcRenderer.invoke("issues:list") as Promise<BlogIssue[]>,
  updateIssue: (number: number, draft: IssueDraft) =>
    ipcRenderer.invoke("issues:update", { number, draft }) as Promise<{
      number: number;
      html_url: string;
    }>,
  uploadImage: (upload: ImageUpload) =>
    ipcRenderer.invoke("images:upload", upload) as Promise<ImageUploadResponse>,
  openExternal: (url: string) => ipcRenderer.invoke("links:open", url),
});
