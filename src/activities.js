let users = new Map();
let foods = new Map();
let orders = new Map();

export async function initializeData() {
  users.set("user1", {
    id: "user1",
    name: "John Doe",
    balance: 100
  });
  users.set("user2", {
    id: "user2",
    name: "Jane Smith",
    balance: 200
  });

  // Initialize foods
  foods.set("food1", {
    id: "food1",
    name: "Burger",
    price: 10,
    quantity: 5
  });
  foods.set("food2", {
    id: "food2",
    name: "Pizza",
    price: 15,
    quantity: 8
  });

  return {
    users: Array.from(users.values()),
    foods: Array.from(foods.values())
  };
}

export async function checkUserBalance(userId, totalAmount) {
   const user = users.get(userId);
  if (!user) throw new Error('User not found');

  if (typeof totalAmount !== 'number' || totalAmount <= 0) throw new Error('Invalid amount');
  
  const remaining = user.balance - totalAmount;
  if (remaining <= 0) throw new Error('Insufficient balance');

  if (remaining < totalAmount) {
    throw new Error(`Insufficient balance: must keep the order to ${remaining} dollars or less`);
  }
  return true;
}

export async function checkFoodInventory(foodId, quantity) {
  const food = foods.get(foodId);
  if (!food) throw new Error('Food not found');
  if (typeof quantity !== 'number' || quantity <= 0) throw new Error('Invalid quantity');

  const foodRemaining = food.quantity - quantity;
  if (foodRemaining <= 0) throw new Error('Insufficient inventory');

  if (food.quantity < quantity)  throw new Error(`Insufficient inventory: must keep at most ${quantity} items`);
  return true;
}

export async function updateUserBalance(userId, amount) {
  const user = users.get(userId);

  if (user.balance <= 0 || user.balance - amount < 0)
    throw new Error("Insufficient balance to deduct");

  user.balance -= amount;
  users.set(userId, user);

  return user.balance;
}

export async function updateFoodInventory(foodId, quantity) {
  const food = foods.get(foodId);
  food.quantity -= quantity;
  foods.set(foodId, food);
  return food.quantity;
}

export async function createOrder(userId, foodId, quantity, totalAmount) {
  const order = {
    id: Date.now().toString(),
    userId,
    foodId,
    quantity,
    totalAmount,
    status: 'COMPLETED'
  };
  orders.set(order.id, order);
  return order;
}

export async function getInventoryAndUsers() {
  return {
    users: Array.from(users.values()),
    foods: Array.from(foods.values())
  };
}