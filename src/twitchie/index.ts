// TODO: ReadyEvent can be simplified by not using CustomEvent to the outside or any event.
type ReadyEventPayload = {
  followedNum: number;
  allFollowed: string[];
};

export class ReadyEvent extends CustomEvent<ReadyEventPayload> {
  constructor(payload: ReadyEventPayload) {
    super("ready", { detail: payload });
  }
}

type Unsubscribe = () => void;

export interface Twitchie {
  initialize(): void;
  on(type: "ready", callback: (event: ReadyEvent) => void): Unsubscribe;
}

export function createTwitchie(): Twitchie {
  const eventTarget = new EventTarget();

  return {
    initialize() {
      const intervalId = setInterval(() => {
        const followedChannelsList = document.querySelectorAll("[data-test-selector=followed-channel]");

        if (followedChannelsList.length === 0) {
          // TODO: hasn't loaded the first time yet, better way?
          return;
        }

        const hasMoreButton = document.querySelector("[data-test-selector=ShowMore]");

        if (hasMoreButton instanceof HTMLElement) {
          console.log("TFW - ContentScript - There is still more");
          hasMoreButton.click();
          return;
        }

        console.log("TFW - ContentScript - everything", {
          followedNum: followedChannelsList.length,
        });

        clearInterval(intervalId);
        eventTarget.dispatchEvent(
          new ReadyEvent({
            followedNum: followedChannelsList.length,
            allFollowed: Array.from(followedChannelsList).map(
              (el) => (el.querySelector("[data-a-target=side-nav-title]") as HTMLElement).innerText
            ),
          })
        );
      }, 100);
    },
    on(type: string, callback: (event: any) => void): Unsubscribe {
      eventTarget.addEventListener(type, callback);

      return () => eventTarget.removeEventListener(type, callback);
    },
  };
}
