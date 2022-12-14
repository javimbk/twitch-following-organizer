import React from "react";
import { createRoot } from "react-dom/client";

import { SidebarApp } from "../sidebar-app/App";
import "../static/index.css";
import { getFavouritesFromStorage } from "../storage";
import { store } from "../store";
import { createTwitchie } from "../twitchie";
import { connectChromeMessagingToStore } from "./connectChromeMessagingToStore";

async function main() {
  /**
   * Injecting React App into Sidebar
   * TODO: Avoid layout shift, inject as soon as possible on the whole sidebar, right now it displays "For You"
   * TODO: Interval shouldn't be running unless sidebar is expanded.
   */
  store.setState({ isLoading: true });

  const sidebarContentsDiv = document.querySelector(".side-bar-contents");

  const appDiv = document.createElement("div");
  appDiv.id = "react-root";
  appDiv.setAttribute("style", "position: absolute; width: 100%; height: 100%; z-index: 10;");

  if (sidebarContentsDiv) {
    sidebarContentsDiv.prepend(appDiv);
  }

  const container = document.getElementById("react-root");

  if (!container) {
    return;
  }

  const root = createRoot(container!);
  root.render(<SidebarApp />);

  /** Changes to React App container based on store */
  store.subscribe((state, _prevState) => {
    container!.style.display = state.isVisible ? "block" : "none";
  });

  connectChromeMessagingToStore(store);

  const twitchie = createTwitchie();
  twitchie.initialize();

  twitchie.on("ready", async (event) => {
    const favouritesFromStorage = await getFavouritesFromStorage();

    /** TODO: Avoid mapping if not favourites. */
    const allFollowingWithFavourites = event.detail.allFollowed.map((element) => ({
      ...element,
      isFavourite: favouritesFromStorage !== null ? favouritesFromStorage.includes(element.channelHandle) : false,
    }));

    store.setState({
      isLoading: false,
      isLoggedIn: event.detail.isLoggedIn,
      followNumber: event.detail.followedNum,
      allFollowing: allFollowingWithFavourites,
    });
  });

  twitchie.on("update-followed.started", () => {
    store.setState({
      isLoading: true,
    });
  });

  /** TODO: Merge with the Ready one since code is a bit shared */
  twitchie.on("update-followed.completed", async (event) => {
    const favouritesFromStorage = await getFavouritesFromStorage();

    /** TODO: Avoid mapping if not favourites. */
    const allFollowingWithFavourites = event.detail.allFollowed.map((element) => ({
      ...element,
      isFavourite: favouritesFromStorage !== null ? favouritesFromStorage.includes(element.channelHandle) : false,
    }));

    store.setState({
      isLoading: false,
      allFollowing: allFollowingWithFavourites,
    });
  });

  twitchie.on("sidebar-class-change", (event) => {
    store.setState({ isVisible: !event.detail.isCollapsed });
  });

  twitchie.on("initialize-error", (event) => {
    const { reason } = event.detail;

    switch (reason) {
      case "logged_out":
        store.setState({
          isLoading: false,
          isLoggedIn: false,
        });
        break;
      default:
        throw new Error("This should never happen.");
    }
  });

  /** Subscribe to changes on Storage */
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "tfw_favourites") {
        /** Refresh all the favourites state */
        const previousAllFollowing = store.getState().allFollowing;
        const newAllFollowing = previousAllFollowing?.map((el) => ({
          ...el,
          isFavourite: newValue.includes(el.channelHandle),
        }));
        store.setState({ allFollowing: newAllFollowing });
      }
    }
  });
}

main();
