import { expectedOrder as expected } from "./OrderExpected";
import * as original from "./OrderOriginal.json";
import { readShopifyOrder } from "../index";

test("createOrderFn returns expected", async () => {
  const result = await readShopifyOrder(original);

  expect(result).toEqual(expected);
});
