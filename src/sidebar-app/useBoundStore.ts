/** React version of the Vanilla Store */
import create from "zustand";
import { store } from "../store";

export const useBoundStore = create(store);
