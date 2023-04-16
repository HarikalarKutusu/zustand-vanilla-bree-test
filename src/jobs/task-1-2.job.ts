import { parentPort } from "node:worker_threads";

import { store } from "../stores/store";

const { sLogger } = store.getState();

sLogger?.info("Task-1-2: Executed");

parentPort?.postMessage("done");
