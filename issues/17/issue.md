---
url: 'https://api.github.com/repos/tanabe1478/diary/issues/17'
repository_url: 'https://api.github.com/repos/tanabe1478/diary'
labels_url: 'https://api.github.com/repos/tanabe1478/diary/issues/17/labels{/name}'
comments_url: 'https://api.github.com/repos/tanabe1478/diary/issues/17/comments'
events_url: 'https://api.github.com/repos/tanabe1478/diary/issues/17/events'
html_url: 'https://github.com/tanabe1478/diary/issues/17'
id: 2892825446
node_id: I_kwDOHrcnts6sbQNm
number: 17
title: GmailをGeminiにつなげる方法
user:
  login: tanabe1478
  id: 18596776
  node_id: MDQ6VXNlcjE4NTk2Nzc2
  avatar_url: 'https://avatars.githubusercontent.com/u/18596776?v=4'
  gravatar_id: ''
  url: 'https://api.github.com/users/tanabe1478'
  html_url: 'https://github.com/tanabe1478'
  followers_url: 'https://api.github.com/users/tanabe1478/followers'
  following_url: 'https://api.github.com/users/tanabe1478/following{/other_user}'
  gists_url: 'https://api.github.com/users/tanabe1478/gists{/gist_id}'
  starred_url: 'https://api.github.com/users/tanabe1478/starred{/owner}{/repo}'
  subscriptions_url: 'https://api.github.com/users/tanabe1478/subscriptions'
  organizations_url: 'https://api.github.com/users/tanabe1478/orgs'
  repos_url: 'https://api.github.com/users/tanabe1478/repos'
  events_url: 'https://api.github.com/users/tanabe1478/events{/privacy}'
  received_events_url: 'https://api.github.com/users/tanabe1478/received_events'
  type: User
  user_view_type: public
  site_admin: false
labels: []
state: open
locked: false
assignee: null
assignees: []
milestone: null
comments: 0
created_at: '2025-03-04T03:28:14Z'
updated_at: '2025-05-03T18:28:25Z'
closed_at: null
author_association: OWNER
active_lock_reason: null
sub_issues_summary:
  total: 0
  completed: 0
  percent_completed: 0
issue_dependencies_summary:
  blocked_by: 0
  total_blocked_by: 0
  blocking: 0
  total_blocking: 0
closed_by: null
reactions:
  url: 'https://api.github.com/repos/tanabe1478/diary/issues/17/reactions'
  total_count: 0
  '+1': 0
  '-1': 0
  laugh: 0
  hooray: 0
  confused: 0
  heart: 0
  rocket: 0
  eyes: 0
timeline_url: 'https://api.github.com/repos/tanabe1478/diary/issues/17/timeline'
performed_via_github_app: null
state_reason: null
---
Gmail をソースにして Gemini に確認できるようになる。

## Geminiの設定

1. Geminiを開く
2. 右上の歯車マーク(設定)をクリック
3. 「拡張機能」を選択
4. Google Workspace拡張機能をオンにする

## 使用時の注意点

- Gemini 2.0 Flash を使用する必要がある
  - "2.0 Flash Thinking Experimental with apps" では Gmail を読み込めない
- メールの指示は日時を明確にする
  - 「最近来たメール」などの曖昧な表現だとGeminiが古いメールを参照してしまう
  - 例: 「2024/03/14に受信したメール」のように具体的に指定する

## Tips

- 複数のメールアドレスを持っている場合は、1つのGmailアドレスに全て転送設定しておくと管理が楽
