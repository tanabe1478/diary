# E2E & ビジュアルリグレッションテストの追加

> **作成日**: 2025-12-23
> **対象ブランチ**: `test/add-e2e-visual-tests`

## 目的

Playwrightを使用したE2E テストとビジュアルリグレッションテストを導入し、UI の変更を自動的に検出できるようにする。

## 背景

### 課題

今回のリファクタリングで多くの依存関係を更新しました：

- React 19
- Next.js 16
- ESLint 9
- Prettier 3
- Tailwind CSS 4

これらの更新により、意図しないUIの変更が発生する可能性があります。既存のVitestテストはロジックをカバーしていますが、ビジュアル面のリグレッションは検出できません。

### ユーザー要件

- ✅ PR作成時に自動テスト実行
- ✅ ローカルでもテスト可能
- ✅ 既存テスト（Vitest）も一緒に実行
- ❌ GitHub Pages デプロイ前チェックは不要（PR時で十分）

## アプローチ

### Playwrightの採用

**選定理由**:

1. **オールインワン**: E2E + スクリーンショット比較
2. **Next.js公式推奨**: Vercel も推奨
3. **無料**: 外部サービス不要
4. **CI/CD統合**: GitHub Actions で簡単
5. **ダークモード対応**: テーマ切り替えテスト可能

### テスト対象

#### 最小限のカバレッジ（Phase 1）

1. ✅ ホームページ（記事一覧）- ライトモード
2. ✅ ホームページ - ダークモード
3. ✅ 記事詳細ページ - ライトモード
4. ✅ 記事詳細ページ - ダークモード

合計: **4スクリーンショット**

#### 将来的な拡張（Phase 2）

- レスポンシブテスト（モバイル、タブレット）
- 複数ブラウザ（Firefox、Safari）
- インタラクティブテスト（リンククリック、ナビゲーション）

## 実装内容

### 1. Playwrightのインストール

```bash
npm install -D @playwright/test
```

### 2. 設定ファイル

**playwright.config.ts**:

```typescript
export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

### 3. ビジュアルリグレッションテスト

**tests/e2e/visual-regression.spec.ts**:

```typescript
test("homepage - light mode", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("homepage-light.png", {
    fullPage: true,
  });
});
```

### 4. npm スクリプト

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:update": "playwright test --update-snapshots",
  "test:all": "npm run test:run && npm run test:e2e"
}
```

### 5. GitHub Actions ワークフロー

**.github/workflows/test.yml**:

```yaml
name: Tests
on:
  pull_request:
    branches: [main]

jobs:
  test:
    steps:
      - Type check
      - Linter
      - Unit tests (Vitest)
      - Build
      - E2E tests (Playwright)
      - Upload artifacts (失敗時)
```

### 6. .gitignore 更新

```
# playwright
/test-results/
/playwright-report/
/playwright/.cache/
```

**注意**: ベースラインスクリーンショット（`tests/e2e/*.spec.ts-snapshots/`）はコミットします。

## 使用方法

### 開発時

#### 初回: ベースラインスクリーンショットの生成

```bash
# 1. データを用意（data ブランチをチェックアウト、または既存データを使用）
git fetch origin data
git checkout data
# data/ ディレクトリをコピー

git checkout your-branch

# 2. 開発サーバー起動
npm run dev

# 3. ベースライン生成
npm run test:e2e:update

# 4. スクリーンショットをコミット
git add tests/e2e/
git commit -m "test: add baseline screenshots"
```

#### 通常のテスト実行

```bash
# 開発サーバーが起動していることを確認
npm run dev

# E2Eテストのみ
npm run test:e2e

# すべてのテスト
npm run test:all
```

#### UI モードで確認

```bash
npm run test:e2e:ui
```

#### スクリーンショット更新（意図的な変更後）

```bash
npm run test:e2e:update
```

### CI/CD（自動）

PR作成時に自動実行：

1. ✅ Type check
2. ✅ Linter
3. ✅ Unit tests (14 tests)
4. ✅ Build
5. ✅ E2E tests (4 tests)

失敗時は差分画像がアーティファクトとしてアップロードされます。

## 技術的考慮事項

### データの扱い

このプロジェクトはGitHub Issuesをデータソースとしています。

**ローカルテスト時**:

- `data/` ディレクトリが必要
- `data` ブランチからチェックアウト、または
- 既存の `__fixtures__` を `data/` にコピー

**CI/CD時**:

- `data` ブランチを自動チェックアウト（ワークフローで対応済み）

### スクリーンショットの管理

**ベースライン**: `tests/e2e/visual-regression.spec.ts-snapshots/`

- ✅ Gitにコミット
- ✅ PR差分で確認可能
- ✅ レビュワーが変更を確認できる

**差分（失敗時）**: `test-results/`

- ❌ Gitignore
- ✅ GitHub Actionsアーティファクトとしてアップロード
- ✅ 7日間保存

### Playwrightブラウザのインストール

初回のみ必要：

```bash
npx playwright install chromium
```

CI/CD では自動インストール：

```yaml
- run: npx playwright install --with-deps chromium
```

### パフォーマンス

- **ローカル**: 開発サーバー（Turbopack）使用、高速
- **CI/CD**: 本番ビルド使用、より信頼性高い

## リスク

### 低リスク項目

1. **スクリーンショットのサイズ**: 4枚 × 約50KB = 200KB
   - 影響: 最小限

2. **CI/CD実行時間**: 約2-3分追加
   - 対策: 許容範囲内

3. **False Positive**: フォント、アンチエイリアス等で差分検出
   - 対策: Playwrightのデフォルト設定で許容範囲を設定

## 成功基準

### 最低限の成功基準

- [ ] ローカルでE2Eテストが実行できる
- [ ] ベースラインスクリーンショットが生成される
- [ ] GitHub ActionsでPR時に自動実行される
- [ ] 既存のテスト（14テスト）も継続して実行される

### 理想的な成功基準

- [ ] UIの意図しない変更を検出できる
- [ ] ダークモードの変更も検出できる
- [ ] レビュワーが差分を簡単に確認できる

## 参考資料

### Playwright

- [Playwright Documentation](https://playwright.dev/)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Next.js

- [Testing with Playwright](https://nextjs.org/docs/app/building-your-application/testing/playwright)

## 次のステップ（この PR 後）

- [ ] レスポンシブテスト追加（モバイル、タブレット）
- [ ] 複数ブラウザテスト（Firefox、Safari）
- [ ] インタラクティブテスト（ナビゲーション等）
- [ ] カバレッジレポート統合

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
