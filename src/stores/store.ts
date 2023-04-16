import { createStore } from "zustand/vanilla";
import { Logger } from "winston";
import Bree from "bree/types";

export type StoreType = {
  // Scheduler Logger
  sLogger: Logger | undefined;
  setSLogger: (l: Logger) => void;

  // Scheduler
  scheduler?: Bree | undefined;
  setScheduler: (s: Bree) => void;
};

const store = createStore<StoreType>()((set) => ({
  // Scheduler Logger
  sLogger: undefined,
  setSLogger: (l) => set((state) => ({ ...state, sLogger: l })),

  // Scheduler
  scheduler: undefined,
  setScheduler: (s) => set((state) => ({ ...state, scheduler: s })),
}));

export { store };
