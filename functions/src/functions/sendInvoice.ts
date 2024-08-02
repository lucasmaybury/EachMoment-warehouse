import Stripe from "stripe";
import { STRIPE_API_KEY } from "values";
import { calculateExtraCost, getOrder, setOrderInvoiceSent } from "utils";
import { log } from "firebase-functions/logger";
import { verifyAuthToken } from "../auth";
import { CallableContext } from "firebase-functions/v1/https";

type Params = { orderId: string };
type Result = {
  success: boolean;
};

export const sendInvoiceFn = async (
  data: Params,
  context: CallableContext
): Promise<Result> => {
  verifyAuthToken(context);

  const stripe = new Stripe(STRIPE_API_KEY.value());

  const orderId = data.orderId;
  const order = await getOrder(orderId);
  if (!order) throw new Error("Order not found");
  if (order.lab !== "UK")
    throw new Error("Invoicing only available for UK orders");

  const { count, included, unitCost } = calculateExtraCost(order);
  const extraItems = count - included;

  if (count == 0 || extraItems == 0 || order.invoice_sent)
    throw new Error("No extra items to invoice");

  const customerSearch = await stripe.customers.search({
    query: `email~'${order.customer_info.email}'`,
  });
  log("Search results", customerSearch);

  let customerId = null;
  if (customerSearch.data.length) {
    log("Found: ", customerSearch);
    customerId = customerSearch.data[0].id;
  } else {
    const newCustomer = await stripe.customers.create({
      name: `${order.customer_info.billing_address.first_name} ${order.customer_info.billing_address.last_name}`,
      email: order.customer_info.email,
      address: {
        city: order.customer_info.billing_address.city,
        country: order.customer_info.billing_address.country,
        line1: order.customer_info.billing_address.address1,
        line2: order.customer_info.billing_address.address2,
        postal_code: order.customer_info.billing_address.zip,
        state: "",
      },
      description: "Customer created from API",
      phone: order.customer_info.billing_address.phone,
    });
    log("Not found, created: ", newCustomer);
    customerId = newCustomer.id;
  }

  const invoice = await stripe.invoices.create({
    customer: customerId,
    custom_fields: [
      {
        name: "orderId",
        value: orderId,
      },
    ],
    collection_method: "send_invoice", // send_invoice / charge_automatically
    days_until_due: 3,
    description: `For your order ${order.id}, we received ${count} items in your Memory Box. ${extraItems} more than the ${included} items that came prepaid with your package. 

Please use the link to pay for the additional items so we can continue processing your order. 

Please keep in mind we will not be able to complete your order until this invoice has been settled.

One item refers to a tape, a reel, a cassette or 25 pictures. 5 inch (and above) cine reels are counted as two items.`,
  });

  await stripe.invoiceItems.create({
    customer: customerId,
    description: "Extra item(s) to be digitised",
    unit_amount: unitCost * 100,
    quantity: extraItems,
    currency: "gbp",
    invoice: invoice.id,
  });

  await stripe.invoices.sendInvoice(invoice.id);

  await setOrderInvoiceSent(orderId);

  return { success: true };
};
