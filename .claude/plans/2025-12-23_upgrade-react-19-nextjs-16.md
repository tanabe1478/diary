# React 19 & Next.js 16 へのメジャーアップデート

> **作成日**: 2025-12-23
> **対象ブランチ**: `refactor/upgrade-react-19-nextjs-16`

## 目的

React 18から19、Next.js 15から16へのメジャーアップデートを実施し、最新の機能とセキュリティパッチを利用可能にする。

## 背景

### 現在のバージョン

- **React**: 18.3.1 → 19.2.3
- **React-DOM**: 18.3.1 → 19.2.3
- **Next.js**: 15.1.6 → 16.1.1
- **TypeScript**: 5.7.3 → 5.9.3
- **ESLint**: 8.57.1 → 9.39.2
- **Prettier**: 2.8.8 → 3.7.4
- **Tailwind CSS**: 3.4.17 → 4.1.18

### 調査結果（破壊的変更の影響）

#### React 19の破壊的変更

✅ **このプロジェクトへの影響: ほぼなし**

- **PropTypes削除**: 使用していない（TypeScript使用）
- **defaultProps削除**: 使用していない
- **String Refs削除**: 使用していない
- **forwardRef**: 使用していない
- **react-test-renderer**: 使用していない（Vitest使用）

#### Next.js 16の破壊的変更

✅ **このプロジェクトへの影響: なし**

- **Async Request APIs**: **App Router専用**の変更、Pages Routerは影響なし
- **middleware → proxy**: middlewareを使用していない
- **Turbopack as Default**: webpack設定なし、そのまま使用可能
- **getStaticProps/getStaticPaths**: **変更なし**、Pages Routerは安定サポート

**結論**: このプロジェクトはPages Routerを使用しているため、Next.js 16の主要な破壊的変更の影響を受けません。

## アプローチ

### フェーズ 1: コア依存関係の更新（React、Next.js）

1. React 19とNext.js 16へのメジャーアップデート
2. 型定義の更新（@types/react、@types/react-dom、@types/node）
3. テストの実行と確認

### フェーズ 2: 開発ツールの更新

1. TypeScript 5.9.3へ更新
2. ESLint 9への更新とeslint-config-nextの更新
3. @typescript-eslint/eslint-plugin、@typescript-eslint/parserの更新
4. Prettier 3への更新

### フェーズ 3: CSSツールの更新

1. Tailwind CSS 4への更新
2. autoprefixer、postcss、sassの更新

### フェーズ 4: その他の依存関係更新

1. eslint-config-prettierの更新
2. 全体テストの実行

## タスクリスト

### 準備

- [x] 破壊的変更の調査
- [x] 影響範囲の確認
- [ ] 実装計画の作成
- [ ] ブランチ作成: `refactor/upgrade-react-19-nextjs-16`

### フェーズ 1: React & Next.js

- [ ] React & React-DOM 19.2.3へ更新
- [ ] Next.js 16.1.1へ更新
- [ ] @types/react 19.2.7へ更新
- [ ] @types/react-dom 19.2.3へ更新
- [ ] @types/node 25.0.3へ更新
- [ ] eslint-config-next 16.1.1へ更新
- [ ] テスト実行（14テスト）
- [ ] ビルド確認

### フェーズ 2: 開発ツール

- [ ] TypeScript 5.9.3へ更新
- [ ] ESLint 9.39.2へ更新
- [ ] @typescript-eslint/eslint-plugin 8.50.1へ更新
- [ ] @typescript-eslint/parser 8.50.1へ更新
- [ ] Prettier 3.7.4へ更新
- [ ] .prettierrcの更新確認
- [ ] テスト実行

### フェーズ 3: CSSツール

- [ ] Tailwind CSS 4.1.18へ更新
- [ ] autoprefixer 10.4.23へ更新
- [ ] sass 1.97.1へ更新
- [ ] Tailwind CSS 4の破壊的変更を確認
- [ ] テスト実行

### フェーズ 4: その他

- [ ] eslint-config-prettier 10.1.8へ更新
- [ ] すべてのテストが通ることを確認
- [ ] ビルドが成功することを確認
- [ ] 開発サーバーが起動することを確認

### ドキュメント

- [ ] 実装メモの作成
- [ ] README.mdの更新（必要であれば）

### 仕上げ

- [ ] コミット & プッシュ
- [ ] PR 作成

## 技術的考慮事項

### React 19の新機能

- **ref as prop**: forwardRefが不要に（将来的に非推奨）
- **Actions**: フォーム処理の改善
- **use() hook**: Promiseやコンテキストの処理
- **Server Components**: 正式サポート（App Router使用時）

このプロジェクトでは当面これらの新機能を使用しないが、将来的にリファクタリングの選択肢が増える。

### Next.js 16の新機能

- **Turbopack as Default**: 高速なバンドラー
- **React 19サポート**: 最新のReact機能が利用可能
- **改善されたキャッシング**: Cache Componentsのopt-in化

### ESLint 9への移行

ESLint 9は**フラットコンフィグ**がデフォルトになる破壊的変更があります。

**対策**:

1. まずはESLint 8のままにして、React 19とNext.js 16の動作確認
2. 別PRでESLint 9への移行を検討
3. または、ESLintの更新を延期

### Prettier 3への移行

Prettier 3も破壊的変更があるため、慎重に移行する必要があります。

**対策**:

1. まずはPrettier 2のままにして、React 19とNext.js 16の動作確認
2. 別PRでPrettier 3への移行を検討

### Tailwind CSS 4への移行

Tailwind CSS 4は**major rewrite**で、多くの破壊的変更があります。

**対策**:

1. まずはTailwind CSS 3のままにして、React 19とNext.js 16の動作確認
2. **別PR**でTailwind CSS 4への移行を検討（推奨）

## 段階的アプローチ（修正版）

上記の技術的考慮事項を踏まえ、以下の段階的アプローチを採用：

### このPR（Phase 1）: コアフレームワークの更新

- React 19.2.3
- React-DOM 19.2.3
- Next.js 16.1.1
- @types/react 19.2.7
- @types/react-dom 19.2.3
- @types/node 25.0.3
- eslint-config-next 16.1.1
- TypeScript 5.9.3
- autoprefixer 10.4.23
- sass 1.97.1
- eslint-config-prettier 10.1.8

### 別PR（Phase 2）: ESLint 9への移行

- ESLint 9.39.2
- @typescript-eslint/eslint-plugin 8.50.1
- @typescript-eslint/parser 8.50.1
- フラットコンフィグへの移行

### 別PR（Phase 3）: Prettier 3への移行

- Prettier 3.7.4
- フォーマット設定の見直し

### 別PR（Phase 4）: Tailwind CSS 4への移行

- Tailwind CSS 4.1.18
- 破壊的変更への対応
- スタイルの検証

## リスク

### 高リスク項目

1. **Tailwind CSS 4**: Major rewriteのため、スタイル崩れの可能性
   - **対策**: 別PRで対応、十分なテストと検証

2. **ESLint 9**: フラットコンフィグへの移行が必要
   - **対策**: 別PRで対応、設定ファイルの書き直し

3. **Prettier 3**: フォーマットルールの変更
   - **対策**: 別PRで対応、既存コードの再フォーマット

### 中リスク項目

1. **Next.js 16**: Turbopackがデフォルトに
   - **対策**: webpack設定がないため影響少ない、問題があれば`--webpack`フラグで対応

2. **React 19**: 新しいランタイムの変更
   - **対策**: テストで保護されている、Pages Routerは安定

### 低リスク項目

1. **TypeScript 5.9**: マイナーバージョンアップ
2. **@types/node 25**: 型定義の更新
3. **autoprefixer、sass**: パッチアップデート

## 成功基準

### 最低限の成功基準

- [ ] すべてのテスト（14テスト）が通る
- [ ] ビルドが成功する（`npm run build`）
- [ ] 開発サーバーが起動する（`npm run dev`）
- [ ] 型チェックが通る（`npm run typecheck`）

### 理想的な成功基準

- [ ] パフォーマンスが低下していない（またはむしろ向上）
- [ ] Turbopackによるビルド高速化を確認
- [ ] React 19の警告がない
- [ ] Next.js 16の警告がない

## 参考資料

### React 19

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React v19](https://react.dev/blog/2024/12/05/react-19)
- [React 18 to 19 Migration - Codemod](https://docs.codemod.com/guides/migrations/react-18-19)

### Next.js 16

- [Next.js 16 Release](https://nextjs.org/blog/next-16)
- [Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 Migration Guide](https://learnwebcraft.com/blog/next-js-16-migration-guide)

### Pages Router

- [Next.js Pages Router Documentation](https://nextjs.org/docs/pages)
- [The Future of Next.js Pages Router](https://github.com/vercel/next.js/discussions/56655)

## 次のステップ（この PR 後）

1. ESLint 9への移行（別PR）
2. Prettier 3への移行（別PR）
3. Tailwind CSS 4への移行（別PR、high priority）
4. App Routerへの移行検討（長期的な課題）

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
- [テストインフラ実装](../../docs/implementations/2025-12-23_add-testing-infrastructure.md)
- [依存関係更新](../../docs/implementations/2025-12-23_update-dependencies.md)
- [gialog依存の解消](../../docs/implementations/2025-12-23_remove-gialog-dependency.md)
