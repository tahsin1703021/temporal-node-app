import pkg from "@temporalio/worker";
const { Worker } = pkg;
import pkgClient from "@temporalio/client";
const { Connection } = pkgClient;

import * as activities from "./activities.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const address = process.env.TEMPORAL_ADDRESS || "localhost:7233";
console.log(address)
async function run() {
  const connection = await Connection.connect({ address });

  const worker = await Worker.create({
    workflowsPath: path.join(__dirname, "workflows.js"),
    activities,
    taskQueue: "hello-task-queue",
    //connection,
  });

  console.log("👷 Worker started! Listening on 'hello-task-queue'...");
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
