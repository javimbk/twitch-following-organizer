// TODO: ReadyEvent can be simplified by not using CustomEvent to the outside or any event.
type ReadyEventPayload = {
  isLoggedIn: true;
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

export class UpdateFollowedStartedEvent extends CustomEvent<{}> {
  constructor() {
    super("update-followed.started");
  }
}

type UpdateFollowedCompletedEventPayload = {
  allFollowed: {
    channelHandle: string;
    avatarUrl: string | null;
    isLive: boolean;
    viewerCount: string | null;
    contentType: string | null;
  }[];
};

export class UpdateFollowedCompletedEvent extends CustomEvent<UpdateFollowedCompletedEventPayload> {
  constructor(payload: UpdateFollowedCompletedEventPayload) {
    super("update-followed.completed", { detail: payload });
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

type InitializeErrorEventPayload = {
  reason: "logged_out";
};

export class InitializeErrorEvent extends CustomEvent<InitializeErrorEventPayload> {
  constructor(payload: InitializeErrorEventPayload) {
    super("initialize-error", { detail: payload });
  }
}

type Unsubscribe = () => void;

export interface Twitchie {
  initialize(): void;
  on(type: "ready", callback: (event: ReadyEvent) => void): Unsubscribe;
  on(type: "update-followed.started", callback: () => void): Unsubscribe;
  on(type: "update-followed.completed", callback: (event: UpdateFollowedCompletedEvent) => void): Unsubscribe;
  on(type: "sidebar-class-change", callback: (event: SidebarClassChangeEvent) => void): Unsubscribe;
  on(type: "initialize-error", callback: (event: InitializeErrorEvent) => void): Unsubscribe;
}

export function createTwitchie(): Twitchie {
  const eventTarget = new EventTarget();

  return {
    initialize() {
      const initializeIntervalId = setInterval(() => {
        const loggedOutSignupButton = document.querySelector("[data-test-selector=anon-user-menu__sign-up-button]");

        if (loggedOutSignupButton) {
          console.log("TFW - Twitchie - Initialize Error: You need to be logged in.");
          eventTarget.dispatchEvent(new InitializeErrorEvent({ reason: "logged_out" }));
          clearInterval(initializeIntervalId);
          return;
        }

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

        clearInterval(initializeIntervalId);

        console.log(`TFW - ContentScript - Ready, fetched ${followedChannelsList.length} streamers.`);
        eventTarget.dispatchEvent(
          new ReadyEvent({
            isLoggedIn: true,
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

      /** Polling to update values. TODO: Use MutationObserver instead. */
      setInterval(() => {
        eventTarget.dispatchEvent(new UpdateFollowedStartedEvent());

        const followedChannelsList = document.querySelectorAll("[data-test-selector=followed-channel]");

        eventTarget.dispatchEvent(
          new UpdateFollowedCompletedEvent({
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
      }, 3 * 60 * 1000); // Every 3 minutes should be enough to get accurate data.
    },
    on(type: string, callback: (event: any) => void): Unsubscribe {
      eventTarget.addEventListener(type, callback);

      return () => eventTarget.removeEventListener(type, callback);
    },
  };
}
