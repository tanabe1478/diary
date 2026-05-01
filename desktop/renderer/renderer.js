const draftKey = "diary-writer-draft";

const ownerInput = document.querySelector("#ownerInput");
const repoInput = document.querySelector("#repoInput");
const tokenInput = document.querySelector("#tokenInput");
const themeInput = document.querySelector("#themeInput");
const titleInput = document.querySelector("#titleInput");
const bodyInput = document.querySelector("#bodyInput");
const preview = document.querySelector("#preview");
const statusMessage = document.querySelector("#statusMessage");
const saveSettingsButton = document.querySelector("#saveSettingsButton");
const publishButton = document.querySelector("#publishButton");
const clearDraftButton = document.querySelector("#clearDraftButton");
const newDraftButton = document.querySelector("#newDraftButton");
const refreshIssuesButton = document.querySelector("#refreshIssuesButton");
const updateIssueButton = document.querySelector("#updateIssueButton");
const issueList = document.querySelector("#issueList");
const issueCount = document.querySelector("#issueCount");
const settingsDialog = document.querySelector("#settingsDialog");
const openSettingsButton = document.querySelector("#openSettingsButton");
const closeSettingsButton = document.querySelector("#closeSettingsButton");
const appShell = document.querySelector("#appShell");
const focusModeButton = document.querySelector("#focusModeButton");
const previewToggleButton = document.querySelector("#previewToggleButton");

let issues = [];
let selectedIssue = null;
let focusModeEnabled = false;
let focusPreviewEnabled = false;

const diaryWriterApi = window.diaryWriter ?? {
  readSettings: async () => ({
    owner: "tanabe1478",
    repo: "diary",
    token: "",
    defaultLabels: [],
    theme: "light",
  }),
  writeSettings: async (settings) => settings,
  createIssue: async () => {
    throw new Error("Issue投稿はデスクトップアプリ内で実行してください。");
  },
  listIssues: async () => {
    const owner = ownerInput.value.trim() || "tanabe1478";
    const repo = repoInput.value.trim() || "diary";
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(
        responseBody.message || "GitHub Issueの取得に失敗しました。",
      );
    }

    return responseBody
      .filter((issue) => !issue.pull_request)
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body || "",
        labels: issue.labels.map((label) =>
          typeof label === "string" ? label : label.name,
        ),
        state: issue.state,
        updated_at: issue.updated_at,
        html_url: issue.html_url,
      }));
  },
  updateIssue: async () => {
    throw new Error("Issue更新はデスクトップアプリ内で実行してください。");
  },
  uploadImage: async () => {
    throw new Error(
      "画像アップロードはデスクトップアプリ内で実行してください。",
    );
  },
  openExternal: async (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  },
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderMarkdown(markdown) {
  const escaped = escapeHtml(markdown);
  const lines = escaped.split("\n");
  const html = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${line.slice(2)}</h1>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(line.slice(2))}</li>`);
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html.push(`<p>${formatInline(line)}</p>`);
    }
  }

  closeList();
  return html.join("");

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }
}

function formatInline(value) {
  return value
    .replace(
      /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g,
      '<img src="$2" alt="$1" loading="lazy" />',
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" rel="noreferrer">$1</a>',
    );
}

function saveDraft() {
  localStorage.setItem(
    draftKey,
    JSON.stringify({
      title: titleInput.value,
      body: bodyInput.value,
    }),
  );
}

function loadDraft() {
  const rawDraft = localStorage.getItem(draftKey);
  if (!rawDraft) {
    return;
  }

  try {
    const draft = JSON.parse(rawDraft);
    titleInput.value = draft.title || "";
    bodyInput.value = draft.body || "";
  } catch {
    localStorage.removeItem(draftKey);
  }
}

function updatePreview() {
  preview.innerHTML = bodyInput.value.trim()
    ? renderMarkdown(bodyInput.value)
    : '<p class="empty-preview">本文を書くとここにプレビューが表示されます。</p>';
}

function setStatus(message, tone = "neutral") {
  statusMessage.textContent = message;
  statusMessage.dataset.tone = tone;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
}

function getCurrentDraft() {
  return {
    title: titleInput.value,
    body: bodyInput.value,
    labels: selectedIssue?.labels || [],
  };
}

function insertTextAtCursor(text, range = getCurrentSelectionRange()) {
  const start = range.start;
  const end = range.end;
  const before = bodyInput.value.slice(0, start);
  const after = bodyInput.value.slice(end);
  const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
  const suffix = after && !after.startsWith("\n") ? "\n\n" : "";
  const insertion = `${prefix}${text}${suffix}`;

  bodyInput.value = `${before}${insertion}${after}`;
  bodyInput.focus();
  bodyInput.selectionStart = start + insertion.length;
  bodyInput.selectionEnd = start + insertion.length;
  saveDraft();
  updatePreview();
}

function getCurrentSelectionRange() {
  return {
    start: bodyInput.selectionStart,
    end: bodyInput.selectionEnd,
  };
}

function moveTextareaCaretToPoint(event) {
  bodyInput.focus();

  const nativeOffset = getNativeCaretOffset(event.clientX, event.clientY);
  const offset =
    nativeOffset ?? estimateTextareaOffset(event.clientX, event.clientY);

  bodyInput.selectionStart = offset;
  bodyInput.selectionEnd = offset;

  return getCurrentSelectionRange();
}

function getNativeCaretOffset(x, y) {
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    if (position?.offsetNode === bodyInput) {
      return position.offset;
    }
  }

  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(x, y);
    if (range?.startContainer === bodyInput) {
      return range.startOffset;
    }
  }

  return null;
}

function estimateTextareaOffset(x, y) {
  const rect = bodyInput.getBoundingClientRect();
  const style = window.getComputedStyle(bodyInput);
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(style.paddingRight) || 0;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const lineHeight =
    Number.parseFloat(style.lineHeight) ||
    (Number.parseFloat(style.fontSize) || 16) * 1.7;
  const availableWidth = Math.max(1, rect.width - paddingLeft - paddingRight);
  const canvas =
    estimateTextareaOffset.canvas || document.createElement("canvas");
  estimateTextareaOffset.canvas = canvas;
  const context = canvas.getContext("2d");

  if (!context) {
    return bodyInput.value.length;
  }

  context.font = style.font;

  const targetX = Math.max(
    0,
    x - rect.left - paddingLeft + bodyInput.scrollLeft,
  );
  const targetVisualLine = Math.max(
    0,
    Math.floor((y - rect.top - paddingTop + bodyInput.scrollTop) / lineHeight),
  );
  const logicalLines = bodyInput.value.split("\n");
  let consumedOffset = 0;
  let visualLine = 0;

  for (const line of logicalLines) {
    const wrappedLineCount = getWrappedLineCount(context, line, availableWidth);

    if (targetVisualLine < visualLine + wrappedLineCount) {
      const wrapIndex = targetVisualLine - visualLine;
      const targetWidth = wrapIndex * availableWidth + targetX;
      return consumedOffset + findClosestColumn(context, line, targetWidth);
    }

    visualLine += wrappedLineCount;
    consumedOffset += line.length + 1;
  }

  return bodyInput.value.length;
}

function getWrappedLineCount(context, line, availableWidth) {
  if (!line) {
    return 1;
  }

  return Math.max(
    1,
    Math.ceil(context.measureText(line).width / availableWidth),
  );
}

function findClosestColumn(context, line, targetWidth) {
  if (targetWidth <= 0) {
    return 0;
  }

  let low = 0;
  let high = line.length;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (context.measureText(line.slice(0, mid)).width < targetWidth) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  const currentWidth = context.measureText(line.slice(0, low)).width;
  const nextWidth = context.measureText(line.slice(0, low + 1)).width;

  return Math.abs(nextWidth - targetWidth) <
    Math.abs(currentWidth - targetWidth)
    ? Math.min(line.length, low + 1)
    : low;
}

async function uploadDroppedImages(
  files,
  insertionRange = getCurrentSelectionRange(),
) {
  const imageFiles = [...files].filter((file) =>
    file.type.startsWith("image/"),
  );
  if (imageFiles.length === 0) {
    setStatus("画像ファイルをドロップしてください。", "error");
    return;
  }

  bodyInput.dataset.dragging = "false";
  setStatus(
    `${imageFiles.length}件の画像をアップロードしています...`,
    "neutral",
  );

  try {
    await saveSettings();
    const markdownList = [];

    for (const file of imageFiles) {
      const contentBase64 = await readFileAsBase64(file);
      const uploaded = await diaryWriterApi.uploadImage({
        fileName: file.name,
        mimeType: file.type,
        contentBase64,
      });
      markdownList.push(uploaded.markdown);
    }

    insertTextAtCursor(markdownList.join("\n\n"), insertionRange);
    setStatus(
      `${markdownList.length}件の画像をアップロードして本文へ挿入しました。`,
      "success",
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = String(reader.result || "");
      resolve(result.replace(/^data:[^;]+;base64,/, ""));
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function renderIssueList() {
  issueCount.textContent = String(issues.length);

  if (issues.length === 0) {
    issueList.innerHTML =
      '<p class="empty-list">既存記事を取得すると一覧が表示されます。</p>';
    return;
  }

  issueList.innerHTML = issues
    .map((issue) => {
      const isSelected = selectedIssue?.number === issue.number;
      const updatedAt = new Date(issue.updated_at).toLocaleDateString("ja-JP");
      return `
        <button
          type="button"
          class="issue-item"
          data-issue-number="${issue.number}"
          aria-current="${isSelected ? "true" : "false"}"
        >
          <span class="issue-title">#${issue.number} ${escapeHtml(issue.title)}</span>
          <span class="issue-meta">${issue.state} / ${updatedAt}</span>
        </button>
      `;
    })
    .join("");
}

function selectIssue(issue) {
  selectedIssue = issue;
  titleInput.value = issue.title;
  bodyInput.value = issue.body;
  updateIssueButton.disabled = false;
  renderIssueList();
  saveDraft();
  updatePreview();
  setStatus(`Issue #${issue.number} を読み込みました。`);
}

function startNewDraft() {
  selectedIssue = null;
  titleInput.value = "";
  bodyInput.value = "";
  updateIssueButton.disabled = true;
  localStorage.removeItem(draftKey);
  renderIssueList();
  updatePreview();
  setStatus("新規記事の作成に切り替えました。");
}

async function loadSettings() {
  const settings = await diaryWriterApi.readSettings();
  ownerInput.value = settings.owner;
  repoInput.value = settings.repo;
  tokenInput.value = settings.token;
  themeInput.value = settings.theme || "light";
  applyTheme(themeInput.value);
}

async function saveSettings() {
  const settings = await diaryWriterApi.writeSettings({
    owner: ownerInput.value,
    repo: repoInput.value,
    token: tokenInput.value,
    defaultLabels: [],
    theme: themeInput.value,
  });

  ownerInput.value = settings.owner;
  repoInput.value = settings.repo;
  tokenInput.value = settings.token;
  themeInput.value = settings.theme || "light";
  applyTheme(themeInput.value);
  setStatus("設定を保存しました。", "success");
}

async function refreshIssues() {
  refreshIssuesButton.disabled = true;
  setStatus("既存記事を取得しています...", "neutral");

  try {
    await saveSettings();
    issues = await diaryWriterApi.listIssues();
    if (selectedIssue) {
      selectedIssue =
        issues.find((issue) => issue.number === selectedIssue.number) ?? null;
    }
    if (!selectedIssue) {
      updateIssueButton.disabled = true;
    }
    renderIssueList();
    setStatus(`${issues.length}件の記事を取得しました。`, "success");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  } finally {
    refreshIssuesButton.disabled = false;
  }
}

async function publishIssue() {
  publishButton.disabled = true;
  setStatus("GitHub Issueを作成しています...", "neutral");

  try {
    await saveSettings();
    const issue = await diaryWriterApi.createIssue(getCurrentDraft());

    localStorage.removeItem(draftKey);
    setStatus(
      `Issue #${issue.number} を作成しました。CIがブログを更新します。`,
      "success",
    );
    await diaryWriterApi.openExternal(issue.html_url);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  } finally {
    publishButton.disabled = false;
  }
}

async function saveSelectedIssue() {
  if (!selectedIssue) {
    setStatus("編集する既存記事を選択してください。", "error");
    return;
  }

  updateIssueButton.disabled = true;
  setStatus(`Issue #${selectedIssue.number} を更新しています...`, "neutral");

  try {
    await saveSettings();
    const issue = await diaryWriterApi.updateIssue(
      selectedIssue.number,
      getCurrentDraft(),
    );
    const updatedIssue = {
      ...selectedIssue,
      title: titleInput.value.trim(),
      body: bodyInput.value,
      labels: selectedIssue.labels,
      updated_at: new Date().toISOString(),
      html_url: issue.html_url,
    };
    issues = issues.map((item) =>
      item.number === updatedIssue.number ? updatedIssue : item,
    );
    selectedIssue = updatedIssue;
    renderIssueList();
    setStatus(
      `Issue #${issue.number} を更新しました。CIがブログを更新します。`,
      "success",
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error), "error");
  } finally {
    updateIssueButton.disabled = false;
  }
}

for (const input of [titleInput, bodyInput]) {
  input.addEventListener("input", () => {
    saveDraft();
    updatePreview();
  });
}

preview.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLAnchorElement) {
    event.preventDefault();
    void diaryWriterApi.openExternal(target.href);
  }
});

issueList.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const target = event.target.closest("[data-issue-number]");
  if (!target || !(target instanceof HTMLElement)) {
    return;
  }

  const issueNumber = Number(target.dataset.issueNumber);
  const issue = issues.find((item) => item.number === issueNumber);
  if (issue) {
    selectIssue(issue);
  }
});

themeInput.addEventListener("change", () => {
  applyTheme(themeInput.value);
});
openSettingsButton.addEventListener("click", () => {
  settingsDialog.showModal();
});
closeSettingsButton.addEventListener("click", () => {
  settingsDialog.close();
});

focusModeButton.addEventListener("click", () => {
  focusModeEnabled = !focusModeEnabled;
  appShell.classList.toggle("focus-mode", focusModeEnabled);
  if (!focusModeEnabled) {
    focusPreviewEnabled = false;
    appShell.classList.remove("focus-preview-open");
    previewToggleButton.textContent = "Preview";
  }
  focusModeButton.textContent = focusModeEnabled ? "通常表示" : "集中";
});
previewToggleButton.addEventListener("click", () => {
  if (!focusModeEnabled) {
    return;
  }

  focusPreviewEnabled = !focusPreviewEnabled;
  appShell.classList.toggle("focus-preview-open", focusPreviewEnabled);
  previewToggleButton.textContent = focusPreviewEnabled
    ? "Previewを閉じる"
    : "Preview";
});

bodyInput.addEventListener("dragover", (event) => {
  event.preventDefault();
  bodyInput.dataset.dragging = "true";
  moveTextareaCaretToPoint(event);
});
bodyInput.addEventListener("dragleave", () => {
  bodyInput.dataset.dragging = "false";
});
bodyInput.addEventListener("drop", (event) => {
  event.preventDefault();
  const insertionRange = moveTextareaCaretToPoint(event);
  void uploadDroppedImages(event.dataTransfer.files, insertionRange);
});

saveSettingsButton.addEventListener("click", () => void saveSettings());
publishButton.addEventListener("click", () => void publishIssue());
newDraftButton.addEventListener("click", startNewDraft);
refreshIssuesButton.addEventListener("click", () => void refreshIssues());
updateIssueButton.addEventListener("click", () => void saveSelectedIssue());
clearDraftButton.addEventListener("click", () => {
  startNewDraft();
  setStatus("下書きをクリアしました。");
});

void loadSettings();
loadDraft();
renderIssueList();
updatePreview();
