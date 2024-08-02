import nodemailer from "nodemailer";
import * as functions from "firebase-functions";
import config from "../utils/config";
import { DataSnapshot, getDatabase } from "firebase-admin/database";
import { EmailTriggerStatusType } from "src/types/sharedTypes/OrderStatus";
import { emailTrackerName } from "utils";
import { log } from "firebase-functions/logger";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: true,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

const statusDescriptions: Record<EmailTriggerStatusType, string> = {
  "[MB] Dispatched":
    "the Memory Box has been dispatched from our lab and is on its way to your shipping address.",
  "[MB] Received":
    "the Memory Box has been received at our lab with the items you would like digitised.",
  "[MB] Restoration":
    "we are currently checking over your order, cleaning, and repairing items that require it. Your order is also in the queue, ready to be digitised.",
  "[MB] Digitisation": "your items are currently being digitised by our team.",
  "Quality Control":
    "your digitised items are undergoing quality checks. This is where any editing and post-processing takes place.",
  "[MB] Finalising":
    "we are loading your digitised media into the output format you requested, such as USB, DVD, or Cloud Album.",
  "[MB] Return Dispatched":
    "your Memory Box, along with the digitised media, has been sent back to you and is on its way.",
};

const statusMessages: Record<EmailTriggerStatusType, string> = {
  "[MB] Dispatched": "been dispatched.",
  "[MB] Received": "been received.",
  "[MB] Restoration": "entered restoration.",
  "[MB] Digitisation": "entered digitisation.",
  "[MB] Quality Control": "entered quality control.",
  "[MB] Finalising": "entered the finalising stage.",
  "[MB] Return Dispatched": "been dispatched back to you.",
};

export const sendStatusChangeEmailFn = async (
  change: functions.Change<DataSnapshot>,
  context: functions.EventContext
) => {
  const orderId = context.params.uid;
  const orderRef = getDatabase().ref(`/shopify-orders/${orderId}`);
  const order = await orderRef.once("value").then((snapshot) => snapshot.val());

  const { status } = order;
  const { email } = order.customer_info;
  const { first_name, last_name } = order.customer_info.shipping_address;

  if (!Object.keys(statusDescriptions).includes(status))
    throw new Error("Unknown status");

  const mailOptions = {
    from: `"EachMoment" <${config.fromEmail}>`,
    to: email,
    subject: "Update on Your Memory Box",
    text: `Dear ${first_name} ${last_name},

We are delighted to let you know that your Memory Box has ${statusMessages[status]}

This means ${statusDescriptions[status]}

Regards,
The EachMoment team.`,
  };

  await transporter.sendMail(mailOptions).catch((error) => {
    functions.logger.error("Failed to send email", error);
    throw new functions.https.HttpsError("internal", "Failed to send email.");
  });

  log("Email sent successfully");

  log({ emails_sent: { [emailTrackerName(status)]: true } });
  await orderRef.child("emails_sent").update({
    [emailTrackerName(status)]: true,
  });

  return { success: true, message: "Email sent successfully" };
};
