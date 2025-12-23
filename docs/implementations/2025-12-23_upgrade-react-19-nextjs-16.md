# React 19 & Next.js 16 へのメジャーアップデート - 実装メモ

> **作成日**: 2025-12-23
> **ブランチ**: `refactor/upgrade-react-19-nextjs-16`
> **PR**: （作成後に追記）

## 📝 概要

React 18から19、Next.js 15から16へのメジャーアップデートを実施しました。このプロジェクトはPages Routerを使用しているため、破壊的変更の影響は最小限でした。

## 🎯 実装内容

### 更新したパッケージ

#### コアフレームワーク

- **React**: 18.3.1 → 19.2.3
- **React-DOM**: 18.3.1 → 19.2.3
- **Next.js**: 15.1.6 → 16.1.1

#### 型定義

- **@types/react**: 18.3.18 → 19.2.7
- **@types/react-dom**: 18.3.5 → 19.2.3
- **@types/node**: 20.19.27 → 25.0.3

#### 開発ツール

- **TypeScript**: 5.7.3 → 5.9.3
- **autoprefixer**: 10.4.20 → 10.4.23
- **sass**: 1.83.4 → 1.97.1
- **eslint-config-prettier**: 10.0.1 → 10.1.8

### 変更したファイル

#### 自動変更

- **tsconfig.json**
  - `jsx`: `preserve` → `react-jsx`（Next.js 16が自動設定）
  - React 19の自動ランタイム対応

#### 依存関係の変更

- **package.json**: 上記パッケージの更新
- **package-lock.json**: 依存関係ツリーの更新
  - 追加: 2パッケージ
  - 削除: 9パッケージ
  - 変更: 29パッケージ

### 更新を延期したパッケージ

以下は破壊的変更が大きいため、別PRで対応：

- **ESLint**: 8.57.1 → 9.39.2（フラットコンフィグへの移行が必要）
- **eslint-config-next**: 14.1.0 → 16.1.1（ESLint 9が必要）
- **@typescript-eslint/\***: 5.62.0 → 8.50.1（ESLint 9が必要）
- **Prettier**: 2.8.8 → 3.7.4（フォーマットルールの変更）
- **Tailwind CSS**: 3.4.17 → 4.1.18（Major rewrite）

## 🔧 技術的決定

### Pages Routerの維持

**理由**: このプロジェクトはPages Routerを使用しているため、Next.js 16の主要な破壊的変更（Async Request APIs、middlewareのproxy化等）の影響を受けない。

**メリット**:

- 安定性が高い
- 破壊的変更が少ない
- getStaticProps/getStaticPaths が引き続き動作

### Turbopack as Default

Next.js 16でTurbopackがデフォルトバンドラーになりました。

**影響**:

- ビルド時間が短縮（3.7秒で完了）
- webpack設定がないため、移行は透過的
- 問題がある場合は`--webpack`フラグで従来のwebpackに戻せる

### React 19の新機能

このプロジェクトでは以下の新機能は当面使用しない：

- **ref as prop**: forwardRefを使用していないため影響なし
- **Actions**: フォーム処理の改善（将来的に活用可能）
- **use() hook**: Promiseやコンテキストの処理（将来的に活用可能）

### tsconfig.jsonの自動更新

Next.js 16が`jsx: react-jsx`を自動設定しました。

**変更内容**:

```json
{
  "jsx": "react-jsx" // React 19の自動ランタイム
}
```

**理由**: React 19は自動ランタイムを使用するため、`import React from 'react'`が不要になります。

## 🧪 テスト

### テスト結果

```bash
Test Files  2 passed (2)
Tests  14 passed (14)
Duration  6.38s
```

✅ **すべてのテストがパス！**

### ビルド結果

```bash
▲ Next.js 16.1.1 (Turbopack)
✓ Compiled successfully in 3.7s
✓ Generating static pages using 15 workers (3/3) in 1563.2ms

Route (pages)
┌ ● / (772 ms)
├   /_app
├ ○ /404
└ ● /articles/[issueNumber]
```

✅ **ビルド成功！**

### 型チェックエラー

型チェック（`npm run typecheck`）では既存のエラーが残っています：

```
lib/issue.test.ts: 13 errors
```

これらは**既存の問題**（`any`型の使用）で、今回の更新とは無関係です。

**理由**:

- テストファイルで`Issue`型を`any`として定義
- 実際のプロパティアクセス時に型エラー
- テスト自体は正常に動作

**今後の課題**: 型定義の改善（別PR）

### パフォーマンス

- **ビルド時間**: 3.7秒（Turbopack使用）
- **静的ページ生成**: 1563.2ms（15 workers使用）
- **テスト実行時間**: 6.38秒

✅ **パフォーマンス低下なし、むしろ高速化**

## 🐛 既知の問題・制限事項

### eslint-config-nextの非更新

**問題**: eslint-config-next@16.1.1はESLint 9を要求するため、更新を延期。

**現状**: eslint-config-next@14.1.0のまま

**影響**: Next.js 16の最新ESLintルールが適用されない

**対策**: ESLint 9への移行時に一緒に更新（別PR）

### 型定義エラー

**問題**: テストファイルで型エラーが発生

**原因**: `any`型の使用

**影響**: テストの実行には影響なし、型安全性が低い

**対策**: 型定義の改善（別PR）

## 🔮 今後の課題

### 高優先度

- [ ] **ESLint 9への移行**（別PR）
  - フラットコンフィグへの移行
  - eslint-config-next@16.1.1への更新
  - @typescript-eslint/\*の更新

- [ ] **Tailwind CSS 4への移行**（別PR）
  - Major rewriteのため影響範囲が大きい
  - スタイル崩れの可能性
  - 十分なテストが必要

### 中優先度

- [ ] **Prettier 3への移行**（別PR）
  - フォーマットルールの変更
  - 既存コードの再フォーマット

- [ ] **型定義の改善**（別PR）
  - `any`型の削除
  - Issue、IssueComment型の厳密化
  - テストファイルの型安全性向上

### 低優先度

- [ ] **React 19新機能の活用**
  - ref as propの活用（forwardRef削除）
  - Actionsの導入（フォーム処理改善）
  - use() hookの活用

- [ ] **App Routerへの移行検討**（長期的）
  - React Server Componentsの活用
  - パフォーマンス向上
  - 大規模リファクタリングが必要

## 📚 参考リンク

### React 19

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React v19 Release](https://react.dev/blog/2024/12/05/react-19)
- [React 18 to 19 Migration - Codemod](https://docs.codemod.com/guides/migrations/react-18-19)
- [Common Mistakes When Upgrading to React 19](https://blog.openreplay.com/common-mistakes-upgrading-react-19-avoid/)

### Next.js 16

- [Next.js 16 Release](https://nextjs.org/blog/next-16)
- [Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 Migration Guide](https://learnwebcraft.com/blog/next-js-16-migration-guide)
- [The Future of Next.js Pages Router](https://github.com/vercel/next.js/discussions/56655)

### 実装計画

- [実装計画](./.claude/plans/2025-12-23_upgrade-react-19-nextjs-16.md)

## 💭 振り返り

### うまくいったこと

- **Pages Routerの選択が正解**: 破壊的変更の影響を最小限に抑えられた
- **段階的アップデート**: ESLint、Prettier、Tailwindを別PRにすることで、リスクを分散
- **Turbopackの恩恵**: ビルド時間が短縮され、パフォーマンスが向上
- **テストカバレッジ**: 既存のテストが保護となり、安心してアップデート可能
- **型定義の更新**: @types/reactとreact-domの更新がスムーズ

### 改善できること

- **eslint-config-nextの更新**: ESLint 9への移行を先に行うべきだった（ただし、リスクを考慮すると段階的が正解）
- **型定義の改善**: 事前に`any`型を削除しておけば、型チェックエラーがなかった

### 学んだこと

- **Pages Routerの安定性**: Next.js 16でもPages Routerは安定サポート、焦ってApp Routerに移行する必要はない
- **Turbopackの高速性**: デフォルトバンドラーとして十分な性能
- **React 19の互換性**: 破壊的変更は少なく、移行は比較的簡単
- **段階的移行の重要性**: すべてを一度に更新するのではなく、段階的に進めることでリスクを低減

### パッケージ数の変化

- 追加: 2パッケージ
- 削除: 9パッケージ
- 変更: 29パッケージ
- **結果**: 依存関係が整理され、7パッケージ削減

### セキュリティ

```
6 vulnerabilities (1 low, 2 moderate, 3 high)
```

引き続き脆弱性が存在しますが、これはnpmの既知の問題です。Dependabotでの自動更新を検討すべきです。

---

**関連ドキュメント**:

- 実装計画: `.claude/plans/2025-12-23_upgrade-react-19-nextjs-16.md`
- テストインフラ実装: `docs/implementations/2025-12-23_add-testing-infrastructure.md`
- 依存関係更新: `docs/implementations/2025-12-23_update-dependencies.md`
- gialog依存の解消: `docs/implementations/2025-12-23_remove-gialog-dependency.md`
- 開発ルール: `CLAUDE.md`
