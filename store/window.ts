import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "@/lib/constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX+1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;

        win.isOpen = true;
        win.isMinimize = false;
        win.data = data ?? win.data;

        win.zIndex = state.nextZIndex;
        state.nextZIndex++;
      }),

    closeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = false;
        win.isMinimize = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),

    minimizeWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimize = true;
        win.isOpen = false;
      }),

    restoreWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;

        win.isMinimize = false;
        win.isOpen = true;

        win.zIndex = state.nextZIndex;
        state.nextZIndex++;
      }),


    focusWindow: (windowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.zIndex = state.nextZIndex++;
      }),
  }))
);


export default useWindowStore;