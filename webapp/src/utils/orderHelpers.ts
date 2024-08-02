import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { Order, LabLine, OrderStatus } from "types";
import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
  get,
} from "firebase/database";
import { getMediaTypeCounts } from "./utils";
import { database } from "../firebase";
dayjs.extend(utc);

export const readInOrder = (id: string, order: Order): Order => ({
  ...order,
  id,
});

export const listenForOrder = async (
  id: string,
  setOrder: (order: Order) => void
): Promise<Order> =>
  new Promise((resolve, reject) => {
    const query = ref(database, `shopify-orders/${id}`);
    onValue(query, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setOrder(data as Order);
        resolve(data);
      } else {
        reject("order not found");
      }
    });
  });

export const getOrderOnce = async (id: string): Promise<Order | null> => {
  const query = ref(database, `shopify-orders/${id}`);
  let order;
  await get(query).then((snapshot) => {
    if (snapshot.exists()) {
      order = snapshot.val();
    }
  });
  return order ?? null;
};

export const writeOrderData = async (order: Order) => {
  const db = getDatabase();
  await set(ref(db, "shopify-orders/" + order.id), order);
  return;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
) => {
  const db = getDatabase();
  const updates: Record<string, string> = {};
  updates[`/shopify-orders/${orderId}/status`] = status;
  return update(ref(db), updates);
};

export const removeCDL = async (order: Order) => {
  const db = getDatabase();
  const orderRef = ref(db, "shopify-orders/" + order.id + "/CDL");

  remove(orderRef);
};

export const addLabLine = async (order: Order, newLabLine: LabLine) => {
  const labLineIds = order?.lab_lines?.map((i) => i.id) ?? [];

  if (labLineIds.includes(newLabLine.id)) {
    throw new Error("ID already exists");
  }
  const newLabLines = [...(order.lab_lines ?? []), newLabLine];

  await writeOrderData({
    ...order,
    media_type_counts: getMediaTypeCounts(newLabLines),
    lab_lines: newLabLines,
  });
};

export const removeLabLine = (order: Order, id: string) => {
  if (!id) {
    return;
  }
  const newLabLines = order.lab_lines?.filter((i) => i.id !== id);
  writeOrderData({
    ...order,
    media_type_counts: getMediaTypeCounts(newLabLines),
    lab_lines: newLabLines,
  });
};
