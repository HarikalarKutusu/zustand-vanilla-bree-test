// ./build.js
import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { typecheckPlugin } from "@jgoz/esbuild-plugin-typecheck";
import { dtsPlugin } from "esbuild-plugin-d.ts";

import { rmSync } from "fs";
import { spawn } from "child_process";

import pjson from "./package.json" assert { type: "json" };

const HOST = "127.0.0.1";
const PORT = 4000;

// Only delete code and types, keep cache and logs
rmSync("dist", { force: true, recursive: true });

//
// ENV
//
const isDev = process.env.NODE_ENV === "development";

//
// Plugins
//

let child;
const runPlugin = (runFile) => ({
  name: "run-node-on-build",
  setup({ onEnd }) {
    onEnd((result) => {
      if (result.errors.length === 0) {
        child && child.kill();
        child = spawn("node", [runFile], { stdio: "inherit" });
      }
    });
  },
});

//
// esbuild : BuildOptions
//
const sharedOptions = {
  bundle: true,
  minify: !isDev,
  platform: "node",
  format: "esm",
  target: "ES2020",
  banner: {
    js: `// ${pjson.name}@${pjson.version}\n// ${pjson.description}`,
    css: "/* cv-tbox */",
  },
  footer: {
    js: `// ${pjson.author} - ${pjson.license}`,
    css: "/* cv-tbox */",
  },
};

const prodOptions = {
  ...sharedOptions,
  entryPoints: ["./src/index.ts"],
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  sourcemap: "external",
  drop: ["console", "debugger"],
  plugins: [
    typecheckPlugin(),
    dtsPlugin({ outDir: "dist", tsconfig: "tsconfig.json" }),
    nodeExternalsPlugin(),
  ],
};

const devOptions = {
  ...sharedOptions,
  entryPoints: ["./src/index.ts"],
  outdir: "dist",
  outExtension: { ".js": ".mjs" },
  plugins: [
    typecheckPlugin(),
    dtsPlugin({ outDir: "dist", tsconfig: "tsconfig.json" }),
    nodeExternalsPlugin(),
    runPlugin("dist/index.mjs"),
  ],
};

const jobOptions = {
  ...sharedOptions,
  entryPoints: [
    "./src/jobs/task-1.job.ts",
    "./src/jobs/task-1-1.job.ts",
    "./src/jobs/task-1-2.job.ts",
  ],
  outdir: "dist/jobs",
  outExtension: { ".js": ".mjs" },
  plugins: [
    typecheckPlugin(),
    dtsPlugin({ outDir: "dist", tsconfig: "tsconfig.json" }),
    nodeExternalsPlugin(),
  ],
};

//
// esbuild
//
const esb_run = (c, mode) => {
  c.watch({}).then(() => console.log("==> Watching..."));
  c.serve({
    servedir: "dist",
    host: HOST,
    port: PORT,
  })
    .then((res) => {
      console.log("================================================");
      console.log(`${mode} ${pjson.name} on ${res.host}:${res.port}`);
      console.log("================================================");
    })
    .catch((e) => {
      console.log("Error:", e);
      c.dispose();
    });
};

const esb_build = () => {
  esbuild
    .build(jobOptions)
    .catch(() => process.exit(1))
    .then(() => console.log(`==> ${jobOptions.entryPoints.length} JOBS Compiled...`));
  esbuild
    .build(prodOptions)
    .catch(() => process.exit(1))
    .then(() => console.log("==> PROD Build OK"));
};

const esb_dev = async () => {
  esbuild.build(jobOptions).then(() => {
    console.log(`==> ${jobOptions.entryPoints.length} JOBS Compiled...`);
  });
  esbuild
    .context(devOptions)
    .catch(() => process.exit(1))
    .then((c) => {
      console.log("==> DEV Compiled...");
      esb_run(c, "DevServer");
    });
};

// INIT
// =============================================
const init = () => {
  if (isDev) {
    esb_dev();
  } else {
    esb_build();
  }
};

init();
