# Blog writer desktop app

## Purpose

GitHub Issues をブログ記事として使う既存フローに合わせて、記事執筆と issue 投稿を行う Windows/Mac 対応アプリを追加する。

## Approach

- Electron でクロスプラットフォームのデスクトップアプリを追加する
- GitHub REST API で `tanabe1478/diary` に issue を作成する
- GitHub token と対象リポジトリはローカル設定として保持する
- 本文は Markdown として編集し、簡易プレビューを表示する
- issue 作成後は既存の `sync` workflow にデプロイを任せる

## Tasks

- [x] Electron main/preload/renderer を追加
- [x] 投稿設定、下書き保存、Markdown プレビューを実装
- [x] 既存 issue の一覧取得、読み込み、更新を実装
- [x] ドラッグ&ドロップ画像アップロードを実装
- [x] `package.json` に起動・配布スクリプトを追加
- [x] README に利用手順を追加
- [x] 型チェックとテストで確認する
