# gialog依存の解消

> **作成日**: 2025-12-23
> **対象ブランチ**: `refactor/remove-gialog-dependency`

## 目的

`r7kamura/gialog-sync@v1`への依存を解消し、GitHub API を直接使用してIssueをMarkdownファイルに同期する独自実装に置き換える。

## 背景

現在、`.github/workflows/sync.yml`で`r7kamura/gialog-sync@v1`を使用してGitHub IssuesをMarkdownファイルに変換している。外部依存を減らし、より柔軟なカスタマイズを可能にするため、独自実装に置き換える。

### 現在のgialogの役割

1. GitHub Issues APIからIssue情報を取得
2. 各Issueを`data/issues/{number}/issue.md`として保存
   - Front Matter: GitHub APIの全フィールド（YAML形式）
   - Body: Issueの本文（Markdown）
3. 各Issueのコメントを`data/issues/{number}/issue_comments/{id}.md`として保存
   - Front Matter: Comment APIの全フィールド
   - Body: コメントの本文
4. `data`ブランチにコミット・プッシュ

### データ構造の例

```markdown
---
number: 1
title: "タイトル"
created_at: '2022-07-18T19:51:29Z'
updated_at: '2022-07-18T19:51:29Z'
state: open
user:
  login: tanabe1478
  id: 18596776
  avatar_url: https://avatars.githubusercontent.com/u/18596776?v=4
  ...
comments: 0
labels: []
...
---

Issueの本文がここに入る
```

## アプローチ

### フェーズ 1: 独自同期スクリプトの実装

Node.js + TypeScriptでGitHub API連携スクリプトを作成：

1. **`scripts/sync-issues.ts`** - メインスクリプト
   - `@octokit/rest`を使用してGitHub APIにアクセス
   - リポジトリの全Issueを取得
   - 各Issueのコメントを取得
   - Markdown形式で`data/`ディレクトリに保存

2. **必要なパッケージ**
   - `@octokit/rest`: GitHub API クライアント
   - `gray-matter`: Front Matter の生成（既存）
   - `fs-extra`: ファイル操作の簡便化

### フェーズ 2: GitHub Actions ワークフローの更新

`.github/workflows/sync.yml`を変更：

- `r7kamura/gialog-sync@v1`の使用を削除
- Node.jsセットアップ後に`npm run sync-issues`を実行
- `data`ディレクトリの変更をコミット・プッシュ

### フェーズ 3: 動作確認

1. ローカルでスクリプトを実行してテスト
2. CI環境でのテスト
3. 既存のテストがすべて通ることを確認
4. 実際のIssue更新時の動作確認

## タスクリスト

### 準備

- [ ] 実装計画の作成
- [ ] ブランチ作成: `refactor/remove-gialog-dependency`
- [ ] 現在のテストがすべて通ることを確認

### フェーズ 1: 同期スクリプトの実装

- [ ] 必要なパッケージのインストール
  - `@octokit/rest`
  - `@types/node`（既存か確認）
  - `fs-extra`
  - `@types/fs-extra`
- [ ] `scripts/sync-issues.ts`の作成
  - GitHub API認証の実装
  - Issue一覧の取得
  - 各Issueの詳細とコメントの取得
  - Markdown形式での保存（Front Matter + Body）
  - ディレクトリ構造の作成
- [ ] `package.json`にスクリプト追加
  - `"sync-issues": "tsx scripts/sync-issues.ts"`
- [ ] ローカルでの動作テスト

### フェーズ 2: ワークフローの更新

- [ ] `.github/workflows/sync.yml`の変更
  - `r7kamura/gialog-sync@v1`のstepを削除
  - Node.jsセットアップ後に`npm run sync-issues`を追加
  - 環境変数`GITHUB_TOKEN`の設定確認
- [ ] Git設定の追加
  - コミット前にgit configで名前・メールを設定
  - 変更がある場合のみコミット・プッシュ

### フェーズ 3: テストと検証

- [ ] 既存のテストがすべて通る（14テスト）
- [ ] ローカルでスクリプトを実行し、`data/`ディレクトリの内容を確認
- [ ] データ形式がgialogの出力と一致することを確認
- [ ] `npm run build`が成功する
- [ ] `npm run dev`で開発サーバーが起動する

### ドキュメント

- [ ] 実装メモの作成
- [ ] `README.md`にスクリプトの説明を追記（必要であれば）
- [ ] ワークフローの変更内容を記録

### 仕上げ

- [ ] コミット & プッシュ
- [ ] PR 作成

## 技術的考慮事項

### GitHub API認証

- **GITHUB_TOKEN**: GitHub Actions環境では`secrets.GITHUB_TOKEN`を使用
- **ローカル開発**: 環境変数`GITHUB_TOKEN`または`.env`ファイルから読み込み
- **権限**: `contents: write`が必要（既に設定済み）

### APIレート制限

- 認証済みリクエスト: 5000リクエスト/時間
- このプロジェクトの規模（17 Issues程度）では問題なし
- 将来的に規模が大きくなった場合の対策:
  - ページネーション処理の実装
  - キャッシュの活用

### データ形式の互換性

- gialogの出力形式を完全に再現する必要がある
- Front Matterの全フィールドを保持
- 既存の`lib/issue.ts`がそのまま動作すること

### エラーハンドリング

- API呼び出し失敗時のリトライ
- ネットワークエラーの適切な処理
- ファイル書き込みエラーの処理

### TypeScriptの実行

- **tsx**: TypeScriptを直接実行するツール
- **代替案**: ts-nodeも検討したが、tsxの方が高速でESM対応が良い

## リスク

1. **GitHub API変更**: APIの破壊的変更により動作しなくなる可能性
   - 対策: Octokitを使用することで、API変更に対する互換性レイヤーを得られる

2. **データ形式の不一致**: gialogと完全に同じ出力を再現できない可能性
   - 対策: 実際のgialog出力と比較し、フィールドを一つずつ確認

3. **ワークフローの実行エラー**: CI環境での権限やトークン設定の問題
   - 対策: 段階的にデプロイし、ログを確認しながら調整

4. **既存機能の破壊**: Issueデータの形式変更により、既存コードが動作しなくなる
   - 対策: テストで保護されているため、テストが通れば問題なし

## 代替案

### 代替案 1: gialogをフォークして継続使用

- gialogのコードをフォークし、必要に応じてカスタマイズ
- **却下理由**: フォーク元のメンテナンスの手間、独自実装の方がシンプル

### 代替案 2: GitHub Actionsマーケットプレイスの別ツール使用

- 他のIssue→Markdown変換ツールを探す
- **却下理由**: 同様の外部依存が発生、カスタマイズ性が低い

### 代替案 3: GitHub GraphQL API使用

- REST APIの代わりにGraphQL APIを使用
- **採用しない理由**: REST APIで十分、GraphQLは複雑度が増す

## 成功基準

### 最低限の成功基準

- [ ] `r7kamura/gialog-sync@v1`への依存を削除
- [ ] 独自の同期スクリプトが動作する
- [ ] すべてのテスト（14テスト）が通る
- [ ] ビルドが成功する

### 理想的な成功基準

- [ ] CI/CD環境でIssue更新時に自動同期が動作
- [ ] データ形式がgialogと完全に一致
- [ ] エラーハンドリングが適切に実装されている
- [ ] スクリプトの実行時間が十分高速（< 30秒）

## 次のステップ（この PR 後）

1. React 19、Next.js 16へのメジャーアップデート（別PR）
2. TypeScript型定義の改善（別PR）
3. GitHub ActionsでのDependabot設定

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
- [テストインフラ実装](../../docs/implementations/2025-12-23_add-testing-infrastructure.md)
- [依存関係更新](../../docs/implementations/2025-12-23_update-dependencies.md)
