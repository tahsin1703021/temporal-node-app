import express from "express";
// 💡 FIX 1: Import Connection along with WorkflowClient
import { Connection, WorkflowClient } from "@temporalio/client"; 

const app = express();
app.use(express.json());

const address = "temporal:7233";

// Define client globally but don't initialize it yet
let client; 

async function initializeApp() {
    try {
        // 💡 FIX 2: Await the Connection setup
        const connection = await Connection.connect({ address });
        
        // 💡 FIX 3: Initialize the client with the awaited connection object
        client = new WorkflowClient({ connection });

        // --- Express Routes ---
        app.post("/start", async (req, res) => {
            const { name } = req.body;

            try {
                // client is now guaranteed to be ready and connected
                const handle = await client.start("helloWorkflow", {
                    taskQueue: "hello-task-queue",
                    workflowId: `wf-${Date.now()}`,
                    args: [name || "World"],
                });

                res.send(`✅ Workflow started with ID: ${handle.workflowId}`);
            } catch (err) {
                console.error("Error starting workflow:", err);
                // Send the error message, not the full error object
                res.status(500).send({ message: "Failed to start workflow.", details: err.message });
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

// Start the initialization process
initializeApp();