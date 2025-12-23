# Prettier 3 への移行

> **作成日**: 2025-12-23
> **対象ブランチ**: `refactor/upgrade-prettier-3`

## 目的

Prettier 2から3へのメジャーアップデートを実施する。Prettier 3ではフォーマットルールに若干の変更があるため、既存コードの再フォーマットが必要。

## 背景

### 現在のバージョン

- **Prettier**: 2.8.8 → 3.7.4

### Prettier 3の主な変更

#### 1. ECMAScript Modules (ESM) への移行

Prettier 3はCommonJSからESMに移行しました。

**影響**: Node.jsでの使用には影響なし（CLIやnpm scriptsは変わらず動作）

#### 2. フォーマット変更

- **Markdown**: ラテン文字とCJK文字（中国語、日本語、韓国語）の間のスペース挿入ルールが変更
- **Korean Text**: 韓国語のテキストラッピングが英語と同様に動作
- **TypeScript/Flow**: 3.7で体験が洗練

**影響**: 既存のフォーマット済みコードが再フォーマットされる可能性

#### 3. Plugin API変更

Legacy Plugin APIが削除されました。

**影響**: このプロジェクトではPrettierプラグインを使用していないため、影響なし

### 現在の設定

このプロジェクトには`.prettierrc`ファイルがなく、デフォルト設定を使用しています。

- `.prettierignore`ファイルのみ存在

## アプローチ

### フェーズ 1: パッケージの更新

1. Prettier 3.7.4へ更新

### フェーズ 2: コードの再フォーマット

1. `npm run lint:prettier`でコード全体を再フォーマット
2. 変更内容を確認

### フェーズ 3: テストと検証

1. すべてのテストが通ることを確認
2. ビルドが成功することを確認
3. フォーマット変更が適切であることを確認

## タスクリスト

### 準備

- [x] Prettier 3の変更を調査
- [ ] 実装計画の作成
- [ ] ブランチ作成: `refactor/upgrade-prettier-3`

### フェーズ 1: パッケージ更新

- [ ] Prettier 3.7.4へ更新
- [ ] `npm install`の実行

### フェーズ 2: 再フォーマット

- [ ] `npm run lint:prettier`で全ファイルを再フォーマット
- [ ] 変更内容の確認
  - Markdownファイルのフォーマット変更
  - TypeScript/JavaScriptファイルのフォーマット変更

### フェーズ 3: テスト

- [ ] `npm run test:run`ですべてのテストが通る
- [ ] `npm run build`でビルド成功
- [ ] `npm run lint:next`でリントエラーなし
- [ ] `npm run typecheck`で型チェック

### ドキュメント

- [ ] 実装メモの作成

### 仕上げ

- [ ] コミット & プッシュ
- [ ] PR 作成

## 技術的考慮事項

### デフォルト設定の維持

このプロジェクトは`.prettierrc`ファイルがなく、デフォルト設定を使用しています。

**決定**: デフォルト設定を維持する

**理由**:

- カスタム設定が不要
- Prettierのベストプラクティスに従う
- 設定ファイルの管理が不要

### .prettierignore の確認

既存の`.prettierignore`を確認し、必要に応じて更新します。

### フォーマット変更の影響

Prettier 3ではフォーマットルールが若干変更されています。

**予想される変更**:

- Markdownファイル（`README.md`、実装メモ等）のフォーマット
- TypeScript/JavaScriptファイルの細かい整形

**対策**:

- `git diff`で変更内容を確認
- 意図しない変更がないか検証

### ESM移行の影響

Prettier 3はESMに移行していますが、CLI使用には影響ありません。

**確認点**:

- npm scriptsが正常に動作すること

## リスク

### 低リスク項目

1. **フォーマット変更**: コードの動作には影響なし、見た目のみの変更
   - **対策**: 変更内容を確認し、適切であることを検証

2. **ESM移行**: CLI使用には影響なし
   - **対策**: npm scriptsが正常に動作することを確認

### リスクなし

- プラグイン非使用のため、Plugin API変更の影響なし
- デフォルト設定使用のため、設定ファイルの移行不要

## 成功基準

### 最低限の成功基準

- [ ] Prettier 3.7.4がインストールされている
- [ ] `npm run lint:prettier`が正常に動作する
- [ ] すべてのテスト（14テスト）が通る
- [ ] ビルドが成功する

### 理想的な成功基準

- [ ] フォーマット変更が適切である
- [ ] コードの可読性が維持または向上している
- [ ] 不要なフォーマット変更がない

## 参考資料

### Prettier 3

- [Prettier 3.0: Hello, ECMAScript Modules!](https://prettier.io/blog/2023/07/05/3.0.0.html)
- [Prettier Blog](https://prettier.io/blog)
- [How to migrate my plugin to support Prettier v3?](https://github.com/prettier/prettier/wiki/How-to-migrate-my-plugin-to-support-Prettier-v3%3F)
- [Prettier CHANGELOG](https://github.com/prettier/prettier/blob/main/CHANGELOG.md)

## 次のステップ（この PR 後）

1. Tailwind CSS 4への移行（別PR、最後の技術的負債）

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
- [ESLint 9移行](../../docs/implementations/2025-12-23_migrate-eslint-9.md)
- [React 19 & Next.js 16アップデート](../../docs/implementations/2025-12-23_upgrade-react-19-nextjs-16.md)
