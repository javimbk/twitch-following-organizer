import React from "react";
import { createRoot } from "react-dom/client";

import { SidebarApp } from "../sidebar-app/App";
import "../static/index.css";
import { store } from "../store";
import { createTwitchie } from "../twitchie";
import { connectChromeMessagingToStore } from "./connectChromeMessagingToStore";

async function main() {
  /**
   * Injecting React App into Sidebar
   * TODO: Avoid layout shift, inject as soon as possible on the whole sidebar, right now it displays "For You"
   * TODO: Interval shouldn't be running unless sidebar is expanded.
   */
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

  twitchie.on("ready", (event) => {
    store.setState({
      followNumber: event.detail.followedNum,
      allFollowing: event.detail.allFollowed,
    });
  });

  twitchie.on("sidebar-class-change", (event) => {
    store.setState({ isVisible: !event.detail.isCollapsed });
  });

  // I can use twitchie here.
}

main();
