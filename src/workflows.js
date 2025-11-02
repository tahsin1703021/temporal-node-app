// import { proxyActivities } from "@temporalio/workflow";

// const { sayHello } = proxyActivities({
//   startToCloseTimeout: "1 minute",
// });

// export async function helloWorkflow(name) {
//   return await sayHello(name);
// }
import { proxyActivities } from "@temporalio/workflow";

export async function initializeDataWorkflow() {
  const { initializeData } = proxyActivities({
    startToCloseTimeout: "1 minute"
  });
  return await initializeData();
}

// Order workflow remains focused on orders
export async function orderFoodWorkflow(userId, foodId, quantity, price) {
  const {
    checkUserBalance,
    checkFoodInventory,
    updateUserBalance,
    updateFoodInventory,
    createOrder
  } = proxyActivities({
    startToCloseTimeout: "1 minute"
  });

  const totalAmount = price * quantity;
  await checkUserBalance(userId, totalAmount);
  await checkFoodInventory(foodId, quantity);
  await updateUserBalance(userId, totalAmount);
  await updateFoodInventory(foodId, quantity);
  return await createOrder(userId, foodId, quantity, totalAmount);
}

export async function getInventoryWorkflow() {
  const { getInventoryAndUsers } = proxyActivities({
    startToCloseTimeout: "1 minute"
  });
  return await getInventoryAndUsers();
}