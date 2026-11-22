// Claude Safe Enter
// - Enter            → 改行
// - Shift+Enter      → 改行（claude.ai 標準のまま）
// - Cmd/Ctrl+Enter   → 送信
// - IME変換確定のEnter → 何もしない
//
// 方針: キーイベントの修飾キー情報を書き換えて claude.ai に渡し、
//       claude.ai 自身の「改行」「送信」処理を動かす。

const TARGET_SELECTOR = [
  '[data-testid="chat-input"]',      // メインの入力欄
  '.cds-user-message-body textarea', // 過去メッセージの編集欄
].join(', ');

// イベントの読み取り専用プロパティを、このイベント1回分だけ上書きする
const fake = (e, key, value) =>
  Object.defineProperty(e, key, { get: () => value });

document.addEventListener(
  'keydown',
  (e) => {
    if (e.key !== 'Enter') return;

    // IME変換中のEnterは素通し（誤送信防止の要）
    if (e.isComposing || e.keyCode === 229) return;

    // 対象の入力欄以外は触らない
    if (!e.target.closest?.(TARGET_SELECTOR)) return;

    // Shift+Enter は元から改行
    if (e.shiftKey) return;

    if (e.metaKey || e.ctrlKey) {
      // Cmd/Ctrl+Enter → 普通の Enter に見せて送信させる
      fake(e, 'metaKey', false);
      fake(e, 'ctrlKey', false);
    } else {
      // Enter単体 → Shift+Enter に見せて改行させる
      fake(e, 'shiftKey', true);
    }
  },
  true // キャプチャフェーズ: claude.ai のリスナーより先に処理する
);

console.log('[Claude Safe Enter] loaded');
