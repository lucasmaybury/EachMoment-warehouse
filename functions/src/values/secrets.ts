import { defineSecret } from "firebase-functions/params";

export const SHOPIFY_WEBHOOK_SECRET = defineSecret("SHOPIFY_WEBHOOK_SECRET");
export const SHOPIFY_ACCESS_TOKEN = defineSecret("SHOPIFY_ACCESS_TOKEN");

export const SMTP_USER = defineSecret("SMTP_USER");
export const SMTP_PASS = defineSecret("SMTP_PASS");

export const STRIPE_API_KEY = defineSecret("STRIPE_API_KEY");
