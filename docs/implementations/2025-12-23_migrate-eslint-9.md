# ESLint 9 & Flat Config への移行 - 実装メモ

> **作成日**: 2025-12-23
> **ブランチ**: `refactor/migrate-eslint-9`
> **PR**: （作成後に追記）

## 📝 概要

ESLint 8から9へのメジャーアップデートを実施し、新しいFlat Config形式（`eslint.config.mjs`）に移行しました。これにより、Next.js 16の最新ESLintルールが適用可能になりました。

## 🎯 実装内容

### 更新したパッケージ

#### ESLint関連

- **ESLint**: 8.57.1 → 9.39.2
- **eslint-config-next**: 14.1.0 → 16.1.1
- **@typescript-eslint/eslint-plugin**: 5.62.0 → 8.50.1
- **@typescript-eslint/parser**: 5.62.0 → 8.50.1
- **eslint-config-prettier**: 10.1.8（変更なし、flat config対応済み）

#### テスト関連（追加）

- **@testing-library/dom**: ^10.4.1（新規追加、devDependency）

### 追加したファイル

- **eslint.config.mjs** - 新しいFlat Config形式の設定ファイル

```javascript
import { defineConfig } from 'eslint/config'
import nextConfig from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  ...nextConfig,
  prettierConfig,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      '.git/**',
      'coverage/**',
    ],
  },
])

export default eslintConfig
```

### 削除したファイル

- **.eslintrc.json** - 旧形式の設定ファイル

### 変更したファイル

#### package.json

**npm scripts の変更**:

```json
{
  "lint:next": "eslint ."  // "next lint" から変更
}
```

**理由**: Next.js 16では`next lint`コマンドが削除されたため、`eslint`を直接使用する必要がある。

**dependencies の整理**:

- `@testing-library/dom`をdevDependenciesに移動
  - npm installが誤ってdependenciesに配置したため、手動で修正

## 🔧 技術的決定

### Flat Config形式の採用

**理由**: ESLint 9でFlat Configがデフォルトになり、`.eslintrc.*`は非推奨（ESLint 10で削除予定）。

**メリット**:

- モジュールベースの設定（ESMインポート）
- 配列ベースで設定が明確
- プログラマブルで拡張性が高い

### eslint-config-next/core-web-vitals の使用

Next.js 16の公式推奨設定を使用：

- **core-web-vitals**: Core Web Vitalsに関連するルールを含む
- TypeScriptサポートが含まれている
- 追加設定なしでNext.js最適化が適用される

### Prettierとの統合

`eslint-config-prettier`をインポートして、フォーマットルールの競合を防止：

```javascript
prettierConfig,  // Disable formatting rules that conflict with Prettier
```

### --legacy-peer-deps の使用

パッケージ更新時に`--legacy-peer-deps`を使用：

**理由**: peer dependencyの競合により、通常のインストールが失敗

**影響**: 一部の依存関係（`@testing-library/dom`）が自動インストールされず、手動で追加が必要

### ignores の設定

Flat Configでは`.eslintignore`が非推奨なため、`ignores`プロパティで設定：

```javascript
{
  ignores: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    '.git/**',
    'coverage/**',
  ],
}
```

## 🧪 テスト

### テスト結果

```bash
✅ npm run lint:next - エラーなし
✅ Test Files  2 passed (2)
✅ Tests  14 passed (14)
✅ Build successful (3.7s with Turbopack)
```

### 遭遇した問題と解決

#### 問題 1: @testing-library/dom が見つからない

**エラー**:
```
Error: Cannot find module '@testing-library/dom'
```

**原因**: `--legacy-peer-deps`使用時に依存関係が正しくインストールされなかった

**解決**: 明示的にインストール
```bash
npm install @testing-library/dom
```

その後、`devDependencies`に移動（手動修正）

### リンター実行確認

```bash
$ npm run lint:next
> eslint .

# エラーなし、すべてのルールに準拠
```

## 🐛 既知の問題・制限事項

### なし

すべての機能が正常に動作しています。

## 📦 依存関係の変化

- **追加**: 31パッケージ
- **削除**: 40パッケージ
- **変更**: 37パッケージ
- **結果**: 9パッケージ削減

脆弱性も改善：
- **以前**: 6 vulnerabilities (1 low, 2 moderate, 3 high)
- **現在**: 4 vulnerabilities (1 low, 2 moderate, 1 high)

## 🔮 今後の課題

- [ ] **Prettier 3への移行**（別PR）
  - フォーマットルールの変更
  - 既存コードの再フォーマット

- [ ] **Tailwind CSS 4への移行**（別PR）
  - Major rewrite
  - スタイル崩れの可能性

- [ ] **型定義の改善**（別PR）
  - `any`型の削除
  - Issue、IssueComment型の厳密化

## 📚 参考リンク

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

- [@typescript-eslint v8](https://typescript-eslint.io/blog/announcing-typescript-eslint-v8/)

### 実装計画

- [実装計画](./.claude/plans/2025-12-23_migrate-eslint-9.md)

## 💭 振り返り

### うまくいったこと

- **Flat Configへの移行がスムーズ**: 既存の設定がシンプルだったため、移行が簡単だった
- **Next.js 16の推奨設定**: 公式の設定をそのまま使用でき、複雑なカスタマイズ不要
- **TypeScriptサポート**: `eslint-config-next/core-web-vitals`がTypeScriptを自動サポート
- **パフォーマンス**: リント時間は変わらず、むしろわずかに高速化
- **Prettierとの統合**: `eslint-config-prettier`がflat config対応済みで問題なし

### 改善できること

- **--legacy-peer-deps**: 通常のインストールで成功するのが理想だが、peer dependency競合が解消されるまでは仕方ない
- **@testing-library/dom**: 最初から`devDependencies`に正しく配置されるべきだった

### 学んだこと

- **Flat Configの利点**: ESMベースで設定が明確、プログラマブルで拡張しやすい
- **Next.js 16の変更**: `next lint`コマンドの削除、`eslint`直接使用が標準に
- **ESLint 9の互換性**: 公式プラグイン（`@typescript-eslint/*`、`eslint-config-next`）は完全対応済み
- **段階的移行の重要性**: React 19、Next.js 16を先に更新してからESLint 9に移行したことで、問題を分離できた

### パッケージ数の変化

- 追加: 31パッケージ
- 削除: 40パッケージ
- 変更: 37パッケージ
- **結果**: 9パッケージ削減、依存関係ツリーが整理された

---

**関連ドキュメント**:

- 実装計画: `.claude/plans/2025-12-23_migrate-eslint-9.md`
- React 19 & Next.js 16アップデート: `docs/implementations/2025-12-23_upgrade-react-19-nextjs-16.md`
- 依存関係更新: `docs/implementations/2025-12-23_update-dependencies.md`
- gialog依存の解消: `docs/implementations/2025-12-23_remove-gialog-dependency.md`
- 開発ルール: `CLAUDE.md`
