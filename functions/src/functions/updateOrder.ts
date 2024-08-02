import { getDatabase } from "firebase-admin/database";
import type { Order } from "types";
import { log } from "firebase-functions/logger";
import { getOrder } from "utils";
import { shopifyOrderWebhook } from "../middleware";

export const updateOrderFn = shopifyOrderWebhook(
  async (order: Order): Promise<void> => {
    log("Updating order: ", order.id);

    const db = getDatabase();
    const ordersRef = db.ref("shopify-orders");

    const currentOrder = await getOrder(order.id);
    if (!currentOrder || Object.keys(currentOrder).length == 0) {
      throw new Error("Order doesn't exists");
    }
    const { customer_info, memory_boxes, output_formats, order_details } =
      order;
    const newOrder = {
      ...currentOrder,
      customer_info,
      memory_boxes,
      output_formats,
      order_details,
    };
    return ordersRef.child(order.id).set(newOrder);
  }
);
