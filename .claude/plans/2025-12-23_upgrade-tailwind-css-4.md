# Tailwind CSS 4 への移行

> **作成日**: 2025-12-23
> **対象ブランチ**: `refactor/upgrade-tailwind-css-4`
> **⚠️ 警告**: これは非常に大きな変更を伴う移行です

## 目的

Tailwind CSS 3から4へのメジャーアップデートを実施する。Tailwind CSS 4は完全な書き直しで、設定システム、Import構文、CSSプリプロセッサのサポートなど、多くの破壊的変更があります。

## 背景

### 現在のバージョン

- **Tailwind CSS**: 3.4.17 → 4.1.18
- **postcss**: 8.5.6 → （更新必要性を確認）
- **autoprefixer**: 10.4.23 → （Tailwind CSS 4では不要になる可能性）

### 現在の構成

#### 使用ファイル

- `tailwind.config.js` - JavaScript設定
- `postcss.config.js` - PostCSS設定
- `styles/globals.scss` - グローバルスタイル（**SCSS使用**）
- `styles/markdown.scss` - Markdownスタイル（**SCSS使用**）

#### SCSS使用状況

```scss
// styles/globals.scss
a {
  color: rgb(0, 0, 238);
  @apply underline;
  @apply dark:text-blue-400;

  &:visited {  // Sass ネスト記法
    color: rgb(85, 26, 139);
    @apply dark:text-violet-300;
  }
}
```

#### @apply使用箇所

- `styles/globals.scss`: 3箇所
- `styles/markdown.scss`: 3箇所
- **合計**: 6箇所

### Tailwind CSS 4の主な変更

#### 1. ⚠️ CSSプリプロセッサの非推奨

**最も重大な変更**: Sass/SCSS/Lessは非推奨になりました。

**公式の立場**:
> Tailwind CSS v4.0 is not designed to be used with CSS preprocessors like Sass, Less, or Stylus. Tailwind CSS itself should be considered your preprocessor.

**影響**: `styles/globals.scss`と`styles/markdown.scss`を`.css`に変換する必要がある

#### 2. 設定システムの完全な書き換え

**v3**:
```javascript
// tailwind.config.js
module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**v4**:
```css
/* styles/globals.css */
@import "tailwindcss";

@theme {
  /* CSS変数でテーマを定義 */
}
```

`tailwind.config.js`ファイルは削除され、すべてCSSで設定します。

#### 3. Import構文の変更

**v3**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4**:
```css
@import "tailwindcss";
```

1行で完結します。

#### 4. @applyの扱い

`@apply`は引き続き動作しますが、**推奨されません**。

**推奨アプローチ**: 純粋なCSSプロパティを使用

#### 5. ブラウザサポート

- **Safari**: 16.4+
- **Chrome**: 111+
- **Firefox**: 128+

古いブラウザのサポートが必要な場合、v3を維持すべきです。

#### 6. パフォーマンス向上

- **フルビルド**: 3-10倍高速
- **インクリメンタルビルド**: 最大100倍高速

## アプローチ

### 選択肢 1: フル移行（推奨しない）

完全にTailwind CSS 4の方針に従う：

1. SCSSをCSSに変換
2. `@apply`を削除し、純粋なCSSに変換
3. `tailwind.config.js`を削除し、CSS設定に移行

**メリット**: 最新機能、パフォーマンス向上
**デメリット**: 非常に大きな変更、リスクが高い、スタイル崩れの可能性

### 選択肢 2: 段階的移行（推奨）

Tailwind CSS 4に更新しつつ、既存の構造を維持：

1. Tailwind CSS 4にアップデート
2. SCSSは一旦維持（互換性モード）
3. `@apply`は維持（動作する）
4. Import構文のみ更新

**メリット**: リスクが低い、動作を確認してから次のステップへ
**デメリット**: v4の思想に完全に従っていない

### 選択肢 3: v3を維持（最も安全）

Tailwind CSS 3のまま維持：

**メリット**: リスクゼロ、安定動作
**デメリット**: v4の新機能・パフォーマンス向上を得られない
**サポート**: v3は2026年までサポート予定

## 推奨アプローチ

**選択肢 2: 段階的移行** を推奨します。

### 理由

1. **リスク管理**: 一度にすべてを変更するとデバッグが困難
2. **SCSS使用**: このプロジェクトはSCSS機能（ネスト、変数）を活用している
3. **@apply使用**: 6箇所のみで、動作するなら維持可能
4. **検証可能**: 動作確認してから次のステップへ進める

## タスクリスト

### 準備

- [x] Tailwind CSS 4の変更を調査
- [x] 現在の使用状況を分析
- [ ] 実装計画の作成
- [ ] ブランチ作成: `refactor/upgrade-tailwind-css-4`

### フェーズ 1: パッケージ更新

- [ ] Tailwind CSS 4.1.18へ更新
- [ ] 関連パッケージの更新確認
- [ ] `npm install`の実行

### フェーズ 2: Import構文の更新

- [ ] `styles/globals.scss`のImport構文を更新
  - `@tailwind base; @tailwind components; @tailwind utilities;` → `@import "tailwindcss";`

### フェーズ 3: 設定ファイルの対応

- [ ] `tailwind.config.js`を維持（互換性モード）
- [ ] または、CSS設定に移行

### フェーズ 4: PostCSS設定の更新

- [ ] `postcss.config.js`の更新確認
- [ ] autoprefixerの必要性確認

### フェーズ 5: テスト

- [ ] `npm run dev`で開発サーバー起動
- [ ] スタイルが正しく適用されているか確認
- [ ] ダークモードが動作するか確認
- [ ] `npm run build`でビルド成功
- [ ] `npm run test:run`ですべてのテストが通る

### フェーズ 6: スタイル修正（必要に応じて）

- [ ] スタイル崩れがあれば修正
- [ ] ダークモードの動作確認

### ドキュメント

- [ ] 実装メモの作成
- [ ] 変更内容の記録

### 仕上げ

- [ ] コミット & プッシュ
- [ ] PR 作成

## 技術的考慮事項

### SCSSの維持について

Tailwind CSS 4は公式にはSCSSを非推奨としていますが、技術的には動作します。

**維持する場合**:
- `sass`パッケージを維持
- ネスト記法、変数などが使用可能
- 将来的にCSSに移行する余地を残す

**CSSに移行する場合**:
- ネスト記法を`:is()`や標準のネストで代替
- Sass変数をCSS変数で代替
- 大きな書き換えが必要

### @applyの代替

`@apply dark:text-gray-300` → `color: var(--color-gray-300);`

しかし、ダークモード対応が複雑になる可能性があります。

### ブラウザ互換性

現代のブラウザ（2023年以降）であれば問題ありませんが、古いブラウザのサポートが必要な場合はv3を維持すべきです。

## リスク

### 高リスク項目

1. **スタイル崩れ**: v4のデフォルトスタイル変更により、既存のスタイルが崩れる可能性
   - **対策**: 段階的移行、テスト、目視確認

2. **ダークモードの動作**: `@apply dark:xxx`が正しく動作しない可能性
   - **対策**: 動作確認、必要に応じて修正

3. **ビルドエラー**: PostCSS設定の互換性問題
   - **対策**: エラーメッセージを確認し、設定を調整

### 中リスク項目

1. **パフォーマンス変化**: ビルド時間が変わる可能性（通常は高速化）

2. **開発体験**: Hot Reloadの動作が変わる可能性

## 成功基準

### 最低限の成功基準

- [ ] Tailwind CSS 4がインストールされている
- [ ] `npm run dev`が正常に動作する
- [ ] すべてのスタイルが適用されている
- [ ] ダークモードが動作する
- [ ] すべてのテスト（14テスト）が通る
- [ ] ビルドが成功する

### 理想的な成功基準

- [ ] スタイル崩れがない
- [ ] ビルド時間が短縮されている
- [ ] Hot Reloadが高速化されている

## 参考資料

### Tailwind CSS 4

- [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS 4.0 Migration Guide (Medium)](https://medium.com/@mernstackdevbykevin/tailwind-css-v4-0-complete-migration-guide-breaking-changes-you-need-to-know-7f99944a9f95)
- [What's New and Migration Guide](https://dev.to/kasenda/whats-new-and-migration-guide-tailwind-css-v40-3kag)
- [Everything you need to know about Tailwind CSS v4](https://tailkit.com/blog/everything-you-need-to-know-about-tailwind-css-v4)
- [Upgrading to Tailwind v4.0](https://timomeh.de/posts/upgrading-to-tailwind-v4)
- [Tailwind CSS 4.0: Everything you need to know](https://daily.dev/blog/tailwind-css-40-everything-you-need-to-know-in-one-place)

## 代替案

### 代替案 1: Tailwind CSS 3を維持

v4への移行を見送り、v3を継続使用。

**採用する場合**:
- ブラウザ互換性が重要
- SCSSを継続使用したい
- リスクを最小限に抑えたい

### 代替案 2: 将来的に移行

今は見送り、v4が安定してから移行。

**採用する場合**:
- Early Adopterリスクを避けたい
- v4のエコシステムが成熟するのを待ちたい

## 次のステップ（この PR 後）

すべての技術的負債が解消されます！🎉

---

**関連ドキュメント**:

- [CLAUDE.md](../../CLAUDE.md)
- [開発ワークフロー](../workflow.md)
- [Prettier 3移行](../../docs/implementations/2025-12-23_upgrade-prettier-3.md)
- [ESLint 9移行](../../docs/implementations/2025-12-23_migrate-eslint-9.md)
- [React 19 & Next.js 16アップデート](../../docs/implementations/2025-12-23_upgrade-react-19-nextjs-16.md)
