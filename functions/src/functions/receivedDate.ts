import { DataSnapshot } from "firebase-admin/database";
import * as functions from "firebase-functions";
import { OrderStatus } from "types";
import { getOrder, setDispatchedDate } from "utils";

const receivedDateFn = async (
  change: functions.Change<DataSnapshot>,
  context: functions.EventContext
) => {
  const orderId = context.params.uid;
  const order = await getOrder(orderId);
  if (!order) throw new Error("Order not found");
  const newStatus: OrderStatus = change.after.val();
  if (newStatus === "[MB] Received" && order.received_date === undefined) {
    await setDispatchedDate(orderId, new Date());
  }
};

export default receivedDateFn;
