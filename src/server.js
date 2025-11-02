import express from "express";
// 💡 FIX 1: Import Connection along with WorkflowClient
import { Connection, WorkflowClient } from "@temporalio/client"; 

const app = express();
app.use(express.json());

const address = process.env.ADDRESS;

// Define client globally but don't initialize it yet
let client; 
let initialized = false;

async function initializeApp() {
    try {
      const connection = await Connection.connect({ address });

      client = new WorkflowClient({ connection });

      if (!initialized) {
        await client.execute("initializeDataWorkflow", {
          taskQueue: "food-order-queue",
          workflowId: "init-data",
        });
        initialized = true;
        console.log("✅ Data initialized successfully");
      }

      // --- Express Routes ---
      app.post("/api/orders", async (req, res) => {
        const { userId, foodId, quantity, price } = req.body;

        if (!userId || !foodId || !quantity || !price) {
          return res.status(400).json({
            error: "Missing required fields",
          });
        }

        try {
          // client is now guaranteed to be ready and connected
          const handle = await client.start("orderFoodWorkflow", {
            taskQueue: "food-order-queue",
            workflowId: `order-${Date.now()}`,
            args: [userId, foodId, quantity, price],
          });

          res.json({
            success: true,
            message: "Order processing started",
            workflowId: handle.workflowId,
          });

          handle
            .result()
            .then((result) => {
              console.log(
                `Order completed for workflow ${handle.workflowId}:`,
                result
              );
            })
            .catch((err) => {
              console.error(
                `Order failed for workflow ${handle.workflowId}:`,
                err
              );
            });
        } catch (err) {
          console.error("Order error:", err);
          res.status(400).json({
            success: false,
            error: err.message,
          });
        }
      });

      app.get("/api/inventory", async (req, res) => {
        try {
          const result = await client.execute("getInventoryWorkflow", {
            taskQueue: "food-order-queue",
            workflowId: `get-inventory-${Date.now()}`,
          });

          res.json({
            success: true,
            data: result,
          });
        } catch (err) {
          res.status(500).json({
            success: false,
            error: err.message,
          });
        }
      });

      app.listen(3000, () =>
        console.log("🚀 Express server running at http://localhost:3000")
      );
    } catch (err) {
        console.error("❌ Fatal error during Client initialization. Temporal not reachable:", err.message);
        process.exit(1);
    }
}

initializeApp();