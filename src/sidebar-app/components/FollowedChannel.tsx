import React from "react";
import { StoreState } from "../../store";

type Props = {
  channel: Exclude<StoreState["allFollowing"], null>[number];
};

const containerBaseClassName =
  "flex gap-2 items-center px-4 py-2 h-[48px] border border-t-0 border-x-0 border-solid border-b-orange-300 border-opacity-50 hover:cursor-pointer";

export function FollowedChannel({ channel }: Props) {
  return (
    <div
      onClick={() => {
        window.location.href = `/${channel.channelHandle}`;
      }}
      className={`${containerBaseClassName} ${!channel.isLive ? "opacity-50" : null}`}
    >
      <div>
        {channel.avatarUrl && (
          <figure className="w-8 h-8">
            <img className="rounded-full" src={channel.avatarUrl} />
          </figure>
        )}
      </div>
      <div className="w-full overflow-ellipsis whitespace-nowrap overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="text-yellow-600 font-bold">{channel.channelHandle}</div>
          <div className="flex items-center gap-2">
            <div className={channel.isLive ? "bg-green-500 w-3 h-3 rounded-full" : ""}></div>
            {channel.viewerCount ? <div className="text-white font-medium text-md">{channel.viewerCount}</div> : null}
          </div>
        </div>
        <div>
          <div className="text-white text-sm overflow-ellipsis whitespace-nowrap overflow-hidden">
            {channel.contentType}
          </div>
        </div>
      </div>
    </div>
  );
}
