# Blog writer desktop app

## Summary

GitHub Issues へブログ記事を投稿するための Electron アプリを追加した。

## Changes

- `desktop/main.ts`: Electron main process と GitHub Issue 作成処理を追加
- `desktop/main.ts`: GitHub Issue の一覧取得と更新処理を追加
- `desktop/main.ts`: GitHub Contents API を使った画像アップロード処理を追加
- `desktop/preload.ts`: renderer から使う安全な IPC API を追加
- `desktop/renderer/*`: 執筆画面、既存記事一覧、本文欄への画像ドロップ、設定保存、下書き保存、Markdown プレビューを追加
- `tsconfig.electron.json`: Electron main/preload 用のビルド設定を追加
- `package.json`: `app:dev`, `app:build`, `app:dist` と electron-builder 設定を追加
- `README.md`: デスクトップアプリの使い方を追記

## Notes

GitHub token は Electron の userData 配下に保存される。fine-grained personal access token を使い、対象リポジトリの Issues read/write 権限に絞る運用を想定している。
既存記事の編集は issue の `PATCH` で行うため、既存の `issues.edited` workflow がブログ再生成を担当する。
画像は `public/uploads/YYYY-MM-DD/` にコミットし、GitHub Pages の公開 URL を Markdown として本文へ挿入する。
