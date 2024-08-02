import { getDatabase } from "firebase-admin/database";
import type { Order } from "types";
import { log } from "firebase-functions/logger";
import { getOrder } from "utils";
import { shopifyOrderWebhook } from "../middleware";

export const createOrderFn = shopifyOrderWebhook(
  async (order: Order): Promise<void> => {
    log("Creating order: ", order.id);

    const db = getDatabase();
    const ordersRef = db.ref("shopify-orders");
    const orderDb = await getOrder(order.id);
    if (orderDb) {
      throw new Error("Order already exists");
    }
    return ordersRef.child(order.id).set(order);
  }
);
