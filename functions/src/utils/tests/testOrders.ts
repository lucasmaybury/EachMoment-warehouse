import { Order } from "types";

export const emptyOrder: Order = {
  id: "GB-1001",
  lab_lines: [],
  memory_boxes: [
    {
      id: 1234,
      title: "Memory Box Small",
      price: "10.00",
      quantity: 1,
      price_set: {
        presentment_money: {
          amount: "10.00",
          currency_code: "GBP",
        },
        shop_money: {
          amount: "10.00",
          currency_code: "GBP",
        },
      },
      total_discount: "0.0",
      total_discount_set: {
        presentment_money: {
          amount: "0.00",
          currency_code: "GBP",
        },
        shop_money: {
          amount: "0.00",
          currency_code: "GBP",
        },
      },
    },
  ],
  lab: "",
  status: "",
  customer_info: {
    billing_address: {
      address1: "",
      address2: "",
      city: "",
      company: "",
      country: "",
      country_code: "",
      first_name: "",
      last_name: "",
      name: "",
      phone: "",
      zip: "",
    },
    customer_id: 0,
    email: "",
    phone: "",
    shipping_address: {
      address1: "",
      address2: "",
      city: "",
      company: "",
      country: "",
      country_code: "",
      first_name: "",
      last_name: "",
      name: "",
      phone: "",
      zip: "",
    },
  },
  output_formats: [],
  media_type_counts: {
    cine: 0,
    av: 0,
    photo: 0,
  },
  scanning_comments: [],
  qc_comments: [],
  comments: [],
  order_details: {
    created_at: new Date("2024-01-01T00:00:00Z"),
    currency: "",
    note: null,
    subtotal_price: "",
    tags: [],
    total_price: "",
  },
};

export const orderWithLabLines: Order = {
  ...emptyOrder,

  lab_lines: [
    {
      id: "GB-1001-1",
      specificMediaType: "C5",
    },
    {
      id: "GB-1001-2",
      specificMediaType: "Audio Cassette",
    },
    {
      id: "GB-1001-3",
      specificMediaType: "Reel Large",
    },
  ],
};
