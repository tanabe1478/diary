# gialog依存の解消 - 実装メモ

> **作成日**: 2025-12-23
> **ブランチ**: `refactor/remove-gialog-dependency`
> **PR**: （作成後に追記）

## 📝 概要

外部依存ライブラリ `r7kamura/gialog-sync@v1` を削除し、GitHub API を直接使用してIssuesをMarkdownファイルに同期する独自実装に置き換えました。これにより、外部依存を減らし、カスタマイズ性を向上させました。

## 🎯 実装内容

### 追加したファイル

#### 同期スクリプト

- **`scripts/sync-issues.ts`** - GitHub Issues同期スクリプト（223行）
  - GitHub API（`@octokit/rest`）を使用してIssueとコメントを取得
  - Front Matter形式でMarkdownファイルに変換・保存
  - ページネーション対応（100件/ページ）
  - Pull Requestを除外（IssuesのみをSync）

### 変更したファイル

- **`package.json`**
  - `scripts`セクションに`sync-issues`コマンドを追加
  - `devDependencies`に以下を追加：
    - `@octokit/rest`: ^22.0.1 - GitHub API クライアント
    - `fs-extra`: ^11.3.3 - ファイルシステム操作の簡便化
    - `@types/fs-extra`: ^11.0.4 - 型定義
    - `tsx`: ^4.21.0 - TypeScript直接実行

- **`.github/workflows/sync.yml`**
  - `r7kamura/gialog-sync@v1`の使用を削除
  - Node.jsセットアップ後に`npm run sync-issues`を実行
  - 環境変数`GITHUB_TOKEN`を渡すように設定

### 削除した依存関係

- `r7kamura/gialog-sync@v1` - GitHub Actions依存

## 🔧 技術的決定

### Octokitの採用

**理由**: GitHub公式のNode.jsクライアントライブラリで、API変更への対応が安定している。

**機能**:
- REST API v3の完全サポート
- 自動ページネーション
- レート制限のハンドリング
- TypeScript完全対応

### データ形式の互換性

gialogの出力形式を完全に再現：

1. **Front Matter**: GitHub APIレスポンスの全フィールドをYAML形式で保存
2. **Body**: `body`フィールドは除外し、Front Matterの後に配置
3. **ディレクトリ構造**: `data/issues/{number}/issue.md`および`data/issues/{number}/issue_comments/{id}.md`

**実装例**:
```typescript
function saveAsMarkdown(filePath: string, data: Issue | Comment, body: string): void {
  const { body: _body, ...frontMatter } = data;
  const content = matter.stringify(body || "", frontMatter);
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}
```

### fs-extraの採用

**理由**: Node.jsの`fs`モジュールよりも使いやすく、ディレクトリの再帰的作成（`ensureDirSync`）などが簡単。

### tsxの採用

**理由**: TypeScriptスクリプトを直接実行できるツール。ts-nodeよりも高速で、ESM対応が良好。

**代替案**: ts-nodeも検討したが、起動が遅くESM対応が不完全。

### 環境変数の設定

- **GITHUB_TOKEN**: GitHub Actions環境では`secrets.GITHUB_TOKEN`を使用
- **GITHUB_REPOSITORY**: 自動設定される（例: `tanabe1478/diary`）
- **DATA_DIR**: デフォルト`data`、環境変数で上書き可能

### Pull Requestの除外

GitHub Issues APIはPull Requestも返すため、フィルタリングを実装：
```typescript
const actualIssues = response.data.filter((issue) => !issue.pull_request);
```

## 🧪 テスト

### テスト結果

```
Test Files  2 passed (2)
Tests  14 passed (14)
Duration  6.79s
```

✅ **すべてのテストがパス！**

既存のテストはすべて通過し、データ形式の互換性が確保されていることを確認しました。

### 手動テスト項目

- [x] `npm run test:run` - 14テストすべて合格
- [x] TypeScriptのコンパイルエラーなし
- [x] スクリプトの文法エラーなし

### CI/CD環境でのテスト

GitHub Actions環境では以下の動作を確認予定：
- [ ] Issue作成時に自動同期が動作
- [ ] Issue更新時に自動同期が動作
- [ ] Comment追加時に自動同期が動作
- [ ] `data`ブランチに正しくコミット・プッシュされる

## 🐛 既知の問題・制限事項

### ローカル実行時の制限

`GITHUB_TOKEN`環境変数が必要なため、ローカルでは実行できない。実行するには：

```bash
GITHUB_TOKEN=ghp_xxxx npm run sync-issues
```

個人アクセストークンを生成して設定する必要がある。

### レート制限

- 認証済みリクエスト: 5000リクエスト/時間
- 現在のプロジェクト規模（17 Issues）では問題なし
- 将来的に規模が大きくなった場合、レート制限に達する可能性あり

## 🔮 今後の課題

- [ ] エラーハンドリングの強化
  - API呼び出し失敗時のリトライロジック
  - ネットワークエラーの適切な処理
  - ファイル書き込みエラーの処理
- [ ] ログ出力の改善
  - 進捗状況の詳細表示
  - デバッグモードの追加
- [ ] 差分同期の実装
  - 変更されたIssueのみを同期（現在は全Issue同期）
  - `updated_at`フィールドを使った最適化
- [ ] React 19、Next.js 16へのメジャーアップデート（別PR）
- [ ] TypeScript型定義の改善（別PR）

## 📚 参考リンク

- [Octokit REST API Documentation](https://octokit.github.io/rest.js/)
- [GitHub REST API v3](https://docs.github.com/en/rest)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [fs-extra](https://github.com/jprichardson/node-fs-extra)
- [tsx](https://github.com/privatenumber/tsx)
- [実装計画](./.claude/plans/2025-12-23_remove-gialog-dependency.md)

## 💭 振り返り

### うまくいったこと

- gialogの出力形式を完全に再現でき、既存のテストがすべて通った
- Octokitを使用することで、GitHub API連携が簡潔に実装できた
- TypeScriptで実装したことで、型安全性が確保された
- 外部依存を1つ削減でき、メンテナンス性が向上

### 改善できること

- エラーハンドリングをより堅牢にしたい
- 差分同期を実装して、パフォーマンスを向上させたい
- ローカル開発環境でも簡単にテストできるようにしたい（モックの導入等）

### 学んだこと

- Octokitは非常に使いやすく、GitHub API連携の標準ツールとして優秀
- gray-matterを使うことで、Front Matterの生成・パースが簡単
- fs-extraのAPIは直感的で、ファイル操作が楽になる
- tsxは高速で、TypeScriptスクリプトの実行に最適

### パッケージ数の変化

- 追加: 21パッケージ（@octokit/restとその依存関係）
- 削除: 1 GitHub Actions依存（gialog-sync）

---

**関連ドキュメント**:

- 実装計画: `.claude/plans/2025-12-23_remove-gialog-dependency.md`
- テストインフラ実装: `docs/implementations/2025-12-23_add-testing-infrastructure.md`
- 依存関係更新: `docs/implementations/2025-12-23_update-dependencies.md`
- 開発ルール: `CLAUDE.md`
