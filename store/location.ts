import { getLocations } from "@/lib/constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DEFAULT_LOCATION = getLocations([], []).project;

const useLocationStore = create<LocationStore>()(
    immer((set) => ({
        activeLocation: DEFAULT_LOCATION,

        setActiveLocation: (location) =>
            set((state) => {
                state.activeLocation = location ?? DEFAULT_LOCATION;
            }),

        resetActiveLocation: () =>
            set((state) => {
                state.activeLocation = DEFAULT_LOCATION;
            }),
    }))
);

export default useLocationStore