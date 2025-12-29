---
url: 'https://api.github.com/repos/tanabe1478/diary/issues/11'
repository_url: 'https://api.github.com/repos/tanabe1478/diary'
labels_url: 'https://api.github.com/repos/tanabe1478/diary/issues/11/labels{/name}'
comments_url: 'https://api.github.com/repos/tanabe1478/diary/issues/11/comments'
events_url: 'https://api.github.com/repos/tanabe1478/diary/issues/11/events'
html_url: 'https://github.com/tanabe1478/diary/issues/11'
id: 1465330798
node_id: I_kwDOHrcnts5XVyxu
number: 11
title: Synology DS220j と WD80EFZZ-EC を使ったNAS環境の初期設定
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
created_at: '2022-11-27T04:46:07Z'
updated_at: '2022-11-27T05:59:31Z'
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
  url: 'https://api.github.com/repos/tanabe1478/diary/issues/11/reactions'
  total_count: 0
  '+1': 0
  '-1': 0
  laugh: 0
  hooray: 0
  confused: 0
  heart: 0
  rocket: 0
  eyes: 0
timeline_url: 'https://api.github.com/repos/tanabe1478/diary/issues/11/timeline'
performed_via_github_app: null
state_reason: null
---
今までオンラインストレージの有料プランで運用していたが容量が大きくなっていくにつれて金額が無視できなくなっていたのえNAS環境を作ってみることにした。
これは建前で実際は今までやったことがなかったので買って試してみたかったというのが本音。

## HDDの接続と本体の電源供給

WD80EFZZ-ECはケースにネジ止めするモデルだったので本体にネジ止めしてLANケーブルと電源をつけて起動する。

商品の互換性リストを見てサポートされている組み合わせなのかは事前に調べておくべきだとおもう。

- https://www.synology.com/ja-jp/compatibility?

## OSのインストール

DiskStation ManagerというのがこのSynology NASのOS。

まずは以下でLAN内のNASを検索する

- http://find.synology.com/

インストール後は設定画面が開ける

![f2c4cb181edfe179410e2de3c3950fbb](https://user-images.githubusercontent.com/18596776/204119055-306974b0-cf28-4b5d-a384-c9b3c7867c47.png)

インストール後の画面
![9855cc8d4de3e00291dcffde6e6884e2](https://user-images.githubusercontent.com/18596776/204119470-4134330b-3cd9-40b3-8fd4-732d380586c1.jpg)

NASの共有フォルダの作成をするためにボリュームを作る。そのためにはストレージプールを作る必要があるので作成する

ストレージプールのプロパティ設定で RAID の構成を選択する
今回は最低限の冗長性を確保したかったので、 RAID 1 の構成で進める。

確認画面のスクショを撮っておいた

![03773038902c17ec473854ee63a29609](https://user-images.githubusercontent.com/18596776/204119653-c49e15e1-cd41-48e9-8c14-fff2f92eb2e8.png)

その後は管理アカウントや2段階認証の設定などを行う。

## 共有フォルダの作成

File Stationからボリュームに共有フォルダを作成することができる。

アクセス権限や暗号化の設定を終えたあとにファイルのダウンロードとストリーミングで動作テストをした。問題なくできているようだったので、ローカルネットワークに共有フォルダをマウントする設定を行った。

DropboxとかGoogle Driveのドライブをローカルのファイルマネージャーで操作できるようにするあれだ。

コンパネ > ネットワークとインターネット > ネットワークと共有センター > 共有の詳細設定の変更からファイルとプリンターの共有を有効化

その後エクスプローラからネットワークドライブの割当を行う。

接続先情報はNAS用のOSのコンパネからネットワーク > ネットワーク・インターフェースに記載がある。

## 動画コンテンツの再生環境

ここまでの設定を終えたあとでもDS Videoという動画再生用のアプリでは接続ができない。

以下のリンクに記載されている通りにすると接続と動画コンテンツの再生ができるようになる。

[Video Station でビデオを整理、再生する | DSM を始める - Synology ナレッジセンター](https://kb.synology.com/ja-jp/DSM/help/DSM/Tutorial/home_theater_videos?version=6)

