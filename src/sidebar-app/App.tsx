import React from "react";
import { FollowedChannel } from "./components/FollowedChannel";
import { useBoundStore } from "./useBoundStore";

export function SidebarApp() {
  const allFollowing = useBoundStore((state) => state.allFollowing);
  const isVisible = useBoundStore((state) => state.isVisible);

  return isVisible ? (
    <div className="w-full h-full overflow-y-scroll bg-slate-800">
      <div className="flex items-center justify-between p-2">
        <div className="text-blue-300 font-extrabold text-center">TFW</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-extrabold uppercase py-1 px-2 rounded"
          onClick={() => useBoundStore.setState({ isVisible: false })}
        >
          Hide Layout
        </button>
      </div>

      {allFollowing && allFollowing.map((el) => <FollowedChannel key={el.channelHandle} channel={el} />)}
    </div>
  ) : null;
}
