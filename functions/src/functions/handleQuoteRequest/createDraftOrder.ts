import * as Shopify from "shopify-api-node";
import { DraftOrderSubmission, Quote } from "types";
import { MEMORY_BOX_PROJECT_ID, regionCodeToCountryMap } from "values";
import { getShopifyClient } from "utils";
import { log } from "firebase-functions/logger";

export const createDraftOrder = async (
  quote: Quote,
  customerId: number
): Promise<Shopify.IDraftOrder> => {
  log("Creating draft order from quote:");
  log(quote);
  const shopify = getShopifyClient();
  const draftOrder = await prepareDraftOrderSubmission(quote, customerId);
  log("Sending draft order submission:");
  log(draftOrder);
  const result = await shopify.draftOrder.create(draftOrder);
  log("Draft order created successfully:", draftOrder);
  return result;
};

export const addPdfUrlToDraftOrder = async (
  draftOrderId: number,
  pdfUrl: string
): Promise<void> => {
  const shopify = getShopifyClient();
  const metafield = {
    namespace: "custom",
    key: "invoice_pdf",
    value: pdfUrl,
    type: "url",
  };
  await shopify.draftOrder.update(draftOrderId, {
    metafields: [metafield],
  });
  log("PDF uploaded to draft order:", pdfUrl);
};

const prepareDraftOrderSubmission = async (
  quote: Quote,
  customerId: number
): Promise<DraftOrderSubmission> => ({
  customer: { id: customerId },
  email: quote.email,
  line_items: [
    {
      variant_id: await getProductDefaultVariantId(MEMORY_BOX_PROJECT_ID),
      quantity: 1,
    },
  ],
  shipping_address: {
    first_name: quote.f_name ?? "" ?? "",
    last_name: quote.l_name ?? "",
    address1: quote.Adresse1 ?? "",
    address2: quote.Adresse2 ?? "",
    city: quote.Adresse3 ?? "",
    province: quote.Adresse4 ?? "",
    country: regionCodeToCountryMap[quote.locale],
    country_code: quote.locale,
    zip: "",
  },
  note: quote.note,
});

const getProductDefaultVariantId = async (productId: number) => {
  const shopify = getShopifyClient();
  const product = await shopify.product.get(productId);
  const defaultVariantId = product.variants[0].id;
  return defaultVariantId;
};
