# テストインフラストラクチャの追加 - 実装メモ

> **作成日**: 2025-12-23
> **ブランチ**: `test/add-testing-infrastructure` > **PR**: （作成後に追記）

## 📝 概要

技術的負債解消（ライブラリ更新、gialog 依存の除去）を安全に行うため、現状の動作を保証するテストインフラストラクチャを構築しました。Vitest をテストランナーとして採用し、コアロジックと UI コンポーネントの包括的なテストを実装しました。

## 🎯 実装内容

### 追加したファイル

#### テスト設定

- `vitest.config.ts` - Vitest 設定ファイル（環境変数、カバレッジ設定含む）
- `vitest.setup.ts` - テストセットアップファイル（@testing-library/jest-dom 統合）

#### テストファイル

- `lib/issue.test.ts` - `lib/issue.ts`の全関数の包括的なユニットテスト（10 テスト）
  - `getIssue()` - 個別記事の読み込みと Markdown 処理
  - `listIssues()` - 記事一覧の取得とソート
  - `listIssueComments()` - コメントの取得と変換
- `components/Time.test.tsx` - Time コンポーネントのテスト（4 テスト）
  - 日時フォーマット
  - HTML 属性の検証
  - CSS クラスの検証

#### テストデータ（Fixtures）

- `__fixtures__/issues/1/issue.md` - 基本的な Markdown テスト用データ
- `__fixtures__/issues/2/issue.md` - GitHub Flavored Markdown（GFM）テスト用データ
- `__fixtures__/issues/1/issue_comments/1.md` - コメントテスト用データ

### 変更したファイル

- `package.json` - テストスクリプトの追加、devDependencies に追加
  - `npm test` - watch モード
  - `npm run test:run` - 1 回実行
  - `npm run test:coverage` - カバレッジ表示
  - `npm run test:ui` - UI モード
- `README.md` - テスト実行方法を追記

## 🔧 技術的決定

### テストランナー: Vitest

**採用理由**:

- Jest 互換の API で学習コストが低い
- 高速（ESM ネイティブサポート）
- Next.js との統合が容易
- TypeScript 完全サポート
- ウォッチモード、UI モード、カバレッジ機能が標準装備

**代替案**: Jest

- より成熟しているが、設定が複雑でパフォーマンスが劣る

### テストライブラリ構成

- **@testing-library/react**: React コンポーネントのレンダリングとクエリ
- **@testing-library/jest-dom**: DOM マッチャー（`toBeInTheDocument`等）
- **@vitejs/plugin-react**: Vite で React をサポート
- **jsdom**: ブラウザ環境のシミュレーション

### 環境変数の扱い

`lib/issue.ts`がモジュールレベルで`DATA_DIRECTORY_PATH`環境変数を読み込むため、`vitest.config.ts`の`test.env`で環境変数を設定。これにより、テストは`__fixtures__`ディレクトリを参照します。

### テストデータ戦略

- ファイルシステム操作はモックせず、実際の fixture ファイルを使用
- GitHub Issue 互換の Markdown + Front Matter 形式
- 基本的な Markdown と GFM の両方をカバー

## 🧪 テスト

### 追加したテスト

**lib/issue.test.ts（10 テスト）**:

- ✅ `getIssue()` - Issue 読み込みとパース
- ✅ `getIssue()` - Markdown→HTML 変換
- ✅ `getIssue()` - GFM（テーブル、タスクリスト）のレンダリング
- ✅ `listIssues()` - 複数 Issue の読み込み
- ✅ `listIssues()` - 作成日時でのソート（降順）
- ✅ `listIssues()` - Issue ボディの取得
- ✅ `listIssueComments()` - コメントの読み込み
- ✅ `listIssueComments()` - コメントの HTML 変換
- ✅ `listIssueComments()` - コメントがない場合の処理
- ✅ `listIssueComments()` - コメントのソート（昇順）

**components/Time.test.tsx（4 テスト）**:

- ✅ 日時フォーマット（yyyy-MM-dd）
- ✅ `<time>`要素と datetime 属性
- ✅ title 属性
- ✅ CSS クラス

### テスト結果

```
Test Files  2 passed (2)
Tests  14 passed (14)
Duration  5.88s
```

すべてのテストがパス ✅

### 手動テスト項目

- [x] `npm test` で watch モードが起動
- [x] `npm run test:run` で 1 回実行
- [x] `npm run test:ui` で Vitest の UI が起動
- [x] すべてのテストが通る

## 🐛 既知の問題・制限事項

なし（すべてのテストが通り、問題なく動作）

## 🔮 今後の課題

- [ ] ページコンポーネント（`pages/index.tsx`、`pages/articles/[issueNumber].tsx`）のテスト
  - getStaticProps、getStaticPaths のテストは複雑なため、今回は対象外
- [ ] Layout コンポーネントのテスト（Next.js 固有のコンポーネントのモックが必要）
- [ ] GitHub Actions でのテスト自動実行設定
- [ ] カバレッジ閾値の設定（例: 80%以上）

## 📚 参考リンク

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [実装計画](./.claude/plans/2025-12-23_add-testing-infrastructure.md)

## 💭 振り返り

### うまくいったこと

- Vitest の採用により、セットアップが簡単でテスト実行が高速
- fixture ベースのテストアプローチで、実際のデータ構造を再現できた
- 環境変数の扱いで少し苦戦したが、`vitest.config.ts`の`test.env`で解決
- すべてのコアロジックをテストでカバーできた

### 改善できること

- ページコンポーネントのテストを追加したい（Next.js のモッキングが必要）
- カバレッジを測定して、抜け漏れを確認したい

### 学んだこと

- Vitest の環境変数設定は`test.env`で行う
- モジュールレベルで評価される変数は、インポート前に環境変数を設定する必要がある
- Testing Library のクエリは直感的で、保守性の高いテストが書ける

---

**関連ドキュメント**:

- 実装計画: `.claude/plans/2025-12-23_add-testing-infrastructure.md`
- 開発ルール: `CLAUDE.md`
