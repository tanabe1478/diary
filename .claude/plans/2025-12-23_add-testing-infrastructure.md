# テストインフラストラクチャの追加

> **作成日**: 2025-12-23
> **対象ブランチ**: `test/add-testing-infrastructure`

## 目的

技術的負債解消（ライブラリ更新、gialog 依存の除去）を安全に行うため、現状の動作を保証するテストコードを実装する。

## 背景

このプロジェクトには現在テストコードが存在しない。以下の技術的負債を解消する前に、既存機能が正しく動作することを担保する必要がある：

1. **gialog への依存**: `r7kamura/gialog-sync@v1` に依存しているが、これを独自実装に置き換える必要がある
2. **古いライブラリ**: 多数のライブラリがメジャーバージョン遅れている
   - date-fns: 2.30.0 → 4.1.0
   - glob: 7.2.3 → 13.0.0
   - react/react-dom: 18.3.1 → 19.2.3
   - next: 15.5.9 → 16.1.1
   - その他 remark/rehype 系パッケージ

## アプローチ

### フェーズ 1: テスト環境のセットアップ

- Vitest をテストランナーとして採用（高速、Next.js と親和性高い）
- Testing Library でコンポーネントテスト
- テストデータ（fixtures）の準備

### フェーズ 2: コアロジックのテスト（最優先）

`lib/issue.ts` の全関数をテスト：

- `getIssue()`: 個別記事の読み込み
- `listIssues()`: 記事一覧の取得とソート
- `listIssueComments()`: コメントの取得
- `renderMarkdown()`: Markdown→HTML 変換（GFM、GitHub links 含む）

### フェーズ 3: ページコンポーネントのテスト

- `pages/index.tsx`: 一覧ページのレンダリング
- `pages/articles/[issueNumber].tsx`: 詳細ページのレンダリング

### フェーズ 4: UI コンポーネントのテスト

- `components/Time.tsx`: 日時フォーマット
- `components/Layout.tsx`: レイアウト

## タスクリスト

### セットアップ

- [x] 開発ルールのドキュメント化（CLAUDE.md, .claude/）
- [ ] ブランチ作成: `test/add-testing-infrastructure`
- [ ] Vitest、Testing Library 等のインストール
- [ ] Vitest 設定ファイル作成
- [ ] テストデータ（fixtures）の準備

### テスト実装

- [ ] `lib/issue.ts` のユニットテスト
  - [ ] `getIssue()` のテスト
  - [ ] `listIssues()` のテスト
  - [ ] `listIssueComments()` のテスト
  - [ ] `renderMarkdown()` のテスト
- [ ] ページコンポーネントのテスト
  - [ ] `pages/index.tsx` のテスト
  - [ ] `pages/articles/[issueNumber].tsx` のテスト
- [ ] UI コンポーネントのテスト
  - [ ] `components/Time.tsx` のテスト
  - [ ] `components/Layout.tsx` のテスト

### 仕上げ

- [ ] すべてのテストが通ることを確認
- [ ] package.json にテストスクリプト追加
- [ ] 実装メモの作成
- [ ] README 更新（テスト実行方法を追記）
- [ ] コミット & プッシュ
- [ ] PR 作成

## 技術的考慮事項

### テストランナーの選択: Vitest

**理由**:

- Jest 互換の API で学習コストが低い
- 高速（ESM ネイティブサポート）
- Next.js との統合が容易
- TypeScript 完全サポート

**代替案**: Jest

- より成熟しているが、設定が複雑でパフォーマンスが劣る

### テストデータの準備

- `__fixtures__/` ディレクトリに実際の GitHub Issue と同じ構造の Markdown ファイルを配置
- Front Matter 形式でメタデータを含める
- 複数のテストケースをカバー（基本的な Markdown、GFM、GitHub links など）

### モックの方針

- ファイルシステム操作はモックせず、実際の fixture ファイルを使用
- 外部 API 呼び出しがある場合はモック

### CI への統合

- 将来的には GitHub Actions でテストを自動実行
- 今回はローカルテストの実装に集中

## リスク

1. **テストデータの維持**: fixture データが実際のデータと乖離する可能性
   - 対策: 実際の data ブランチから抽出したデータを使用

2. **Markdown 処理の複雑性**: unified/remark/rehype のテストが複雑になる可能性
   - 対策: スナップショットテストを活用

3. **Next.js 特有の機能**: getStaticProps 等のテストが難しい可能性
   - 対策: ロジック部分と React コンポーネントを分離してテスト

## 代替案

### 代替案 1: E2E テストのみ

- Playwright/Cypress で完全な E2E テスト
- **却下理由**: 実行時間が長く、失敗時のデバッグが困難

### 代替案 2: Jest の使用

- より成熟したテストフレームワーク
- **却下理由**: 設定の複雑さ、パフォーマンス

## 成功基準

- [ ] `lib/issue.ts` の全関数が 80%以上のカバレッジ
- [ ] 主要ページコンポーネントのレンダリングテストが通る
- [ ] `npm test` ですべてのテストが実行できる
- [ ] テストが 10 秒以内に完了する

## 次のステップ（この PR 後）

1. GitHub Actions でテストを自動実行
2. 依存ライブラリの更新（テストで保護されている）
3. gialog 依存の除去（テストで動作確認しながら）

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
