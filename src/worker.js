import { Worker } from "@temporalio/worker";
import { NativeConnection } from "@temporalio/worker";


import * as activities from "./activities.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const address = process.env.ADDRESS;
const connection = await NativeConnection.connect({ address });

async function run() {

  const worker = await Worker.create({
    connection,
    namespace: 'default',
    taskQueue: "food-order-queue",
    activities,
    workflowsPath: path.join(__dirname, "workflows.js"),
  });

  console.log("👷 Worker started! Listening on 'food-order-queue'...");
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
