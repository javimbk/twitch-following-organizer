import create from "zustand/vanilla";

export type StoreState = {
  isVisible: boolean;
  allFollowing:
    | {
        channelHandle: string;
        isLive: boolean;
        viewerCount: string;
        contentType: string | null;
      }[]
    | null;
  followNumber: number | null;
};

export const store = create<StoreState>(() => ({
  isVisible: true,
  allFollowing: null,
  followNumber: null,
}));

export type Store = typeof store;
