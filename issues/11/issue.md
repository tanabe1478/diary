---
active_lock_reason: 
assignee: 
assignees: []
author_association: OWNER
closed_at: 
comments: 0
comments_url: https://api.github.com/repos/tanabe1478/diary/issues/11/comments
created_at: '2022-11-27T04:46:07Z'
events_url: https://api.github.com/repos/tanabe1478/diary/issues/11/events
html_url: https://github.com/tanabe1478/diary/issues/11
id: 1465330798
labels: []
labels_url: https://api.github.com/repos/tanabe1478/diary/issues/11/labels{/name}
locked: false
milestone: 
node_id: I_kwDOHrcnts5XVyxu
number: 11
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
  url: https://api.github.com/repos/tanabe1478/diary/issues/11/reactions
repository_url: https://api.github.com/repos/tanabe1478/diary
state: open
state_reason: 
timeline_url: https://api.github.com/repos/tanabe1478/diary/issues/11/timeline
title: Synology DS220j と WD80EFZZ-EC を使ったNAS環境の初期設定
updated_at: '2022-11-27T05:59:31Z'
url: https://api.github.com/repos/tanabe1478/diary/issues/11
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

