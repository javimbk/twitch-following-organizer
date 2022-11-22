import React from "react";
import { useBoundStore } from "./useBoundStore";

export function LoggedOutApp() {
  return (
    <div className="w-full h-full overflow-y-scroll bg-slate-800 px-2">
      <div className="flex items-center justify-between p-2">
        <div className="text-blue-300 font-extrabold text-center">TFW</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-extrabold uppercase py-1 px-2 rounded"
          onClick={() => useBoundStore.setState({ isVisible: false })}
        >
          Hide Layout
        </button>
      </div>

      <div className="text-red-500 font-extrabold text-center pt-2">Error</div>
      <div className="text-white font-extrabold text-center pt-2">
        You need to be logged in and following people on Twitch in order for the extension to work properly.
      </div>
    </div>
  );
}
