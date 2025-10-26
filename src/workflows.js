import { proxyActivities } from "@temporalio/workflow";

const { sayHello } = proxyActivities({
  startToCloseTimeout: "1 minute",
});

export async function helloWorkflow(name) {
  return await sayHello(name);
}
