# zustand-vanilla-bree-test

For testing zustand/vanilla in Node Express server with Bree workers

Here is the setup:

- Store keeps a winston logger and a Bree scheduler
- There are 3 tasks. These tasks all use the logger from store and first one uses the scheduler from store to schedule other two tasks.
  - task-1.job.ts : Uses logger and spawns the two other jobs. It is executed every 2 minutes.
  - task-1-1.job.ts & task-1-2.job.ts: Just use logger and exit.

Problem we need to solve: setSLogger do not update sLogger, so proces gets stuck.

Notes:

- Uses esbuild with a build the provided script which also supports type checking and watch in dev mode, producing esm modules (ES2020).
- To install: npm/pnpm install
- To build: npm/pnpm build
- To run in dev mode: npm/pnpm dev
