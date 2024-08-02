import { Request } from "firebase-functions/v1/https";
import { Response } from "firebase-functions/v1";
import * as crypto from "crypto";
import { Order } from "./types/sharedTypes";
import { readShopifyOrder } from "./utils/readShopifyOrder";
import { corsAllowedOrigins, SHOPIFY_WEBHOOK_SECRET } from "values";
import * as functions from "firebase-functions";
import cors from "cors";
// import { log } from "firebase-functions/logger";

export const validate = async (req: Request, res: Response): Promise<void> => {
  const rawBody = req.rawBody;
  const generated_hash = crypto
    .createHmac("sha256", Buffer.from(SHOPIFY_WEBHOOK_SECRET.value()))
    .update(Buffer.from(rawBody))
    .digest("base64");
  const hmac = req.headers["x-shopify-hmac-sha256"];
  // log(`Hash: ${generated_hash}`);
  // log(`HMAC: ${hmac}`);
  if (generated_hash !== hmac) {
    res.sendStatus(403).send();
    return;
  }
};

export const shopifyOrderWebhook =
  (executor: (order: Order) => Promise<void>) =>
  (req: Request, res: Response) =>
    validate(req, res)
      .then(() => readShopifyOrder(req.body))
      .then(executor)
      .then(() => {
        res.status(200).send("OK");
      })
      .catch((e: Error) => {
        functions.logger.error(e);
        res.status(200).send("ERROR:" + e.message);
      });

export const externalRequest =
  (executor: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response) => {
    cors({ origin: corsAllowedOrigins })(req, res, async () => {
      executor(req, res);
    });
  };
