# Claude Safe Enter

claude.ai で Enter の誤送信を防ぐ Chrome 拡張。

- Enter / Shift+Enter → 改行
- Cmd(Ctrl)+Enter → 送信
- IME 変換確定の Enter → 何もしない

## 仕組み（content.js）

- `keydown` をキャプチャフェーズで先取りし、修飾キーを書き換えて claude.ai に渡す
  - Enter → `shiftKey = true` にして改行させる
  - Cmd+Enter → `metaKey/ctrlKey = false` にして送信させる
  - `isComposing` / `keyCode === 229` は素通し
- 書き換えをページ側に見せるため `"world": "MAIN"` で実行（デフォルトの isolated world だと効かない）
- 対象は `TARGET_SELECTOR`（メイン入力欄と編集欄）。UI 変更で効かなくなったらここを直す

## ON/OFF

- ツールバーアイコンのクリックで切り替え（OFF 中は赤い OFF バッジ）
- `background.js`: クリックで `chrome.storage.local` の `enabled` を反転、バッジ更新
- `bridge.js`（isolated world）: storage を読んで `<html data-claude-safe-enter="on|off">` に書き出す
  - MAIN world の content.js は `chrome.storage` を使えないので DOM 経由で渡している
- content.js は属性が `off` のときだけ素通し（未設定の間は ON 扱い）

## 読み込み・更新

`chrome://extensions` → デベロッパーモード ON →「パッケージ化されていない拡張機能を読み込む」。
コード変更後は 🔄 → claude.ai をリロード。
