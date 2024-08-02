// index.ts
require("module-alias/register");
import * as functions from "firebase-functions";
import { initializeApp } from "./firebase";
import { createOrderFn } from "./functions/createOrder";
import { updateOrderFn } from "./functions/updateOrder";
import { sendInvoiceFn } from "./functions/sendInvoice";
import { handleQuoteRequestFn } from "./functions/handleQuoteRequest";
import {
  SHOPIFY_ACCESS_TOKEN,
  SHOPIFY_WEBHOOK_SECRET,
  SMTP_PASS,
  SMTP_USER,
  STRIPE_API_KEY,
} from "values";
import { getExtraCostFn } from "./functions/getExtraCost";
import { sendStatusChangeEmailFn } from "./functions/statusChangeEmail";
import { genOqrPdfFn } from "./functions/genOqrPdf";
import receivedDateFn from "./functions/receivedDate";
import { statusRetrieverFn } from "./functions/statusRetriever";

initializeApp();

// Shopify Webhook Handlers

export const createOrder = functions
  .region("europe-west1")
  .runWith({ secrets: [SHOPIFY_WEBHOOK_SECRET] })
  .https.onRequest(createOrderFn);

export const updateOrder = functions
  .region("europe-west1")
  .runWith({ secrets: [SHOPIFY_WEBHOOK_SECRET] })
  .https.onRequest(updateOrderFn);

// Webapp functions

export const sendInvoice = functions
  .region("europe-west1")
  .runWith({ secrets: [STRIPE_API_KEY] })
  .https.onCall(sendInvoiceFn);

export const getExtraCost = functions
  .region("europe-west1")
  .https.onCall(getExtraCostFn);

export const genOqrPdf = functions
  .region("europe-west1")
  .https.onCall(genOqrPdfFn);

// External functions

export const statusRetriever = functions
  .region("europe-west1")
  .https.onRequest(statusRetrieverFn);

export const handleQuoteRequest = functions
  .region("europe-west1")
  .runWith({ secrets: [SHOPIFY_ACCESS_TOKEN, SMTP_USER, SMTP_PASS] })
  .https.onRequest(handleQuoteRequestFn);

// Database triggers

export const statusChangeEmail = functions
  .region("europe-west1")
  .runWith({ secrets: [SMTP_USER, SMTP_PASS] })
  .database.ref("/shopify-orders/{uid}/status")
  .onUpdate(sendStatusChangeEmailFn);

export const receivedDate = functions
  .region("europe-west1")
  .database.ref("/shopify-orders/{uid}/status")
  .onUpdate(receivedDateFn);
