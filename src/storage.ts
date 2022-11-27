export async function getFavouritesFromStorage(): Promise<string[] | null> {
  const { tfw_favourites } = await chrome.storage.sync.get("tfw_favourites");

  if (tfw_favourites === undefined) {
    return null;
  }

  /** TODO: Better type assertion here before casting */
  return tfw_favourites as string[];
}

export async function addChannelToFavourites(channelHandle: string) {
  let previousFavorites: string[] = [];

  const { tfw_favourites } = await chrome.storage.sync.get("tfw_favourites");

  if (tfw_favourites === undefined) {
    // initialize array for the first time in case it has never been.
    await chrome.storage.sync.set({ tfw_favourites: previousFavorites });
  } else {
    previousFavorites = tfw_favourites as string[];
  }

  if (previousFavorites.includes(channelHandle)) {
    console.log(`TFW - Storage - Didnt add ${channelHandle} to list of favourites because it is already there.`);
    return;
  }

  const newFavourites = [...previousFavorites, channelHandle];

  await chrome.storage.sync.set({ tfw_favourites: newFavourites }, () => {
    console.log(`TFW - Storage - Succesfully added ${channelHandle} to list of favourites, ${newFavourites}`);
  });
}

export async function removeChannelFromFavourites(channelHandle: string) {
  const { tfw_favourites: previousFavorites } = await chrome.storage.sync.get("tfw_favourites");

  if (!previousFavorites.includes(channelHandle)) {
    throw new Error(`TFW - Storage - Couldnt remove ${channelHandle} from list of favourites because it is not there.`);
  }

  const newFavourites = previousFavorites.filter((fav) => fav !== channelHandle);

  await chrome.storage.sync.set({ tfw_favourites: newFavourites }, () => {
    console.log(`TFW - Storage - Succesfully removed ${channelHandle} from list of favourites, ${newFavourites}`);
  });
}
