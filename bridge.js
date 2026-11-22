// isolated world で動く中継役。
// MAIN world の content.js は chrome.storage を使えないため、
// ON/OFF 状態を <html data-claude-safe-enter="on|off"> に書き出して伝える。

const apply = (enabled) => {
  document.documentElement.dataset.claudeSafeEnter = enabled ? 'on' : 'off';
};

chrome.storage.local.get('enabled').then(({ enabled = true }) => apply(enabled));

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'enabled' in changes) apply(changes.enabled.newValue);
});
