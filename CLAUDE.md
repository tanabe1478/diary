# Claude Code 開発ガイド

このファイルは、Claude Codeセッション向けの開発ルールとガイドラインを定義します。

## 📋 基本原則

### 1. ブランチ戦略

- **必ずブランチを分けて作業する**
- メインブランチに直接コミットしない
- ブランチ名は `feature/`, `fix/`, `refactor/` などのプレフィックスを使用
- 例: `feature/add-testing`, `refactor/update-dependencies`

### 2. 実装プロセス

すべての機能追加・変更は以下のプロセスに従う：

1. **計画**: `.claude/plans/` に実装計画を記録
2. **ブランチ作成**: 適切な名前でブランチを作成
3. **実装**: コードを実装
4. **メモ作成**: `docs/implementations/` に実装メモを記録
5. **コミット**: 明確なコミットメッセージでコミット
6. **プッシュ**: リモートブランチにプッシュ
7. **PR作成**: GitHub上でPull Requestを作成

### 3. ドキュメント管理

#### 実装計画 (`.claude/plans/`)
- 新機能実装前に必ず作成
- ファイル名: `YYYY-MM-DD_feature-name.md`
- 内容: 目的、アプローチ、タスクリスト、技術的考慮事項

#### 実装メモ (`docs/implementations/`)
- 実装完了後に必ず作成
- ファイル名: `YYYY-MM-DD_feature-name.md`
- 内容: 実装内容、変更ファイル、技術的決定、今後の課題

### 4. コミットメッセージ

Conventional Commits形式を使用：
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメント
- `chore`: ビルド・ツール関連

## 📁 ディレクトリ構造

```
.
├── .claude/               # Claude関連の設定・計画
│   ├── plans/            # 実装計画
│   ├── workflow.md       # 詳細ワークフロー
│   └── memo-template.md  # 実装メモテンプレート
├── docs/
│   └── implementations/  # 実装メモ
├── CLAUDE.md            # このファイル
└── ... (プロジェクトファイル)
```

## 🔗 関連ドキュメント

- [詳細ワークフロー](./.claude/workflow.md)
- [実装メモテンプレート](./.claude/memo-template.md)

## ⚠️ 重要な注意事項

1. **テストを書く**: 新機能には必ずテストを追加
2. **既存テストを壊さない**: すべてのテストが通ることを確認
3. **ドキュメントを更新**: 機能追加時はREADMEやドキュメントも更新
4. **レビュー可能なPRサイズ**: 大きな変更は複数のPRに分割

## 🚀 クイックスタート

新機能を実装する際：

```bash
# 1. 実装計画を作成
# .claude/plans/YYYY-MM-DD_your-feature.md を作成

# 2. ブランチを作成
git checkout -b feature/your-feature

# 3. 実装後、メモを作成
# docs/implementations/YYYY-MM-DD_your-feature.md を作成

# 4. コミット & プッシュ
git add .
git commit -m "feat: add your feature"
git push -u origin feature/your-feature

# 5. PRを作成
# GitHubでPull Requestを作成
```
