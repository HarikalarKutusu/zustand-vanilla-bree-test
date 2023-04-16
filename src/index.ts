// ./src/index.ts

import express, { Request, Response } from "express";
import cors from "cors";
import Bree, { Job } from "bree/types";
import Graceful, { GracefulOptions } from "@ladjs/graceful";
import winston from "winston";

import { store } from "./stores/store";
import { logger } from "./components/logger";
import { schedulerService } from "./components/scheduler";

// file & path
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//
// Config
//
const config = {
  PORT: 4000,
  LOGDIR: "logs",
  LOGFILE: "jobs.log",
};

//
// Express
//

console.log("----------------- STARTING SERVER -------------------");
const app = express();
app.use(cors());
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello express...");
});

app.listen(config.PORT, () => {
  console.log("==> Listening on port ", config.PORT);
});

// =======================================
// Scheduler
// =======================================

// store
const { getState, setState } = store;
const { sLogger, setSLogger } = getState();
const { scheduler, setScheduler } = getState();

// logging
const logDir = path.join(__dirname, config.LOGDIR);
const schedulerLogFile = path.join(logDir, config.LOGFILE);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
console.log("==> Logging jobs to", schedulerLogFile);
setSLogger(logger(schedulerLogFile));

// here sLogger is undefined ???
if (sLogger) {
  console.log("==> Scheduling initial jobs...");
  setScheduler(schedulerService(sLogger));
}
