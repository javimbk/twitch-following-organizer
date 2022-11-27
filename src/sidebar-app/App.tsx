import React from "react";
import { FollowedChannel } from "./components/FollowedChannel";
import { LoggedOutApp } from "./LoggedOutApp";
import { useBoundStore } from "./useBoundStore";

export function SidebarApp() {
  const allFollowing = useBoundStore((state) => state.allFollowing);
  const isVisible = useBoundStore((state) => state.isVisible);
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const isLoading = useBoundStore((state) => state.isLoading);

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full overflow-y-scroll bg-slate-800">
        <div className="text-blue-300 font-extrabold text-center pt-2">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoggedOutApp />;
  }

  const allFollowingFavourites = allFollowing && allFollowing.filter((el) => el.isFavourite);
  const allFollowingRest = allFollowing && allFollowing.filter((el) => !el.isFavourite);

  return (
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

      {allFollowingFavourites ? (
        <div>
          {allFollowingFavourites.length > 0 && (
            <div className="text-yellow-400 font-extrabold text-center text-xs">{"<FAVOURITES>"}</div>
          )}
          {allFollowingFavourites.map((el) => (
            <FollowedChannel key={el.channelHandle} channel={el} />
          ))}
          {allFollowingFavourites.length > 0 && (
            <div className="text-yellow-400 font-extrabold text-center text-xs pt-1">{"</FAVOURITES>"}</div>
          )}
        </div>
      ) : null}

      <div>
        {allFollowingRest && allFollowingRest.map((el) => <FollowedChannel key={el.channelHandle} channel={el} />)}
      </div>
    </div>
  );
}
