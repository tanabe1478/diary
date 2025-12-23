# 開発ワークフロー詳細

このドキュメントは、Claude Code セッションにおける詳細な開発ワークフローを定義します。

## 🔄 標準開発フロー

### Phase 1: 計画 (Planning)

#### 1.1 要件の理解

- ユーザーの要求を明確に理解する
- 不明点があれば質問する
- 既存コードを読んで現状を把握する

#### 1.2 実装計画の作成

**ファイル**: `.claude/plans/YYYY-MM-DD_<feature-name>.md`

```markdown
# <機能名>

## 目的

[この実装の目的とゴール]

## 背景

[なぜこの実装が必要か]

## アプローチ

[実装のアプローチ、技術選択の理由]

## タスクリスト

- [ ] タスク 1
- [ ] タスク 2
- [ ] タスク 3

## 技術的考慮事項

[パフォーマンス、セキュリティ、互換性などの考慮点]

## リスク

[潜在的な問題点]

## 代替案

[検討した他の方法]
```

#### 1.3 ブランチ命名規則

**Feature**: `feature/<description>`

- 例: `feature/add-vitest-testing`
- 新機能追加時

**Fix**: `fix/<description>`

- 例: `fix/markdown-rendering-bug`
- バグ修正時

**Refactor**: `refactor/<description>`

- 例: `refactor/update-dependencies`
- リファクタリング時

**Docs**: `docs/<description>`

- 例: `docs/add-api-documentation`
- ドキュメント追加・更新時

**Test**: `test/<description>`

- 例: `test/add-unit-tests`
- テスト追加時

### Phase 2: 実装 (Implementation)

#### 2.1 ブランチ作成

```bash
git checkout -b <branch-type>/<description>
```

#### 2.2 開発

- 小さなコミットを心がける
- コミットメッセージは明確に
- テストを書きながら進める

#### 2.3 TodoWrite ツールの活用

- タスクの進捗を常に更新
- 実装中の問題を記録
- 完了したタスクをマーク

### Phase 3: ドキュメント化 (Documentation)

#### 3.1 実装メモの作成

**ファイル**: `docs/implementations/YYYY-MM-DD_<feature-name>.md`

テンプレート: `.claude/memo-template.md` を参照

#### 3.2 README の更新

- 新機能を追加した場合は必ず README を更新
- セットアップ手順が変わった場合も更新

### Phase 4: レビュー準備 (Review Preparation)

#### 4.1 セルフチェック

- [ ] すべてのテストが通る
- [ ] ビルドが成功する
- [ ] リントエラーがない
- [ ] 型エラーがない
- [ ] 実装メモを作成した
- [ ] 関連ドキュメントを更新した

#### 4.2 コミットの整理

- 必要に応じてコミットをまとめる（squash）
- コミットメッセージを見直す

### Phase 5: プッシュと PR 作成 (Push & PR)

#### 5.1 プッシュ

```bash
git push -u origin <branch-name>
```

**リトライポリシー**:

- ネットワークエラー時は最大 4 回リトライ
- 指数バックオフ: 2 秒、4 秒、8 秒、16 秒

#### 5.2 PR 作成

```bash
gh pr create --title "タイトル" --body "$(cat <<'EOF'
## Summary
- 変更内容のサマリー

## Changes
- 具体的な変更点

## Test Plan
- [ ] テスト項目1
- [ ] テスト項目2

## Related Issues
#<issue-number>
EOF
)"
```

**PR テンプレート**:

```markdown
## Summary

[変更の概要を 3-5 行で]

## Changes

- 変更 1
- 変更 2
- 変更 3

## Test Plan

- [ ] ユニットテストを追加
- [ ] 既存テストが通ることを確認
- [ ] 手動テストを実施

## Documentation

- [ ] 実装メモを作成
- [ ] README を更新（必要な場合）

## Related

- 実装計画: `.claude/plans/YYYY-MM-DD_<name>.md`
- 実装メモ: `docs/implementations/YYYY-MM-DD_<name>.md`
```

## 🧪 テスト戦略

### テストの優先順位

1. **Critical**: コアロジック（`lib/`）
2. **High**: ページコンポーネント（`pages/`）
3. **Medium**: UI コンポーネント（`components/`）
4. **Low**: スタイル、設定ファイル

### テスト種別

- **Unit Tests**: 関数、メソッドの単体テスト
- **Integration Tests**: 複数モジュールの統合テスト
- **Snapshot Tests**: UI コンポーネントのレンダリング結果

## 📊 コミット頻度

**推奨**:

- テストが通る状態で小さくコミット
- 1 つの論理的変更 = 1 コミット
- 実験的なコードは別ブランチで

**避けるべき**:

- 複数の機能を 1 コミットにまとめる
- テストが通らない状態でコミット
- 意味のないコミットメッセージ

## 🔍 コードレビュー観点

PR レビュー時に確認すべき点：

1. **機能性**: 要件を満たしているか
2. **テスト**: 適切なテストがあるか
3. **パフォーマンス**: パフォーマンス問題はないか
4. **セキュリティ**: 脆弱性はないか
5. **保守性**: 読みやすく保守しやすいか
6. **ドキュメント**: 必要なドキュメントがあるか

## 🚨 トラブルシューティング

### ビルドエラー時

1. `npm install` を再実行
2. `node_modules` と `package-lock.json` を削除して再インストール
3. Node.js バージョンを確認（20.17.0 以上）

### テストエラー時

1. エラーメッセージを詳しく読む
2. 該当テストだけを実行して調査
3. テストデータを確認

### Git エラー時

1. ブランチ名が `claude/` で始まっているか確認
2. リモートの状態を確認: `git fetch origin`
3. コンフリクトがある場合は解決してからプッシュ

## 📚 参考リソース

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/testing)
