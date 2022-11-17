import { Store } from "../store";

export function connectChromeMessagingToStore(store: Store) {
  chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.action) {
      case "VISIBILITY_CHANGE":
        store.setState({ isVisible: msg.payload });
        break;
      default:
        console.log({ msg });
        break;
    }
  });
}
