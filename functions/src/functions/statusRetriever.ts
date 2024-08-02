// ./functions/statusRetriever.ts
import { Request } from "firebase-functions/v1/https";
import { Response } from "firebase-functions/v1";
import { log } from "firebase-functions/logger";
import { getOrder } from "utils";
import { externalRequest } from "../middleware";

const statusMessages: Record<string, string> = {
  "[MB] Dispatched":
    "Your Memory Box has been dispatched and is on its way to you.",
  "[MB] Received":
    "We have received your Memory Box with the media you would like digitised at the lab. It will enter the restoration process the same day.",
  "[MB] Restoration":
    "We are reviewing the contents of your order, cleaning, and repairing any media that needs it before digitisation. Once this is complete, it will enter the queue for digitisation. This is usually the longest stage of the process, so please don't worry if your order seems to take longer here.",
  "[MB] Digitisation":
    "We are currently digitising the contents of your Memory Box.",
  "[MB] Quality Control":
    "We are reviewing the quality of the digitisation of your Memory Box and ensuring it is ready to proceed to the finalising stage.",
  "[MB] Finalising":
    "We are loading your digitised media onto your chosen output format, such as USB or Cloud Album.",
  "[MB] Return Dispatched":
    "Your Memory Box, along with your media and digitised files, is on its way back to you.",
};

// List of possible country code prefixes
const countryPrefixes = ["GB-", "DE-", "HR-", "IT-", "IE-", "SI-", "AT-"];

const findOrder = async (orderNumber: string) => {
  let order = await getOrder(orderNumber);

  if (!order) {
    for (const prefix of countryPrefixes) {
      getOrder(`${prefix}${orderNumber}`).then((result) => {
        order = result;
      });
    }
  }

  return order;
};

export const statusRetrieverFn = externalRequest(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderNumber, orderEmail } = req.body;

      if (!orderNumber || !orderEmail) {
        res.status(400).json({ error: "Missing order number or email" });
        return;
      }

      log("Retrieving status for order number:", orderNumber);

      const order = await findOrder(orderNumber);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const {
        customer_info: { email },
        status,
      } = order;
      if (email !== orderEmail) {
        res.status(403).json({ error: "Email does not match" });
        return;
      }

      const statusMessage =
        statusMessages[status] ||
        "Please allow 48 hours after purchase to recieve your first status";
      res.json({ status: statusMessage });
    } catch (error) {
      log("Error retrieving order status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
