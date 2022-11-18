import type { Store } from "../store";

export function connectChromeMessagingToStore(store: Store) {
  chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.action) {
      case "SHOW_SIDEBAR_APP":
        store.setState({ isVisible: true });
        break;
      default:
        console.log({ msg });
        break;
    }
  });
}
