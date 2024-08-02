import type { Order } from "../../types";

export const expectedOrder: Order = {
  id: "GB-1061",
  lab: "UK",
  status: "Default",
  customer_info: {
    billing_address: {
      first_name: "Joe",
      last_name: "Bloggs",
      address1: "Buckingham Palace",
      address2: "",
      city: "London",
      company: "",
      country: "United Kingdom",
      phone: "",
      country_code: "GB",
      zip: "SW1A 1AA",
      name: "Joe Bloggs",
    },
    customer_id: 123412341234,
    email: "example@eachmoment.co.uk",
    phone: "",
    shipping_address: {
      first_name: "Joe",
      last_name: "Bloggs",
      address1: "Buckingham Palace",
      address2: "",
      city: "London",
      company: "",
      country: "United Kingdom",
      phone: "",
      country_code: "GB",
      zip: "SW1A 1AA",
      name: "Joe Bloggs",
    },
  },
  memory_boxes: [
    {
      id: 123412341234,
      title: "Memory Box Small",
      price: "75.00",
      quantity: 1,
      price_set: {
        shop_money: {
          amount: "75.00",
          currency_code: "GBP",
        },
        presentment_money: {
          currency_code: "GBP",
          amount: "75.00",
        },
      },
      total_discount: "0.00",
      total_discount_set: {
        shop_money: {
          currency_code: "GBP",
          amount: "0.00",
        },
        presentment_money: {
          currency_code: "GBP",
          amount: "0.00",
        },
      },
    },
  ],
  output_formats: [
    {
      id: 123412341234,
      title: "USB Classic",
      price: "9.99",
      quantity: 1,
      price_set: {
        presentment_money: {
          currency_code: "GBP",
          amount: "9.99",
        },
        shop_money: {
          currency_code: "GBP",
          amount: "9.99",
        },
      },
      total_discount: "0.00",
      total_discount_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "GBP",
        },
        presentment_money: {
          currency_code: "GBP",
          amount: "0.00",
        },
      },
    },
    {
      id: 123412341234,
      price: "50.00",
      price_set: {
        presentment_money: {
          amount: "50.00",
          currency_code: "GBP",
        },
        shop_money: {
          amount: "50.00",
          currency_code: "GBP",
        },
      },
      quantity: 1,
      title: "Rush Processing",
      total_discount: "0.00",
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
  lab_lines: [],
  media_type_counts: {
    cine: 0,
    av: 0,
    photo: 0,
  },
  scanning_comments: [],
  qc_comments: [],
  comments: [],
  order_details: {
    total_price: "84.99",
    subtotal_price: "84.99",
    currency: "GBP",
    created_at: new Date("2024-03-21T04:56:17+00:00"),
    note: null,
    tags: [],
  },
  emails_sent: {
    Dispatched: false,
    Received: false,
    Restoration: false,
    Digitisation: false,
    Quality_Control: false,
    Finalising: false,
    Return_Dispatched: false,
  },
};
