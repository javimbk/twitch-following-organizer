// TODO: ReadyEvent can be simplified by not using CustomEvent to the outside or any event.
type ReadyEventPayload = {
  followedNum: number;
  allFollowed: {
    channelHandle: string;
    avatarUrl: string | null;
    isLive: boolean;
    viewerCount: string | null;
    contentType: string | null;
  }[];
};

export class ReadyEvent extends CustomEvent<ReadyEventPayload> {
  constructor(payload: ReadyEventPayload) {
    super("ready", { detail: payload });
  }
}

type SidebarClassChangeEventPayload = {
  isCollapsed: boolean;
};
export class SidebarClassChangeEvent extends CustomEvent<SidebarClassChangeEventPayload> {
  constructor(payload: SidebarClassChangeEventPayload) {
    super("sidebar-class-change", { detail: payload });
  }
}

type Unsubscribe = () => void;

export interface Twitchie {
  initialize(): void;
  on(type: "ready", callback: (event: ReadyEvent) => void): Unsubscribe;
  on(type: "sidebar-class-change", callback: (event: SidebarClassChangeEvent) => void): Unsubscribe;
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
          console.log("TFW - ContentScript - Fetching more followed streamers...");
          hasMoreButton.click();
          return;
        }

        clearInterval(intervalId);

        console.log(`TFW - ContentScript - Ready, fetched ${followedChannelsList.length} streamers.`);
        eventTarget.dispatchEvent(
          new ReadyEvent({
            followedNum: followedChannelsList.length,
            allFollowed: Array.from(followedChannelsList).map((el) => {
              const channelHandle = (el.querySelector("[data-a-target=side-nav-title]") as HTMLElement).innerText;
              const avatarUrl = (el.querySelector(".tw-image-avatar") as HTMLElement).getAttribute("src");
              const isLive = el.querySelector(".side-nav-card__live-status .tw-channel-status-indicator") !== null;
              const viewerCountDOMElement = el.querySelector(".side-nav-card__live-status") as HTMLElement;
              const viewerCount =
                viewerCountDOMElement.innerText !== "Offline" ? viewerCountDOMElement.innerText : null;
              const contentType = (el.querySelector(".side-nav-card__metadata") as HTMLElement).innerText;

              return {
                channelHandle,
                avatarUrl,
                isLive,
                viewerCount,
                contentType: contentType ? contentType : null,
              };
            }),
          })
        );
      }, 200);

      /** Mutation Observer for Sidebar being collapsed or not. */
      const sidebarDOMElement = document.querySelector(".side-nav");
      const sidebarObserver = new MutationObserver((mutationList, observer) => {
        mutationList.forEach((mutation) => {
          if (mutation.type === "attributes" && mutation.attributeName === "class") {
            const newClassList = Array.from((mutation.target as HTMLElement).classList);
            eventTarget.dispatchEvent(
              new SidebarClassChangeEvent({
                isCollapsed: newClassList.includes("side-nav--collapsed"),
              })
            );
          }
        });
      });

      if (sidebarDOMElement) {
        sidebarObserver.observe(sidebarDOMElement, { attributes: true });
      }
    },
    on(type: string, callback: (event: any) => void): Unsubscribe {
      eventTarget.addEventListener(type, callback);

      return () => eventTarget.removeEventListener(type, callback);
    },
  };
}
