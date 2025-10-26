import express from "express";
import { WorkflowClient } from "@temporalio/client";

const app = express();
app.use(express.json());

const address = process.env.TEMPORAL_ADDRESS || "localhost:7233";
const client = new WorkflowClient({ connection: { address } });

app.post("/start", async (req, res) => {
  const { name } = req.body;

  try {
    const handle = await client.start("helloWorkflow", {
      taskQueue: "hello-task-queue",
      workflowId: `wf-${Date.now()}`,
      args: [name || "World"],
    });

    res.send(`✅ Workflow started with ID: ${handle.workflowId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(3000, () => console.log("🚀 Express server running at http://localhost:3000"));
