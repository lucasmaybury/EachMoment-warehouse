import Shopify from "shopify-api-node";
import { Quote } from "types";
import { SHOPIFY_ACCESS_TOKEN } from "values";
import * as functions from "firebase-functions";
import { log } from "firebase-functions/logger";

let shopifyClient: Shopify | null = null;
export const getShopifyClient = () => {
  if (!shopifyClient) {
    shopifyClient = new Shopify({
      shopName: functions.config().shopify.shopname,
      accessToken: SHOPIFY_ACCESS_TOKEN.value(),
    });
  }
  return shopifyClient;
};

export const getCustomerByEmail = async (email: string) => {
  log(`Searching for customer ${email}...`);
  const shopify = getShopifyClient();
  const customer =
    (
      await shopify.customer
        .search({
          query: `email:${email}`,
        })
        .catch((error) => {
          functions.logger.error(error);
          throw error;
        })
    )[0] ?? null;
  log(customer ? `Found: ${customer.id}` : "Not found.");
  return customer;
};

export const updateCustomerLocale = async (
  customer: Shopify.ICustomer,
  locale: string
) => {
  log("Updating customer:", customer.id);
  const shopify = getShopifyClient();
  await shopify.customer.update(customer.id, { locale });
  log("Updated");
};

export const createCustomerFromQuote = async (quote: Quote) => {
  log(`Creating customer ${quote.email}...`);
  const shopify = getShopifyClient();
  const customer = await shopify.customer.create({
    first_name: quote.f_name,
    last_name: quote.l_name,
    email: quote.email,
    locale: quote.locale,
  });
  log("Created");
  return customer;
};
