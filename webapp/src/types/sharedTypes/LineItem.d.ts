export type LineItem = {
  id: number;
  title: string;
  price: string;
  quantity: number;
  price_set: PriceSet;
  total_discount: string;
  total_discount_set: PriceSet;
};

type AmountAndCurrencyCode = {
  amount: string;
  currency_code: string;
};

type PriceSet = {
  presentment_money: AmountAndCurrencyCode;
  shop_money: AmountAndCurrencyCode;
};
