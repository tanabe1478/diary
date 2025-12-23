# ESLint 9 & Flat Config への移行

> **作成日**: 2025-12-23
> **対象ブランチ**: `refactor/migrate-eslint-9`

## 目的

ESLint 8から9へのメジャーアップデートを実施し、新しいFlat Config形式に移行する。これにより、Next.js 16の最新ESLintルールを適用できるようになる。

## 背景

### 現在のバージョン

- **ESLint**: 8.57.1 → 9.39.2
- **eslint-config-next**: 14.1.0 → 16.1.1
- **@typescript-eslint/eslint-plugin**: 5.62.0 → 8.50.1
- **@typescript-eslint/parser**: 5.62.0 → 8.50.1
- **eslint-config-prettier**: 10.1.8（変更なし、flat config対応済み）

### ESLint 9の主な変更

1. **Flat Config as Default**
   - `.eslintrc.json`は非推奨（ESLint 10で削除予定）
   - `eslint.config.mjs`（または`.js`）が新しい設定ファイル形式
   - 配列ベースの設定形式

2. **Next.js 16の変更**
   - `next lint`コマンドが削除
   - `eslint`を直接使用する必要がある
   - `eslint-config-next@16.1.1`はESLint 9が必要

### 現在の設定

```json
{
  "extends": ["eslint:recommended", "next/core-web-vitals", "prettier"]
}
```

非常にシンプルな設定で、移行は比較的簡単。

## アプローチ

### フェーズ 1: パッケージの更新

1. ESLint 9.39.2へ更新
2. eslint-config-next 16.1.1へ更新
3. @typescript-eslint/\* 8.50.1へ更新

### フェーズ 2: Flat Config への移行

1. `.eslintrc.json`を削除
2. `eslint.config.mjs`を作成
3. Next.js 16の推奨設定を適用
4. Prettierの設定を追加

### フェーズ 3: npm スクリプトの更新

Next.js 16では`next lint`が削除されたため、`eslint`を直接使用：

```json
{
  "lint:next": "eslint .",
  "lint:fix": "eslint --fix ."
}
```

### フェーズ 4: テストと検証

1. `npm run lint`でESLintが正常に動作することを確認
2. すべてのテストが通ることを確認
3. ビルドが成功することを確認

## タスクリスト

### 準備

- [x] ESLint 9の変更を調査
- [x] Flat Configの形式を調査
- [ ] 実装計画の作成
- [ ] ブランチ作成: `refactor/migrate-eslint-9`

### フェーズ 1: パッケージ更新

- [ ] ESLint 9.39.2へ更新
- [ ] eslint-config-next 16.1.1へ更新
- [ ] @typescript-eslint/eslint-plugin 8.50.1へ更新
- [ ] @typescript-eslint/parser 8.50.1へ更新
- [ ] `npm install`の実行

### フェーズ 2: Flat Config 移行

- [ ] `.eslintrc.json`を削除
- [ ] `eslint.config.mjs`を作成
  - `eslint-config-next/core-web-vitals`をインポート
  - `eslint-config-prettier`を追加
  - `.next/`, `out/`, `build/`を無視
- [ ] `.eslintignore`の確認と移行（必要であれば）

### フェーズ 3: npm スクリプト更新

- [ ] `package.json`の`lint:next`を更新
  - `next lint` → `eslint .`
- [ ] `lint:fix`スクリプトを追加（オプション）

### フェーズ 4: テスト

- [ ] `npm run lint`で動作確認
- [ ] `npm run lint:prettier`でPrettierが動作
- [ ] `npm run test:run`ですべてのテストが通る
- [ ] `npm run build`でビルド成功
- [ ] `npm run typecheck`で型チェック

### ドキュメント

- [ ] 実装メモの作成
- [ ] README.mdの更新（必要であれば）

### 仕上げ

- [ ] コミット & プッシュ
- [ ] PR 作成

## 技術的考慮事項

### eslint.config.mjs の設計

Next.js 16の公式推奨設定：

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

**Prettierの追加**:

```javascript
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettierConfig,
  globalIgnores([...]),
])
```

### TypeScript サポート

`eslint-config-next/core-web-vitals`はTypeScriptサポートが含まれているため、追加設定は不要。

ただし、明示的に設定する場合：

```javascript
import nextTS from "eslint-config-next/typescript";
```

### .eslintignore の移行

Flat Configでは`.eslintignore`は非推奨。代わりに`globalIgnores()`を使用。

現在`.eslintignore`ファイルがあるか確認する必要がある。

### パフォーマンス

ESLint 9はパフォーマンスが向上しているため、リント時間が短縮される可能性がある。

### 互換性

ESLint 9は**プラグインの互換性**に影響する可能性がある。ただし、@typescript-eslintも最新版に更新するため、問題ないはず。

## リスク

### 高リスク項目

1. **プラグインの互換性**: 一部のESLintプラグインがFlat Configに対応していない可能性
   - **対策**: 使用しているプラグインは公式のみで、すべてFlat Config対応済み

2. **設定の移行ミス**: `.eslintrc.json`の設定を正しく移行できない可能性
   - **対策**: 現在の設定が非常にシンプルなため、リスクは低い

### 中リスク項目

1. **新しいルールによるエラー**: ESLint 9で新しいルールが追加され、既存コードでエラーが発生する可能性
   - **対策**: エラーが発生した場合は、適切に修正または無効化

### 低リスク項目

1. **npm スクリプトの変更**: `next lint`から`eslint .`への変更
   - **影響**: 最小限、スクリプト名は変更なし

## 成功基準

### 最低限の成功基準

- [ ] `npm run lint`が正常に動作する
- [ ] すべてのテスト（14テスト）が通る
- [ ] ビルドが成功する
- [ ] 型チェックが通る

### 理想的な成功基準

- [ ] ESLint 9の新しいルールが適用されている
- [ ] リント時間が短縮されている（またはほぼ同じ）
- [ ] 警告・エラーが適切に表示される

## 参考資料

### ESLint 9

- [Configuration Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Migrate to v9.x](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)
- [ESLint 9 and Flat Config Guide](https://jeffbruchado.com.br/en/blog/eslint-9-flat-config-migration-configuration-guide-2025)

### Next.js 16

- [Configuration: ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Next.js 16 Linting setup using ESLint 9 flat config](https://chris.lu/web_development/tutorials/next-js-16-linting-setup-eslint-9-flat-config)
- [Support for eslint v9](https://github.com/vercel/next.js/discussions/54238)

### TypeScript ESLint

- [@typescript-eslint v8 Release](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8/)

## 次のステップ（この PR 後）

1. Prettier 3への移行（別PR）
2. Tailwind CSS 4への移行（別PR）

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
- [React 19 & Next.js 16アップデート](../../docs/implementations/2025-12-23_upgrade-react-19-nextjs-16.md)
