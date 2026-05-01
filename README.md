# Diary

GitHub Issues をブログ記事として活用する静的サイトジェネレーター

## サイト

https://tanabe1478.github.io/diary/

## 開発

### セットアップ

```bash
npm install
```

### 開発サーバー

```bash
npm run dev
```

### ビルド

```bash
npm run build
```

## ブログ執筆アプリ

GitHub Issue を作成して記事を投稿するためのデスクトップアプリを同梱しています。
Windows と macOS では同じ Electron アプリとして起動・配布できます。

### 起動

```bash
npm run app:dev
```

初回起動後、以下を設定して保存してください。

- `Owner`: `tanabe1478`
- `Repo`: `diary`
- `GitHub Token`: 対象リポジトリの Issues read/write と Contents read/write 権限を持つ fine-grained personal access token
- `Theme`: Light または Dark

トークンはこの端末のアプリ設定に保存されます。開発中の互換用として `.env.local` に以下を置くこともできます。

```env
GITHUB_TOKEN=github_pat_...
GITHUB_REPOSITORY=tanabe1478/diary
```

本文を書いて `Issueとして投稿` を押すと GitHub Issue が作成されます。
既存の GitHub Actions が issue イベントを受け取り、ブログとして同期・デプロイします。

既存記事を修正する場合は `既存記事を取得` で issue 一覧を読み込み、左側の一覧から記事を選択します。
タイトルと本文を編集して `変更を保存` を押すと同じ GitHub Issue が更新され、既存の GitHub Actions が再デプロイします。
本文だけに集中したい場合は `集中` を押すと記事一覧とプレビューが隠れます。

画像を入れる場合は、画像ファイルを本文欄へドラッグ&ドロップします。
画像は `public/uploads/YYYY-MM-DD/` にコミットされ、公開URLの Markdown が本文へ挿入されます。
この機能を使うトークンには Issues read/write に加えて Contents read/write 権限が必要です。

### 配布物の作成

GitHub Actions の `Build desktop app` を手動実行すると、Windows と macOS の配布物が artifact として生成されます。

```bash
npm run app:dist
```

生成物は `release/` に出力されます。
macOS 用の署名・公証や Windows 用のコード署名が必要な場合は、electron-builder の署名設定を追加してください。

### テスト

```bash
# テストを実行（watchモード）
npm test

# テストを1回だけ実行
npm run test:run

# テストカバレッジを表示
npm run test:coverage

# テストUIを起動
npm run test:ui
```

## 開発ルール

このプロジェクトの開発ルールについては [CLAUDE.md](./CLAUDE.md) を参照してください。
