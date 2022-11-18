chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension was installed");
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, { action: "SHOW_SIDEBAR_APP" });
  });
});
