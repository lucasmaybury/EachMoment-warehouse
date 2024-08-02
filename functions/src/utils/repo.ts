import { getDatabase } from "firebase-admin/database";
import { Order } from "types";

export const getOrder = async (orderId: string): Promise<Order | null> =>
  new Promise((resolve) => {
    const db = getDatabase();
    const ordersRef = db.ref("shopify-orders");
    ordersRef.child(orderId.toString()).once("value", (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
      }
      resolve(null);
    });
  });

export const updateOrder = async (
  orderId: string,
  updates: Partial<Order>
): Promise<void> => {
  const db = getDatabase();
  const ordersRef = db.ref("shopify-orders");
  return ordersRef.child(orderId).update({ ...updates });
};

export const setDispatchedDate = async (
  orderId: string,
  date: Date
): Promise<void> => {
  updateOrder(orderId, { received_date: date });
};

export const setOrderInvoiceSent = async (orderId: string): Promise<void> => {
  const db = getDatabase();
  const ordersRef = db.ref("shopify-orders");
  return ordersRef.child(orderId).update({ invoice_sent: true });
};
