import React from "react";
import { FollowedChannel } from "./components/FollowedChannel";
import { useBoundStore } from "./useBoundStore";

export function SidebarApp() {
  const allFollowing = useBoundStore((state) => state.allFollowing);
  const isVisible = useBoundStore((state) => state.isVisible);

  console.log({ allFollowing });

  return isVisible ? (
    <div className="w-full h-full overflow-y-scroll bg-slate-800">
      <header className="App-header">
        <p className="text-blue-300 font-extrabold text-center">TFW</p>
        <button
          onClick={() => useBoundStore.setState({ isVisible: false })}
          style={{
            background: "blueviolet",
            padding: "8px",
            borderRadius: "5px",
          }}
        >
          Hide Layout
        </button>
        {allFollowing && allFollowing.map((el) => <FollowedChannel key={el.channelHandle} channel={el} />)}
      </header>
    </div>
  ) : null;
}
