import React from "react";
import { addChannelToFavourites, removeChannelFromFavourites } from "../../../storage";
import { StoreState } from "../../../store";
import { Favourite } from "./Favourite";

type Props = {
  channel: Exclude<StoreState["allFollowing"], null>[number];
};

const containerBaseClassName = "flex gap-2 items-center px-4 py-2 h-[48px]";

export function FollowedChannel({ channel }: Props) {
  const handleClick = () => {
    window.location.href = `/${channel.channelHandle}`;
  };

  const handleFavouriteClick = async () => {
    if (channel.isFavourite) {
      await removeChannelFromFavourites(channel.channelHandle);
    } else {
      await addChannelToFavourites(channel.channelHandle);
    }
  };

  return (
    <div className={`${containerBaseClassName} ${!channel.isLive ? "opacity-50" : null}`}>
      <div>
        {channel.avatarUrl && (
          <figure className="w-8 h-8 hover:cursor-pointer" onClick={handleClick}>
            <img className="rounded-full" src={channel.avatarUrl} />
          </figure>
        )}
      </div>
      <div className="w-full overflow-ellipsis whitespace-nowrap overflow-hidden">
        <div className="flex justify-between items-center hover:cursor-pointer" onClick={handleClick}>
          <div className="text-yellow-600 font-bold">{channel.channelHandle}</div>
          <div className="flex items-center gap-2">
            <div className={channel.isLive ? "bg-green-500 w-3 h-3 rounded-full" : ""}></div>
            {channel.viewerCount ? <div className="text-white font-medium text-md">{channel.viewerCount}</div> : null}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white text-sm overflow-ellipsis whitespace-nowrap overflow-hidden">
            {channel.contentType}
          </div>
          <Favourite onClick={handleFavouriteClick} isFavourite={channel.isFavourite} />
        </div>
      </div>
    </div>
  );
}
