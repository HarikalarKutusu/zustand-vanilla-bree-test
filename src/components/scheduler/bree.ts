// Bree
import Bree, { Job } from "bree";
import tsWorker from "@breejs/ts-worker";
Bree.extend(tsWorker);
import winston from "winston";

// fix esm problem
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const schedulerService = (schedulerLogger: winston.Logger) => {
  const jobs: Job[] = [
    {
      name: `task-1`,
      path: path.join(__dirname, "jobs", "task-1.job.mjs"),
      timeout: 5000, // schedule first 5 sec
      interval: `every 2 minutes`, // repeat interval
      closeWorkerAfterMs: 60 * 1000, // should be done in 1 min - else something is wrong
    },
  ];

  const bree = new Bree({
    logger: false,
    root: path.join(__dirname, "jobs"),
    defaultExtension: "mjs",
    jobs: jobs,
    errorHandler(error, workerMetadata) {
      schedulerLogger.error(`[${workerMetadata.name}] ${error}`);
    },
    workerMessageHandler(message, workerMetadata) {
      schedulerLogger.info(`[${message.name}] ${message.message}`);
    },
  });

  schedulerLogger.info(jobs.length + " jobs created.");
  return bree;
};
