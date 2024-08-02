import { calculateExtraCost } from "../index";
import { emptyOrder, orderWithLabLines } from "./testOrders";

test("calculateExtraCost returns expected for empty order", async () => {
  const result = calculateExtraCost(emptyOrder);
  expect(result).toEqual({ count: 0, included: 3, unitCost: 15, cost: 0 });
});

test("calculateExtraCost returns expected for order with lab lines", async () => {
  const result = calculateExtraCost(orderWithLabLines);
  expect(result).toEqual({ count: 4, included: 3, unitCost: 15, cost: 15 });
});
