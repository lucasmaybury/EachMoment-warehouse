import { verifyAuthToken } from "../auth";
import { CallableContext } from "firebase-functions/v1/https";
import { calculateExtraCost, getOrder } from "utils";

type Params = { id: string };
type Result = {
  count: number;
  included: number;
  cost: number;
};

export const getExtraCostFn = async (
  data: Params,
  context: CallableContext
): Promise<Result> => {
  verifyAuthToken(context);
  const orderId = data.id;
  const order = await getOrder(orderId);

  if (!order) throw new Error("Order not found");
  const costInfo = calculateExtraCost(order);
  return costInfo;
};
