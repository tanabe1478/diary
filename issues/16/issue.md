---
active_lock_reason: 
assignee: 
assignees: []
author_association: OWNER
closed_at: 
comments: 0
comments_url: https://api.github.com/repos/tanabe1478/diary/issues/16/comments
created_at: '2025-02-02T16:50:16Z'
events_url: https://api.github.com/repos/tanabe1478/diary/issues/16/events
html_url: https://github.com/tanabe1478/diary/issues/16
id: 2825897188
labels: []
labels_url: https://api.github.com/repos/tanabe1478/diary/issues/16/labels{/name}
locked: false
milestone: 
node_id: I_kwDOHrcnts6ob8Tk
number: 16
performed_via_github_app: 
reactions:
  "+1": 0
  "-1": 0
  confused: 0
  eyes: 0
  heart: 0
  hooray: 0
  laugh: 0
  rocket: 0
  total_count: 0
  url: https://api.github.com/repos/tanabe1478/diary/issues/16/reactions
repository_url: https://api.github.com/repos/tanabe1478/diary
state: open
state_reason: 
sub_issues_summary:
  completed: 0
  percent_completed: 0
  total: 0
timeline_url: https://api.github.com/repos/tanabe1478/diary/issues/16/timeline
title: Next.js 製ブログのアップデート作業記録
updated_at: '2025-02-02T16:54:23Z'
url: https://api.github.com/repos/tanabe1478/diary/issues/16
user:
  avatar_url: https://avatars.githubusercontent.com/u/18596776?v=4
  events_url: https://api.github.com/users/tanabe1478/events{/privacy}
  followers_url: https://api.github.com/users/tanabe1478/followers
  following_url: https://api.github.com/users/tanabe1478/following{/other_user}
  gists_url: https://api.github.com/users/tanabe1478/gists{/gist_id}
  gravatar_id: ''
  html_url: https://github.com/tanabe1478
  id: 18596776
  login: tanabe1478
  node_id: MDQ6VXNlcjE4NTk2Nzc2
  organizations_url: https://api.github.com/users/tanabe1478/orgs
  received_events_url: https://api.github.com/users/tanabe1478/received_events
  repos_url: https://api.github.com/users/tanabe1478/repos
  site_admin: false
  starred_url: https://api.github.com/users/tanabe1478/starred{/owner}{/repo}
  subscriptions_url: https://api.github.com/users/tanabe1478/subscriptions
  type: User
  url: https://api.github.com/users/tanabe1478
  user_view_type: public

---
[過去の記事](https://tanabe1478.github.io/diary/articles/1)で書いたように Next.js 製なのだが諸々のライブラリのアップデートをしようと思い立った。最近触っていなかったので Cursor に手伝ってもらいながら完了した。
とりあえずカスタマイズはできる環境が整ったかなと思う。
変更内容を Cursor に出力してもらった。

動き出しが億劫なことが多いのだが LLM のおかげでかなり助けられている。

=======

Next.jsベースのブログシステムの依存関係を包括的に更新しました。この更新は、セキュリティの向上、新機能の活用、そして将来的な保守性の向上を目的としています。

## 更新の概要

### 1. ブラウザリストのデータベース更新 (312e519)
- `npx browserslist@latest --update-db`を実行
- 対応ブラウザのデータベースを最新化し、より正確なCSS自動プレフィックス生成を実現

### 2. Next.jsのリンクコンポーネント更新 (836a777)
- Next.jsの新しいLink APIに対応
- スタイリングをインラインで適用するように変更
- ダークモード対応のスタイルを追加
- アクセシビリティの向上

### 3. CI/CD環境の更新 (7ce4a19)
- GitHub Actionsのワークフローを最新化
- Node.js 20.17.0への更新
- アクションのバージョンアップ（checkout v4, setup-node v4）
- ビルド環境の安定性向上

### 4. ビルド設定の最適化 (45389ad)
- 非推奨となった`next export`コマンドの削除
- `next.config.js`での`output: 'export'`設定への移行
- 画像最適化の設定追加
- TypeScriptの型チェック追加

### 5. パッケージの段階的更新
1. React関連 (3447696)
   - React 18系の安定版へ更新
   - 型定義の更新

2. Markdown処理関連 (12e9679)
   - unified, remark, rehypeパッケージの更新
   - GitHub Flavored Markdownのサポート強化

3. 開発ツール (7d70aea)
   - ESLint, Prettier, TypeScriptの更新
   - コード品質管理の強化

4. ユーティリティとCSSツール (5788f77)
   - date-fns, glob関連パッケージの更新
   - TailwindCSS, PostCSSの更新

## 技術的な改善点

1. **ビルドシステムの最適化**
   - 静的エクスポート設定の現代化
   - ビルドパフォーマンスの向上

2. **型安全性の向上**
   - TypeScript設定の強化
   - 厳密な型チェックの導入

3. **開発者体験の改善**
   - 最新のツールチェーンによる開発効率の向上
   - より良いエラー検出と修正提案

4. **将来性への対応**
   - 最新のNext.js機能への対応準備
   - モダンなReactパターンの採用

## まとめ

この更新作業により、プロジェクトの技術的負債を解消し、より安定した開発・運用基盤を整えることができました。特に、Next.jsの最新機能への対応とNode.js 20対応により、今後のアップデートもよりスムーズに行えるようになりました。