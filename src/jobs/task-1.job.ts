import { parentPort } from "node:worker_threads";

import { store } from "../stores/store";
import { Job } from "bree/types";

const { sLogger, scheduler } = store.getState();

sLogger?.info("Task-1: Started");

const jobs: Job[] = [];
scheduler?.add(jobs);

sLogger?.info("Task-1: Scheduled task-1-1 and task-1-2");

parentPort?.postMessage("done");
