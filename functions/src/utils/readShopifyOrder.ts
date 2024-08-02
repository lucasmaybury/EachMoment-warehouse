import { Address, LineItem, Order, Property, ShopifyOrder } from "../types";
import { MemoryBoxTypes, DefaultOrderStatus } from "../values";
import { labValueMap } from ".";
import { logger } from "firebase-functions/v1";

const parseAddress = (b: Property): Address => ({
  address1: b.address1 ?? "",
  address2: b.address2 ?? "",
  city: b.city ?? "",
  company: b.company ?? "",
  country: b.country ?? "",
  country_code: b.country_code ?? "",
  first_name: b.first_name ?? "",
  last_name: b.last_name ?? "",
  name: b.name ?? "",
  phone: b.phone ?? "",
  zip: b.zip ?? "",
});

export const readShopifyOrder = async (
  shopifyData: ShopifyOrder
): Promise<Order> => {
  const o: ShopifyOrder = shopifyData;
  logger.log(o);

  const memoryBoxes: LineItem[] = [];
  const outputFormats: LineItem[] = [];
  o.line_items?.forEach((li: Property) => {
    const newLI = {
      id: li.id,
      title: li.title,
      price: li.price,
      quantity: li.quantity,
      price_set: li.price_set,
      total_discount: li.total_discount,
      total_discount_set: li.total_discount_set,
    } as LineItem;

    if (MemoryBoxTypes.includes(li.title)) {
      memoryBoxes.push(newLI);
    } else {
      outputFormats.push(newLI);
    }
  });

  const countryCode =
    o.shipping_address.country_code ??
    o.billing_address.country_code ??
    o.customer.default_address.country_code;
  const id = `${countryCode}-${o.order_number}`;
  const newOrder: Order = {
    id,
    lab: labValueMap(countryCode),
    status: DefaultOrderStatus,
    customer_info: {
      customer_id: parseInt(o.customer.id),
      email: o.email ?? "",
      phone:
        o.phone ??
        o.customer.phone ??
        o.shipping_address.phone ??
        o.billing_address.phone ??
        "",
      billing_address: parseAddress(o.billing_address),
      shipping_address: parseAddress(o.shipping_address),
    },
    memory_boxes: memoryBoxes,
    output_formats: outputFormats,
    order_details: {
      total_price: o.total_price,
      subtotal_price: o.subtotal_price,
      currency: o.currency,
      created_at: new Date(o.created_at),
      note: o.note,
      tags: o.tags
        ?.split(",")
        .filter((e: string) => e !== "")
        .map((e: string) => e.trim()),
    },
    media_type_counts: {
      cine: 0,
      av: 0,
      photo: 0,
    },
    scanning_comments: [],
    qc_comments: [],
    comments: [],
    lab_lines: [],
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

  return newOrder;
};
