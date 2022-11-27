import create from "zustand/vanilla";

export type StoreState = {
  isVisible: boolean;
  isLoggedIn: boolean | null;
  isLoading: boolean;
  allFollowing:
    | {
        channelHandle: string;
        avatarUrl: string | null;
        isLive: boolean;
        isFavourite: boolean;
        viewerCount: string | null;
        contentType: string | null;
      }[]
    | null;
  followNumber: number | null;
};

export const store = create<StoreState>(() => ({
  isVisible: true,
  isLoggedIn: null,
  isLoading: false,
  allFollowing: null,
  followNumber: null,
}));

export type Store = typeof store;
