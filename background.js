// ツールバーアイコンのクリックで ON/OFF を切り替え、バッジに反映する

const render = (enabled) => {
  chrome.action.setBadgeText({ text: enabled ? '' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: '#B3261E' });
  chrome.action.setTitle({ title: `Claude Safe Enter: ${enabled ? 'ON' : 'OFF'}` });
};

const getEnabled = async () => {
  const { enabled = true } = await chrome.storage.local.get('enabled');
  return enabled;
};

chrome.action.onClicked.addListener(async () => {
  const enabled = !(await getEnabled());
  await chrome.storage.local.set({ enabled });
  render(enabled);
});

// service worker の起動時（ブラウザ起動・拡張の再読み込み）にバッジを復元
getEnabled().then(render);
